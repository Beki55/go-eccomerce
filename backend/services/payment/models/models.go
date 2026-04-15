package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Payment tracks all payment transactions
type Payment struct {
	ID              uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	OrderID         uuid.UUID       `gorm:"type:uuid;not null;index" json:"order_id"` // References order-service (no FK)
	UserID          uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`  // References user-service (no FK)
	TransactionID   *string         `gorm:"type:varchar(100);uniqueIndex" json:"transaction_id,omitempty"`
	Amount          decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"amount"`
	Currency        string          `gorm:"type:varchar(3);default:'ETB'" json:"currency"`
	PaymentMethod   string          `gorm:"type:varchar(50);not null" json:"payment_method"`
	Status          string          `gorm:"type:varchar(50);not null" json:"status"`
	GatewayResponse datatypes.JSON  `gorm:"type:jsonb" json:"gateway_response,omitempty"`
	PaymentURL      *string         `gorm:"type:varchar(500)" json:"payment_url,omitempty"`
	Reference       *string         `gorm:"type:varchar(100);uniqueIndex" json:"reference,omitempty"`
	PaidAt          *time.Time      `gorm:"type:timestamp" json:"paid_at,omitempty"`
	CreatedAt       time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time       `gorm:"autoUpdateTime" json:"updated_at"`

	// Internal relationships
	Refunds []Refund `gorm:"foreignKey:PaymentID;constraint:OnDelete:CASCADE" json:"refunds,omitempty"`
}

func (p *Payment) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// Refund tracks refund transactions
type Refund struct {
	ID            uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	PaymentID     uuid.UUID       `gorm:"type:uuid;not null;index" json:"payment_id"`
	OrderID       uuid.UUID       `gorm:"type:uuid;not null;index" json:"order_id"` // References order-service (no FK)
	Amount        decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"amount"`
	Reason        *string         `gorm:"type:text" json:"reason,omitempty"`
	Status        string          `gorm:"type:varchar(50);default:'pending'" json:"status"`
	TransactionID *string         `gorm:"type:varchar(100)" json:"transaction_id,omitempty"`
	ProcessedBy   *uuid.UUID      `gorm:"type:uuid;index" json:"processed_by,omitempty"` // References user-service (no FK)
	CreatedAt     time.Time       `gorm:"autoCreateTime" json:"created_at"`
	ProcessedAt   *time.Time      `gorm:"type:timestamp" json:"processed_at,omitempty"`

	Payment Payment `gorm:"foreignKey:PaymentID" json:"payment,omitempty"`
}

func (r *Refund) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}
