package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User stores all user account information
type User struct {
	ID              uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Email           string         `gorm:"type:varchar(255);not null;uniqueIndex" json:"email"`
	PasswordHash    string         `gorm:"type:varchar(255);not null" json:"-"`
	Name            string         `gorm:"type:varchar(100);not null" json:"name"`
	Phone           *string        `gorm:"type:varchar(20)" json:"phone,omitempty"`
	Avatar          *string        `gorm:"type:text" json:"avatar,omitempty"`
	Role            UserRole       `gorm:"type:varchar(20);default:'customer'" json:"role"`
	IsActive        bool           `gorm:"default:true" json:"is_active"`
	EmailVerifiedAt *time.Time     `gorm:"type:timestamp" json:"email_verified_at,omitempty"`
	LastLoginAt     *time.Time     `gorm:"type:timestamp" json:"last_login_at,omitempty"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relationships
	Sessions       []Session       `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"sessions,omitempty"`
	PasswordResets []PasswordReset `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"password_resets,omitempty"`
	Addresses      []Address       `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"addresses,omitempty"`
	Orders         []Order         `gorm:"foreignKey:UserID;constraint:OnDelete:SET NULL" json:"orders,omitempty"`
	Reviews        []Review        `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"reviews,omitempty"`
	Wishlists      []Wishlist      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"wishlists,omitempty"`
	Notifications  []Notification  `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"notifications,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// Session manages user refresh tokens and session data
type Session struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	RefreshToken string    `gorm:"type:varchar(500);not null;uniqueIndex" json:"-"`
	UserAgent    *string   `gorm:"type:varchar(500)" json:"user_agent,omitempty"`
	IPAddress    *string   `gorm:"type:varchar(45)" json:"ip_address,omitempty"`
	ExpiresAt    time.Time `gorm:"type:timestamp;not null" json:"expires_at"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (s *Session) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

// PasswordReset manages password reset requests
type PasswordReset struct {
	ID        uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;index" json:"user_id"`
	Token     string     `gorm:"type:varchar(255);not null;uniqueIndex" json:"-"`
	ExpiresAt time.Time  `gorm:"type:timestamp;not null" json:"expires_at"`
	UsedAt    *time.Time `gorm:"type:timestamp" json:"used_at,omitempty"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (p *PasswordReset) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}
