package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Wishlist represents user's saved/favorite products
type Wishlist struct {
	ID                  uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID              uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_product_wishlist" json:"user_id"`
	ProductID           uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_product_wishlist" json:"product_id"`
	AddedAt             time.Time `gorm:"autoCreateTime" json:"added_at"`
	NotifyOnPriceDrop   bool      `gorm:"default:false" json:"notify_on_price_drop"`
	NotifyOnBackInStock bool      `gorm:"default:false" json:"notify_on_back_in_stock"`

	// Relationships
	User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (w *Wishlist) BeforeCreate(tx *gorm.DB) error {
	if w.ID == uuid.Nil {
		w.ID = uuid.New()
	}
	return nil
}

// ProductLike represents product likes/favorites (simpler version)
type ProductLike struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ProductID uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_product_like" json:"product_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_product_like" json:"user_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (pl *ProductLike) BeforeCreate(tx *gorm.DB) error {
	if pl.ID == uuid.Nil {
		pl.ID = uuid.New()
	}
	return nil
}
