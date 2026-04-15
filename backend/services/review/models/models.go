package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Review represents product reviews from verified purchasers
type Review struct {
	ID                 uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ProductID          uuid.UUID      `gorm:"type:uuid;not null;index" json:"product_id"` // References product-service (no FK)
	UserID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`    // References user-service (no FK)
	OrderID            *uuid.UUID     `gorm:"type:uuid;index" json:"order_id,omitempty"`  // References order-service (no FK)
	Rating             int            `gorm:"not null;check:rating >= 1 AND rating <= 5" json:"rating"`
	Title              *string        `gorm:"type:varchar(200)" json:"title,omitempty"`
	Comment            *string        `gorm:"type:text" json:"comment,omitempty"`
	Images             datatypes.JSON `gorm:"type:jsonb" json:"images,omitempty"`
	Video              *string        `gorm:"type:varchar(500)" json:"video,omitempty"`
	IsVerifiedPurchase bool           `gorm:"default:false" json:"is_verified_purchase"`
	HelpfulCount       int            `gorm:"default:0" json:"helpful_count"`
	UnhelpfulCount     int            `gorm:"default:0" json:"unhelpful_count"`
	Status             string         `gorm:"type:varchar(20);default:'pending'" json:"status"`
	ModeratedBy        *uuid.UUID     `gorm:"type:uuid;index" json:"moderated_by,omitempty"` // References user-service (no FK)
	ModeratedAt        *time.Time     `gorm:"type:timestamp" json:"moderated_at,omitempty"`
	CreatedAt          time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt          time.Time      `gorm:"autoUpdateTime" json:"updated_at"`

	// Internal relationships
	Votes []ReviewHelpfulVote `gorm:"foreignKey:ReviewID;constraint:OnDelete:CASCADE" json:"votes,omitempty"`
}

func (r *Review) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

// ReviewHelpfulVote tracks helpful votes on reviews
type ReviewHelpfulVote struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ReviewID  uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_review_user_vote" json:"review_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_review_user_vote" json:"user_id"` // References user-service (no FK)
	IsHelpful bool      `gorm:"not null" json:"is_helpful"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	Review Review `gorm:"foreignKey:ReviewID" json:"review,omitempty"`
}

func (rv *ReviewHelpfulVote) BeforeCreate(tx *gorm.DB) error {
	if rv.ID == uuid.Nil {
		rv.ID = uuid.New()
	}
	return nil
}
