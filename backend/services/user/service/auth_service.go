package service

import (
	"context"
	"errors"
	"time"

	"github.com/beki55/go-ecommerce/pkg/common"
	"github.com/beki55/go-ecommerce/pkg/utils"
	"github.com/beki55/go-ecommerce/services/user/models"
	"github.com/beki55/go-ecommerce/services/user/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(ctx context.Context, name, email, password string) (*models.User, string, string, error) // user, access, refresh
	Login(ctx context.Context, email, password string) (*models.User, string, string, error) // user, access, refresh
	GoogleLogin(ctx context.Context, idToken string) (*models.User, string, string, error)
}

type authService struct {
	repo          repository.UserRepository
	firebaseUtils *utils.FirebaseApp
	jwtSecret     string
}

func NewAuthService(repo repository.UserRepository, firebaseUtils *utils.FirebaseApp, jwtSecret string) AuthService {
	return &authService{
		repo:          repo,
		firebaseUtils: firebaseUtils,
		jwtSecret:     jwtSecret,
	}
}

func (s *authService) Register(ctx context.Context, name, email, password string) (*models.User, string, string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", "", err
	}

	user := &models.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         common.RoleCustomer,
		IsActive:     true,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, "", "", err
	}

	accessToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 15*time.Minute)
	if err != nil {
		return nil, "", "", err
	}

	refreshToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 7*24*time.Hour)
	if err != nil {
		return nil, "", "", err
	}

	return user, accessToken, refreshToken, nil
}

func (s *authService) Login(ctx context.Context, email, password string) (*models.User, string, string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, "", "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, "", "", errors.New("invalid credentials")
	}

	accessToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 15*time.Minute)
	if err != nil {
		return nil, "", "", err
	}

	refreshToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 7*24*time.Hour)
	if err != nil {
		return nil, "", "", err
	}

	return user, accessToken, refreshToken, nil
}

func (s *authService) GoogleLogin(ctx context.Context, idToken string) (*models.User, string, string, error) {
	decodedToken, err := s.firebaseUtils.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, "", "", err
	}

	email := decodedToken.Claims["email"].(string)
	name := decodedToken.Claims["name"].(string)

	user, err := s.repo.FindByEmail(email)
	if err != nil {
		// Create new user if not exists
		user = &models.User{
			Name:     name,
			Email:    email,
			Role:     common.RoleCustomer,
			IsActive: true,
		}
		if err := s.repo.Create(user); err != nil {
			return nil, "", "", err
		}
	}

	accessToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 15*time.Minute)
	if err != nil {
		return nil, "", "", err
	}

	refreshToken, err := utils.GenerateToken(user.ID, string(user.Role), s.jwtSecret, 7*24*time.Hour)
	if err != nil {
		return nil, "", "", err
	}

	return user, accessToken, refreshToken, nil
}
