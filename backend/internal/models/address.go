package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// Address stores user shipping and billing addresses
type Address struct {
	ID            uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID        uuid.UUID        `gorm:"type:uuid;not null;index" json:"user_id"`
	Type          AddressType      `gorm:"type:varchar(20);default:'shipping'" json:"type"`
	RecipientName string           `gorm:"type:varchar(100);not null" json:"recipient_name"`
	Phone         string           `gorm:"type:varchar(20);not null" json:"phone"`
	AddressLine1  string           `gorm:"type:varchar(255);not null" json:"address_line1"`
	AddressLine2  *string          `gorm:"type:varchar(255)" json:"address_line2,omitempty"`
	City          string           `gorm:"type:varchar(100);not null" json:"city"`
	State         string           `gorm:"type:varchar(100);not null" json:"state"`
	PostalCode    string           `gorm:"type:varchar(20);not null" json:"postal_code"`
	Country       string           `gorm:"type:varchar(100);default:'Ethiopia'" json:"country"`
	IsDefault     bool             `gorm:"default:false" json:"is_default"`
	Latitude      *decimal.Decimal `gorm:"type:decimal(10,8)" json:"latitude,omitempty"`
	Longitude     *decimal.Decimal `gorm:"type:decimal(11,8)" json:"longitude,omitempty"`
	CreatedAt     time.Time        `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time        `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (a *Address) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}
