package repository

import (
	"time"

	"github.com/beki55/go-ecommerce/services/cart/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CartRepository interface {
	Create(cart *models.Cart) error
	GetByID(id uuid.UUID) (*models.Cart, error)
	GetByUserID(userID uuid.UUID) (*models.Cart, error)
	GetBySessionID(sessionID string) (*models.Cart, error)
	Update(cart *models.Cart) error
	Delete(id uuid.UUID) error
	CleanupExpiredCarts() error
}

type cartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) CartRepository {
	return &cartRepository{db: db}
}

func (r *cartRepository) Create(cart *models.Cart) error {
	return r.db.Create(cart).Error
}

func (r *cartRepository) GetByID(id uuid.UUID) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items").First(&cart, id).Error
	return &cart, err
}

func (r *cartRepository) GetByUserID(userID uuid.UUID) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items").Where("user_id = ?", userID).First(&cart).Error
	return &cart, err
}

func (r *cartRepository) GetBySessionID(sessionID string) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items").Where("session_id = ?", sessionID).First(&cart).Error
	return &cart, err
}

func (r *cartRepository) Update(cart *models.Cart) error {
	return r.db.Save(cart).Error
}

func (r *cartRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Cart{}, id).Error
}

func (r *cartRepository) CleanupExpiredCarts() error {
	return r.db.Where("expires_at < ?", time.Now()).Delete(&models.Cart{}).Error
}