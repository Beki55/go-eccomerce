package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// Cart represents shopping cart session storage
type Cart struct {
	ID             uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID         *uuid.UUID      `gorm:"type:uuid;uniqueIndex" json:"user_id,omitempty"`
	SessionID      *string         `gorm:"type:varchar(100);uniqueIndex" json:"session_id,omitempty"`
	CouponCode     *string         `gorm:"type:varchar(50)" json:"coupon_code,omitempty"`
	DiscountAmount decimal.Decimal `gorm:"type:decimal(10,2);default:0" json:"discount_amount"`
	ExpiresAt      time.Time       `gorm:"type:timestamp;not null;index" json:"expires_at"`
	CreatedAt      time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time       `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships
	User  *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Items []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE" json:"items,omitempty"`
}

func (c *Cart) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// CartItem represents individual items in a shopping cart
type CartItem struct {
	ID         uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	CartID     uuid.UUID       `gorm:"type:uuid;not null;index" json:"cart_id"`
	ProductID  uuid.UUID       `gorm:"type:uuid;not null;index" json:"product_id"`
	VariantID  *uuid.UUID      `gorm:"type:uuid;index" json:"variant_id,omitempty"`
	Quantity   int             `gorm:"not null;default:1;check:quantity > 0" json:"quantity"`
	UnitPrice  decimal.Decimal `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	TotalPrice decimal.Decimal `gorm:"type:decimal(10,2);not null" json:"total_price"`
	AddedAt    time.Time       `gorm:"autoCreateTime" json:"added_at"`

	// Relationships
	Cart    Cart            `gorm:"foreignKey:CartID" json:"cart,omitempty"`
	Product Product         `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Variant *ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
}

func (ci *CartItem) BeforeCreate(tx *gorm.DB) error {
	if ci.ID == uuid.Nil {
		ci.ID = uuid.New()
	}
	return nil
}
