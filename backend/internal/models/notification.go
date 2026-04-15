package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Notification represents system and email notifications
type Notification struct {
	ID      uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID  uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	Type    string         `gorm:"type:varchar(50);not null" json:"type"`
	Title   string         `gorm:"type:varchar(255);not null" json:"title"`
	Content string         `gorm:"type:text;not null" json:"content"`
	Data    datatypes.JSON `gorm:"type:jsonb" json:"data,omitempty"`
	IsRead  bool           `gorm:"default:false" json:"is_read"`
	ReadAt  *time.Time     `gorm:"type:timestamp" json:"read_at,omitempty"`
	SentAt  time.Time      `gorm:"autoCreateTime" json:"sent_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (n *Notification) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}

// APILog represents API request/response logging
type APILog struct {
	ID             uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID         *uuid.UUID `gorm:"type:uuid;index" json:"user_id,omitempty"`
	Method         string     `gorm:"type:varchar(10);not null" json:"method"`
	Endpoint       string     `gorm:"type:varchar(255);not null" json:"endpoint"`
	StatusCode     *int       `gorm:"type:integer" json:"status_code,omitempty"`
	ResponseTimeMs *int       `gorm:"type:integer" json:"response_time_ms,omitempty"`
	IPAddress      *string    `gorm:"type:varchar(45)" json:"ip_address,omitempty"`
	UserAgent      *string    `gorm:"type:text" json:"user_agent,omitempty"`
	RequestBody    *string    `gorm:"type:text" json:"request_body,omitempty"`
	CreatedAt      time.Time  `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (al *APILog) BeforeCreate(tx *gorm.DB) error {
	if al.ID == uuid.Nil {
		al.ID = uuid.New()
	}
	return nil
}
