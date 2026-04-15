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
	ProductID          uuid.UUID      `gorm:"type:uuid;not null;index" json:"product_id"`
	UserID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	OrderID            *uuid.UUID     `gorm:"type:uuid;index" json:"order_id,omitempty"`
	Rating             int            `gorm:"not null;check:rating >= 1 AND rating <= 5" json:"rating"`
	Title              *string        `gorm:"type:varchar(200)" json:"title,omitempty"`
	Comment            *string        `gorm:"type:text" json:"comment,omitempty"`
	Images             datatypes.JSON `gorm:"type:jsonb" json:"images,omitempty"`
	Video              *string        `gorm:"type:varchar(500)" json:"video,omitempty"`
	IsVerifiedPurchase bool           `gorm:"default:false" json:"is_verified_purchase"`
	HelpfulCount       int            `gorm:"default:0" json:"helpful_count"`
	UnhelpfulCount     int            `gorm:"default:0" json:"unhelpful_count"`
	Status             string         `gorm:"type:varchar(20);default:'pending'" json:"status"`
	ModeratedBy        *uuid.UUID     `gorm:"type:uuid;index" json:"moderated_by,omitempty"`
	ModeratedAt        *time.Time     `gorm:"type:timestamp" json:"moderated_at,omitempty"`
	CreatedAt          time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt          time.Time      `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships
	Product   Product             `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	User      User                `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Order     *Order              `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Moderator *User               `gorm:"foreignKey:ModeratedBy" json:"moderator,omitempty"`
	Votes     []ReviewHelpfulVote `gorm:"foreignKey:ReviewID;constraint:OnDelete:CASCADE" json:"votes,omitempty"`
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
	UserID    uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_review_user_vote" json:"user_id"`
	IsHelpful bool      `gorm:"not null" json:"is_helpful"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Review Review `gorm:"foreignKey:ReviewID" json:"review,omitempty"`
	User   User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (rv *ReviewHelpfulVote) BeforeCreate(tx *gorm.DB) error {
	if rv.ID == uuid.Nil {
		rv.ID = uuid.New()
	}
	return nil
}
