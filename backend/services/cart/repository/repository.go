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
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) GetByUserID(userID uuid.UUID) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) GetBySessionID(sessionID string) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items").Where("session_id = ?", sessionID).First(&cart).Error
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) Update(cart *models.Cart) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Cart{}).Where("id = ?", cart.ID).Updates(map[string]interface{}{
			"user_id":         cart.UserID,
			"session_id":      cart.SessionID,
			"coupon_code":     cart.CouponCode,
			"discount_amount": cart.DiscountAmount,
			"expires_at":      cart.ExpiresAt,
			"updated_at":      time.Now(),
		}).Error; err != nil {
			return err
		}

		if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		if len(cart.Items) == 0 {
			return nil
		}

		for i := range cart.Items {
			cart.Items[i].CartID = cart.ID
		}

		return tx.Create(&cart.Items).Error
	})
}

func (r *cartRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Cart{}, id).Error
}

func (r *cartRepository) CleanupExpiredCarts() error {
	return r.db.Where("expires_at < ?", time.Now()).Delete(&models.Cart{}).Error
}
