package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Order represents core order information
type Order struct {
	ID                 uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID             uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	OrderNumber        string          `gorm:"type:varchar(20);not null;uniqueIndex" json:"order_number"`
	Subtotal           decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"subtotal"`
	DiscountAmount     decimal.Decimal `gorm:"type:decimal(12,2);default:0" json:"discount_amount"`
	TaxAmount          decimal.Decimal `gorm:"type:decimal(12,2);default:0" json:"tax_amount"`
	ShippingAmount     decimal.Decimal `gorm:"type:decimal(12,2);default:0" json:"shipping_amount"`
	TotalAmount        decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"total_amount"`
	CouponCode         *string         `gorm:"type:varchar(50)" json:"coupon_code,omitempty"`
	Status             OrderStatus     `gorm:"type:varchar(20);default:'pending'" json:"status"`
	PaymentStatus      PaymentStatus   `gorm:"type:varchar(20);default:'pending'" json:"payment_status"`
	PaymentMethod      *string         `gorm:"type:varchar(50)" json:"payment_method,omitempty"`
	PaymentID          *string         `gorm:"type:varchar(100)" json:"payment_id,omitempty"`
	ShippingAddressID  uuid.UUID       `gorm:"type:uuid;not null" json:"shipping_address_id"`
	BillingAddressID   *uuid.UUID      `gorm:"type:uuid" json:"billing_address_id,omitempty"`
	ShippingMethod     *string         `gorm:"type:varchar(50)" json:"shipping_method,omitempty"`
	TrackingNumber     *string         `gorm:"type:varchar(100)" json:"tracking_number,omitempty"`
	TrackingURL        *string         `gorm:"type:varchar(500)" json:"tracking_url,omitempty"`
	Notes              *string         `gorm:"type:text" json:"notes,omitempty"`
	PlacedAt           time.Time       `gorm:"autoCreateTime" json:"placed_at"`
	PaidAt             *time.Time      `gorm:"type:timestamp" json:"paid_at,omitempty"`
	ConfirmedAt        *time.Time      `gorm:"type:timestamp" json:"confirmed_at,omitempty"`
	ProcessingAt       *time.Time      `gorm:"type:timestamp" json:"processing_at,omitempty"`
	ShippedAt          *time.Time      `gorm:"type:timestamp" json:"shipped_at,omitempty"`
	DeliveredAt        *time.Time      `gorm:"type:timestamp" json:"delivered_at,omitempty"`
	CancelledAt        *time.Time      `gorm:"type:timestamp" json:"cancelled_at,omitempty"`
	CancellationReason *string         `gorm:"type:text" json:"cancellation_reason,omitempty"`
	Metadata           datatypes.JSON  `gorm:"type:jsonb" json:"metadata,omitempty"`

	// Relationships
	User            User                 `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ShippingAddress Address              `gorm:"foreignKey:ShippingAddressID" json:"shipping_address,omitempty"`
	BillingAddress  *Address             `gorm:"foreignKey:BillingAddressID" json:"billing_address,omitempty"`
	Items           []OrderItem          `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items,omitempty"`
	StatusHistory   []OrderStatusHistory `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"status_history,omitempty"`
	Payments        []Payment            `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"payments,omitempty"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// OrderItem represents individual items within an order
type OrderItem struct {
	ID          uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	OrderID     uuid.UUID       `gorm:"type:uuid;not null;index" json:"order_id"`
	ProductID   uuid.UUID       `gorm:"type:uuid;not null;index" json:"product_id"`
	VariantID   *uuid.UUID      `gorm:"type:uuid;index" json:"variant_id,omitempty"`
	ProductName string          `gorm:"type:varchar(200);not null" json:"product_name"`
	SKU         string          `gorm:"type:varchar(50);not null" json:"sku"`
	Quantity    int             `gorm:"not null;check:quantity > 0" json:"quantity"`
	UnitPrice   decimal.Decimal `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	TotalPrice  decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"total_price"`
	Discount    decimal.Decimal `gorm:"type:decimal(10,2);default:0" json:"discount"`
	Tax         decimal.Decimal `gorm:"type:decimal(10,2);default:0" json:"tax"`
	CreatedAt   time.Time       `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Order   Order           `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Product Product         `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Variant *ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
}

func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == uuid.Nil {
		oi.ID = uuid.New()
	}
	return nil
}

// OrderStatusHistory tracks order status changes
type OrderStatusHistory struct {
	ID        uuid.UUID    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	OrderID   uuid.UUID    `gorm:"type:uuid;not null;index" json:"order_id"`
	OldStatus *OrderStatus `gorm:"type:varchar(20)" json:"old_status,omitempty"`
	NewStatus OrderStatus  `gorm:"type:varchar(20);not null" json:"new_status"`
	ChangedBy *uuid.UUID   `gorm:"type:uuid;index" json:"changed_by,omitempty"`
	Reason    *string      `gorm:"type:text" json:"reason,omitempty"`
	CreatedAt time.Time    `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Order   Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Changer *User `gorm:"foreignKey:ChangedBy" json:"changer,omitempty"`
}

func (osh *OrderStatusHistory) BeforeCreate(tx *gorm.DB) error {
	if osh.ID == uuid.Nil {
		osh.ID = uuid.New()
	}
	return nil
}
