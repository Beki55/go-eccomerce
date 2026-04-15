package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Coupon represents discount coupon definitions
type Coupon struct {
	ID                   uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Code                 string           `gorm:"type:varchar(50);not null;uniqueIndex" json:"code"`
	Type                 CouponType       `gorm:"type:varchar(20);default:'percentage'" json:"type"`
	Value                decimal.Decimal  `gorm:"type:decimal(10,2);not null" json:"value"`
	MinOrderAmount       *decimal.Decimal `gorm:"type:decimal(10,2)" json:"min_order_amount,omitempty"`
	MaxDiscount          *decimal.Decimal `gorm:"type:decimal(10,2)" json:"max_discount,omitempty"`
	UsageLimit           *int             `gorm:"type:integer" json:"usage_limit,omitempty"`
	UsedCount            int              `gorm:"default:0" json:"used_count"`
	PerUserLimit         *int             `gorm:"type:integer" json:"per_user_limit,omitempty"`
	ValidFrom            time.Time        `gorm:"type:timestamp;not null" json:"valid_from"`
	ValidUntil           time.Time        `gorm:"type:timestamp;not null" json:"valid_until"`
	IsActive             bool             `gorm:"default:true;index" json:"is_active"`
	ApplicableProducts   datatypes.JSON   `gorm:"type:jsonb" json:"applicable_products,omitempty"`
	ApplicableCategories datatypes.JSON   `gorm:"type:jsonb" json:"applicable_categories,omitempty"`
	ExcludedProducts     datatypes.JSON   `gorm:"type:jsonb" json:"excluded_products,omitempty"`
	FirstPurchaseOnly    bool             `gorm:"default:false" json:"first_purchase_only"`
	CreatedAt            time.Time        `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt            time.Time        `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships
	Usages []CouponUsage `gorm:"foreignKey:CouponID;constraint:OnDelete:CASCADE" json:"usages,omitempty"`
}

func (c *Coupon) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// CouponUsage tracks coupon usage by users
type CouponUsage struct {
	ID             uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	CouponID       uuid.UUID       `gorm:"type:uuid;not null;index" json:"coupon_id"`
	UserID         uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	OrderID        uuid.UUID       `gorm:"type:uuid;not null;index" json:"order_id"`
	DiscountAmount decimal.Decimal `gorm:"type:decimal(10,2);not null" json:"discount_amount"`
	UsedAt         time.Time       `gorm:"autoCreateTime" json:"used_at"`

	// Relationships
	Coupon Coupon `gorm:"foreignKey:CouponID" json:"coupon,omitempty"`
	User   User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Order  Order  `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

func (cu *CouponUsage) BeforeCreate(tx *gorm.DB) error {
	if cu.ID == uuid.Nil {
		cu.ID = uuid.New()
	}
	return nil
}
