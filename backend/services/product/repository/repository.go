package repository

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/beki55/go-ecommerce/services/product/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductRepository interface {
	// Product CRUD
	Create(ctx context.Context, product *models.Product) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error)
	GetBySlug(ctx context.Context, slug string) (*models.Product, error)
	GetBySKU(ctx context.Context, sku string) (*models.Product, error)
	Update(ctx context.Context, product *models.Product) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, limit, offset int, filters map[string]interface{}) ([]*models.Product, int64, error)

	// Category CRUD
	CreateCategory(ctx context.Context, category *models.Category) error
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*models.Category, error)
	GetCategoryBySlug(ctx context.Context, slug string) (*models.Category, error)
	UpdateCategory(ctx context.Context, category *models.Category) error
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	ListCategories(ctx context.Context, parentID *uuid.UUID) ([]*models.Category, error)

	// Brand CRUD
	CreateBrand(ctx context.Context, brand *models.Brand) error
	GetBrandByID(ctx context.Context, id uuid.UUID) (*models.Brand, error)
	UpdateBrand(ctx context.Context, brand *models.Brand) error
	DeleteBrand(ctx context.Context, id uuid.UUID) error
	ListBrands(ctx context.Context) ([]*models.Brand, error)

	// Product Variants
	CreateVariant(ctx context.Context, variant *models.ProductVariant) error
	UpdateVariant(ctx context.Context, variant *models.ProductVariant) error
	DeleteVariant(ctx context.Context, id uuid.UUID) error
	GetVariantByID(ctx context.Context, id uuid.UUID) (*models.ProductVariant, error)
	GetVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*models.ProductVariant, error)

	// Inventory
	UpdateStock(ctx context.Context, productID uuid.UUID, quantity int, reason string, referenceID *string, createdBy *uuid.UUID) error
	GetLowStockProducts(ctx context.Context) ([]*models.Product, error)

	// Utility methods
	GenerateSKU(ctx context.Context, categorySlug string) (string, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

// Product CRUD Implementation
func (r *productRepository) Create(ctx context.Context, product *models.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *productRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error) {
	var product models.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Brand").
		Preload("Variants").
		First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) GetBySlug(ctx context.Context, slug string) (*models.Product, error) {
	var product models.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Brand").
		Preload("Variants").
		Where("slug = ?", slug).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) GetBySKU(ctx context.Context, sku string) (*models.Product, error) {
	var product models.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Brand").
		Preload("Variants").
		Where("sku = ?", sku).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(ctx context.Context, product *models.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Product{}, id).Error
}

func (r *productRepository) List(ctx context.Context, limit, offset int, filters map[string]interface{}) ([]*models.Product, int64, error) {
	var products []*models.Product
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Product{})

	// Apply filters
	if categoryID, ok := filters["category_id"].(uuid.UUID); ok {
		query = query.Where("category_id = ?", categoryID)
	}
	if brandID, ok := filters["brand_id"].(uuid.UUID); ok {
		query = query.Where("brand_id = ?", brandID)
	}
	if isActive, ok := filters["is_active"].(bool); ok {
		query = query.Where("is_active = ?", isActive)
	}
	if isFeatured, ok := filters["is_featured"].(bool); ok {
		query = query.Where("is_featured = ?", isFeatured)
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := query.
		Preload("Category").
		Preload("Brand").
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&products).Error

	return products, total, err
}

// Category CRUD Implementation
func (r *productRepository) CreateCategory(ctx context.Context, category *models.Category) error {
	return r.db.WithContext(ctx).Create(category).Error
}

func (r *productRepository) GetCategoryByID(ctx context.Context, id uuid.UUID) (*models.Category, error) {
	var category models.Category
	err := r.db.WithContext(ctx).
		Preload("Parent").
		Preload("Children").
		First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *productRepository) GetCategoryBySlug(ctx context.Context, slug string) (*models.Category, error) {
	var category models.Category
	err := r.db.WithContext(ctx).
		Preload("Parent").
		Preload("Children").
		Where("slug = ?", slug).
		First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *productRepository) UpdateCategory(ctx context.Context, category *models.Category) error {
	return r.db.WithContext(ctx).Save(category).Error
}

func (r *productRepository) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Category{}, id).Error
}

func (r *productRepository) ListCategories(ctx context.Context, parentID *uuid.UUID) ([]*models.Category, error) {
	var categories []*models.Category
	query := r.db.WithContext(ctx).Preload("Children")

	if parentID != nil {
		query = query.Where("parent_id = ?", *parentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	err := query.Order("sort_order ASC, name ASC").Find(&categories).Error
	return categories, err
}

// Brand CRUD Implementation
func (r *productRepository) CreateBrand(ctx context.Context, brand *models.Brand) error {
	return r.db.WithContext(ctx).Create(brand).Error
}

func (r *productRepository) GetBrandByID(ctx context.Context, id uuid.UUID) (*models.Brand, error) {
	var brand models.Brand
	err := r.db.WithContext(ctx).First(&brand, id).Error
	if err != nil {
		return nil, err
	}
	return &brand, nil
}

func (r *productRepository) UpdateBrand(ctx context.Context, brand *models.Brand) error {
	return r.db.WithContext(ctx).Save(brand).Error
}

func (r *productRepository) DeleteBrand(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Brand{}, id).Error
}

func (r *productRepository) ListBrands(ctx context.Context) ([]*models.Brand, error) {
	var brands []*models.Brand
	err := r.db.WithContext(ctx).
		Where("is_active = ?", true).
		Order("name ASC").
		Find(&brands).Error
	return brands, err
}

// Product Variants Implementation
func (r *productRepository) CreateVariant(ctx context.Context, variant *models.ProductVariant) error {
	return r.db.WithContext(ctx).Create(variant).Error
}

func (r *productRepository) UpdateVariant(ctx context.Context, variant *models.ProductVariant) error {
	return r.db.WithContext(ctx).Save(variant).Error
}

func (r *productRepository) DeleteVariant(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.ProductVariant{}, id).Error
}

func (r *productRepository) GetVariantByID(ctx context.Context, id uuid.UUID) (*models.ProductVariant, error) {
	var variant models.ProductVariant
	err := r.db.WithContext(ctx).First(&variant, id).Error
	if err != nil {
		return nil, err
	}
	return &variant, nil
}

func (r *productRepository) GetVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*models.ProductVariant, error) {
	var variants []*models.ProductVariant
	err := r.db.WithContext(ctx).
		Where("product_id = ?", productID).
		Order("created_at ASC").
		Find(&variants).Error
	return variants, err
}

// Inventory Implementation
func (r *productRepository) UpdateStock(ctx context.Context, productID uuid.UUID, quantity int, reason string, referenceID *string, createdBy *uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Get current product
		var product models.Product
		if err := tx.First(&product, productID).Error; err != nil {
			return err
		}

		previousQuantity := product.StockQuantity
		newQuantity := previousQuantity + quantity

		// Update product stock
		if err := tx.Model(&product).Update("stock_quantity", newQuantity).Error; err != nil {
			return err
		}

		// Create inventory log
		log := &models.InventoryLog{
			ProductID:        productID,
			QuantityChange:   quantity,
			PreviousQuantity: previousQuantity,
			NewQuantity:      newQuantity,
			Reason:           &reason,
			ReferenceID:      referenceID,
			CreatedBy:        createdBy,
		}

		return tx.Create(log).Error
	})
}

func (r *productRepository) GetLowStockProducts(ctx context.Context) ([]*models.Product, error) {
	var products []*models.Product
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Brand").
		Where("stock_quantity <= low_stock_threshold AND is_active = ?", true).
		Find(&products).Error
	return products, err
}

func (r *productRepository) GenerateSKU(ctx context.Context, categorySlug string) (string, error) {
	prefix := "PRD"
	if len(categorySlug) >= 3 {
		prefix = strings.ToUpper(categorySlug[:3])
	} else if len(categorySlug) > 0 {
		prefix = strings.ToUpper(categorySlug)
	}

	// Find the highest SKU with this prefix
	var lastProduct models.Product
	err := r.db.WithContext(ctx).
		Where("sku LIKE ?", prefix+"-%").
		Order("sku DESC").
		First(&lastProduct).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", err
	}

	counter := 1
	if lastProduct.SKU != "" {
		// Extract number from last SKU
		parts := strings.Split(lastProduct.SKU, "-")
		if len(parts) == 2 {
			if num, err := strconv.Atoi(parts[1]); err == nil {
				counter = num + 1
			}
		}
	}

	return fmt.Sprintf("%s-%04d", prefix, counter), nil
}
