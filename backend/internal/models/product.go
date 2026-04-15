package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Category represents hierarchical product categorization
type Category struct {
	ID          uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ParentID    *uuid.UUID `gorm:"type:uuid;index" json:"parent_id,omitempty"`
	Name        string     `gorm:"type:varchar(100);not null" json:"name"`
	Slug        string     `gorm:"type:varchar(100);not null;uniqueIndex" json:"slug"`
	Description *string    `gorm:"type:text" json:"description,omitempty"`
	Image       *string    `gorm:"type:varchar(500)" json:"image,omitempty"`
	Level       int        `gorm:"default:0" json:"level"`
	Path        *string    `gorm:"type:varchar(500);index" json:"path,omitempty"`
	IsActive    bool       `gorm:"default:true" json:"is_active"`
	SortOrder   int        `gorm:"default:0" json:"sort_order"`
	CreatedAt   time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships
	Parent   *Category  `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children []Category `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	Products []Product  `gorm:"foreignKey:CategoryID" json:"products,omitempty"`
}

func (c *Category) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// Brand represents product brand information
type Brand struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"name"`
	Slug        string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"slug"`
	Logo        *string   `gorm:"type:varchar(500)" json:"logo,omitempty"`
	Description *string   `gorm:"type:text" json:"description,omitempty"`
	Website     *string   `gorm:"type:varchar(255)" json:"website,omitempty"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Products []Product `gorm:"foreignKey:BrandID" json:"products,omitempty"`
}

func (b *Brand) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

// Product is the core product information model
type Product struct {
	ID                uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	CategoryID        *uuid.UUID       `gorm:"type:uuid;index" json:"category_id,omitempty"`
	BrandID           *uuid.UUID       `gorm:"type:uuid;index" json:"brand_id,omitempty"`
	VendorID          *uuid.UUID       `gorm:"type:uuid;index" json:"vendor_id,omitempty"`
	SKU               string           `gorm:"type:varchar(50);not null;uniqueIndex" json:"sku"`
	Name              string           `gorm:"type:varchar(200);not null;index" json:"name"`
	Slug              string           `gorm:"type:varchar(200);not null;uniqueIndex" json:"slug"`
	ShortDescription  *string          `gorm:"type:varchar(500)" json:"short_description,omitempty"`
	Description       *string          `gorm:"type:text" json:"description,omitempty"`
	Price             decimal.Decimal  `gorm:"type:decimal(10,2);not null" json:"price"`
	ComparePrice      *decimal.Decimal `gorm:"type:decimal(10,2)" json:"compare_price,omitempty"`
	CostPerItem       *decimal.Decimal `gorm:"type:decimal(10,2)" json:"cost_per_item,omitempty"`
	StockQuantity     int              `gorm:"default:0" json:"stock_quantity"`
	LowStockThreshold int              `gorm:"default:5" json:"low_stock_threshold"`
	Weight            *decimal.Decimal `gorm:"type:decimal(8,2)" json:"weight,omitempty"`
	Dimensions        datatypes.JSON   `gorm:"type:jsonb" json:"dimensions,omitempty"`
	Images            datatypes.JSON   `gorm:"type:jsonb" json:"images,omitempty"`
	VideoURL          *string          `gorm:"type:varchar(500)" json:"video_url,omitempty"`
	Attributes        datatypes.JSON   `gorm:"type:jsonb" json:"attributes,omitempty"`
	Tags              datatypes.JSON   `gorm:"type:jsonb" json:"tags,omitempty"`
	IsActive          bool             `gorm:"default:true;index" json:"is_active"`
	IsFeatured        bool             `gorm:"default:false" json:"is_featured"`
	IsDigital         bool             `gorm:"default:false" json:"is_digital"`
	DownloadableFile  *string          `gorm:"type:varchar(500)" json:"downloadable_file,omitempty"`
	MetaTitle         *string          `gorm:"type:varchar(200)" json:"meta_title,omitempty"`
	MetaDescription   *string          `gorm:"type:text" json:"meta_description,omitempty"`
	ViewsCount        int              `gorm:"default:0" json:"views_count"`
	SoldCount         int              `gorm:"default:0" json:"sold_count"`
	CreatedAt         time.Time        `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time        `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt         gorm.DeletedAt   `gorm:"index" json:"deleted_at,omitempty"`

	// Relationships
	Category      *Category        `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Brand         *Brand           `gorm:"foreignKey:BrandID" json:"brand,omitempty"`
	Vendor        *User            `gorm:"foreignKey:VendorID" json:"vendor,omitempty"`
	Variants      []ProductVariant `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE" json:"variants,omitempty"`
	InventoryLogs []InventoryLog   `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE" json:"inventory_logs,omitempty"`
	Reviews       []Review         `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE" json:"reviews,omitempty"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ProductVariant represents product variations (size, color, etc.)
type ProductVariant struct {
	ID              uuid.UUID       `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ProductID       uuid.UUID       `gorm:"type:uuid;not null;index" json:"product_id"`
	SKU             string          `gorm:"type:varchar(50);not null;uniqueIndex" json:"sku"`
	Attributes      datatypes.JSON  `gorm:"type:jsonb;not null" json:"attributes"`
	PriceAdjustment decimal.Decimal `gorm:"type:decimal(10,2);default:0" json:"price_adjustment"`
	StockQuantity   int             `gorm:"default:0" json:"stock_quantity"`
	Images          datatypes.JSON  `gorm:"type:jsonb" json:"images,omitempty"`
	CreatedAt       time.Time       `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (pv *ProductVariant) BeforeCreate(tx *gorm.DB) error {
	if pv.ID == uuid.Nil {
		pv.ID = uuid.New()
	}
	return nil
}

// InventoryLog tracks inventory changes
type InventoryLog struct {
	ID               uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	ProductID        uuid.UUID  `gorm:"type:uuid;not null;index" json:"product_id"`
	VariantID        *uuid.UUID `gorm:"type:uuid;index" json:"variant_id,omitempty"`
	QuantityChange   int        `gorm:"not null" json:"quantity_change"`
	PreviousQuantity int        `gorm:"not null" json:"previous_quantity"`
	NewQuantity      int        `gorm:"not null" json:"new_quantity"`
	Reason           *string    `gorm:"type:varchar(100)" json:"reason,omitempty"`
	ReferenceID      *string    `gorm:"type:varchar(100)" json:"reference_id,omitempty"`
	CreatedBy        *uuid.UUID `gorm:"type:uuid;index" json:"created_by,omitempty"`
	CreatedAt        time.Time  `gorm:"autoCreateTime" json:"created_at"`

	// Relationships
	Product Product         `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Variant *ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
	Creator *User           `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
}

func (il *InventoryLog) BeforeCreate(tx *gorm.DB) error {
	if il.ID == uuid.Nil {
		il.ID = uuid.New()
	}
	return nil
}
