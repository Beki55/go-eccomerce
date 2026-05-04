package service

import (
	"errors"
	"time"

	"github.com/beki55/go-ecommerce/services/cart/models"
	"github.com/beki55/go-ecommerce/services/cart/repository"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type CartService interface {
	GetOrCreateCart(userID *uuid.UUID, sessionID *string) (*models.Cart, error)
	AddItem(cartID uuid.UUID, productID uuid.UUID, variantID *uuid.UUID, quantity int, unitPrice decimal.Decimal) error
	UpdateItemQuantity(cartID uuid.UUID, itemID uuid.UUID, quantity int) error
	RemoveItem(cartID uuid.UUID, itemID uuid.UUID) error
	ClearCart(cartID uuid.UUID) error
	ApplyCoupon(cartID uuid.UUID, couponCode string, discountAmount decimal.Decimal) error
	RemoveCoupon(cartID uuid.UUID) error
	GetCart(cartID uuid.UUID) (*models.Cart, error)
	MergeCarts(userID uuid.UUID, sessionID string) error
	CleanupExpiredCarts() error
}

type cartService struct {
	repo repository.CartRepository
}

func NewCartService(repo repository.CartRepository) CartService {
	return &cartService{repo: repo}
}

func (s *cartService) GetOrCreateCart(userID *uuid.UUID, sessionID *string) (*models.Cart, error) {
	var cart *models.Cart
	var err error

	if userID != nil {
		cart, err = s.repo.GetByUserID(*userID)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
	} else if sessionID != nil {
		cart, err = s.repo.GetBySessionID(*sessionID)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
	}

	if cart == nil {
		// Create new cart
		cart = &models.Cart{
			UserID:    userID,
			SessionID: sessionID,
			ExpiresAt: time.Now().Add(30 * 24 * time.Hour), // 30 days
		}
		err = s.repo.Create(cart)
		if err != nil {
			return nil, err
		}
	}

	return cart, nil
}

func (s *cartService) AddItem(cartID uuid.UUID, productID uuid.UUID, variantID *uuid.UUID, quantity int, unitPrice decimal.Decimal) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	// Check if item already exists
	var existingItem *models.CartItem
	for i := range cart.Items {
		if cart.Items[i].ProductID == productID && cart.Items[i].VariantID == variantID {
			existingItem = &cart.Items[i]
			break
		}
	}

	if existingItem != nil {
		// Update quantity
		existingItem.Quantity += quantity
		existingItem.TotalPrice = unitPrice.Mul(decimal.NewFromInt(int64(existingItem.Quantity)))
	} else {
		// Add new item
		totalPrice := unitPrice.Mul(decimal.NewFromInt(int64(quantity)))
		item := models.CartItem{
			CartID:     cartID,
			ProductID:  productID,
			VariantID:  variantID,
			Quantity:   quantity,
			UnitPrice:  unitPrice,
			TotalPrice: totalPrice,
		}
		cart.Items = append(cart.Items, item)
	}

	return s.repo.Update(cart)
}

func (s *cartService) UpdateItemQuantity(cartID uuid.UUID, itemID uuid.UUID, quantity int) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	for i := range cart.Items {
		if cart.Items[i].ID == itemID {
			if quantity <= 0 {
				// Remove item
				cart.Items = append(cart.Items[:i], cart.Items[i+1:]...)
			} else {
				cart.Items[i].Quantity = quantity
				cart.Items[i].TotalPrice = cart.Items[i].UnitPrice.Mul(decimal.NewFromInt(int64(quantity)))
			}
			break
		}
	}

	return s.repo.Update(cart)
}

func (s *cartService) RemoveItem(cartID uuid.UUID, itemID uuid.UUID) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	for i := range cart.Items {
		if cart.Items[i].ID == itemID {
			cart.Items = append(cart.Items[:i], cart.Items[i+1:]...)
			break
		}
	}

	return s.repo.Update(cart)
}

func (s *cartService) ClearCart(cartID uuid.UUID) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	cart.Items = []models.CartItem{}
	return s.repo.Update(cart)
}

func (s *cartService) ApplyCoupon(cartID uuid.UUID, couponCode string, discountAmount decimal.Decimal) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	cart.CouponCode = &couponCode
	cart.DiscountAmount = discountAmount
	return s.repo.Update(cart)
}

func (s *cartService) RemoveCoupon(cartID uuid.UUID) error {
	cart, err := s.repo.GetByID(cartID)
	if err != nil {
		return err
	}

	cart.CouponCode = nil
	cart.DiscountAmount = decimal.Zero
	return s.repo.Update(cart)
}

func (s *cartService) GetCart(cartID uuid.UUID) (*models.Cart, error) {
	return s.repo.GetByID(cartID)
}

func (s *cartService) MergeCarts(userID uuid.UUID, sessionID string) error {
	sessionCart, err := s.repo.GetBySessionID(sessionID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil // No session cart to merge
		}
		return err
	}

	userCart, err := s.repo.GetByUserID(userID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if userCart == nil {
		// Convert session cart to user cart
		sessionCart.UserID = &userID
		sessionCart.SessionID = nil
		return s.repo.Update(sessionCart)
	}

	// Merge items
	for _, sessionItem := range sessionCart.Items {
		found := false
		for i := range userCart.Items {
			if userCart.Items[i].ProductID == sessionItem.ProductID && userCart.Items[i].VariantID == sessionItem.VariantID {
				userCart.Items[i].Quantity += sessionItem.Quantity
				userCart.Items[i].TotalPrice = userCart.Items[i].UnitPrice.Mul(decimal.NewFromInt(int64(userCart.Items[i].Quantity)))
				found = true
				break
			}
		}
		if !found {
			sessionItem.CartID = userCart.ID
			userCart.Items = append(userCart.Items, sessionItem)
		}
	}

	// Update user cart
	err = s.repo.Update(userCart)
	if err != nil {
		return err
	}

	// Delete session cart
	return s.repo.Delete(sessionCart.ID)
}

func (s *cartService) CleanupExpiredCarts() error {
	return s.repo.CleanupExpiredCarts()
}