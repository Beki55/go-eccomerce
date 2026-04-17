package service

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/beki55/go-ecommerce/services/product/models"
	"github.com/beki55/go-ecommerce/services/product/repository"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ProductService interface {
	// Product CRUD
	CreateProduct(ctx context.Context, product *models.Product) (*models.Product, error)
	GetProduct(ctx context.Context, id uuid.UUID) (*models.Product, error)
	GetProductBySlug(ctx context.Context, slug string) (*models.Product, error)
	UpdateProduct(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Product, error)
	DeleteProduct(ctx context.Context, id uuid.UUID) error
	ListProducts(ctx context.Context, page, limit int, filters map[string]interface{}) ([]*models.Product, int64, error)

	// Category CRUD
	CreateCategory(ctx context.Context, category *models.Category) (*models.Category, error)
	GetCategory(ctx context.Context, id uuid.UUID) (*models.Category, error)
	UpdateCategory(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Category, error)
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	ListCategories(ctx context.Context, parentID *uuid.UUID) ([]*models.Category, error)

	// Brand CRUD
	CreateBrand(ctx context.Context, brand *models.Brand) (*models.Brand, error)
	GetBrand(ctx context.Context, id uuid.UUID) (*models.Brand, error)
	UpdateBrand(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Brand, error)
	DeleteBrand(ctx context.Context, id uuid.UUID) error
	ListBrands(ctx context.Context) ([]*models.Brand, error)

	// Product Variants
	CreateVariant(ctx context.Context, variant *models.ProductVariant) (*models.ProductVariant, error)
	UpdateVariant(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.ProductVariant, error)
	DeleteVariant(ctx context.Context, id uuid.UUID) error
	GetProductVariants(ctx context.Context, productID uuid.UUID) ([]*models.ProductVariant, error)

	// Inventory Management
	UpdateStock(ctx context.Context, productID uuid.UUID, quantity int, reason string, referenceID *string, createdBy *uuid.UUID) error
	GetLowStockProducts(ctx context.Context) ([]*models.Product, error)

	// Utility functions
	GenerateSKU(ctx context.Context, categorySlug string) (string, error)
	GenerateSlug(name string) string
	ValidateProduct(product *models.Product) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

// Product CRUD Implementation
func (s *productService) CreateProduct(ctx context.Context, product *models.Product) (*models.Product, error) {
	// Validate product
	if err := s.ValidateProduct(product); err != nil {
		return nil, err
	}

	// Generate SKU if not provided
	if product.SKU == "" {
		categorySlug := ""
		if product.CategoryID != nil {
			category, err := s.repo.GetCategoryByID(ctx, *product.CategoryID)
			if err == nil {
				categorySlug = category.Slug
			}
		}
		sku, err := s.GenerateSKU(ctx, categorySlug)
		if err != nil {
			return nil, err
		}
		product.SKU = sku
	}

	// Generate slug if not provided
	if product.Slug == "" {
		product.Slug = s.GenerateSlug(product.Name)
	}

	// Ensure slug is unique
	existing, _ := s.repo.GetBySlug(ctx, product.Slug)
	counter := 1
	originalSlug := product.Slug
	for existing != nil {
		product.Slug = fmt.Sprintf("%s-%d", originalSlug, counter)
		existing, _ = s.repo.GetBySlug(ctx, product.Slug)
		counter++
	}

	// Create product
	if err := s.repo.Create(ctx, product); err != nil {
		return nil, err
	}

	// Return with preloaded relations
	return s.repo.GetByID(ctx, product.ID)
}

func (s *productService) GetProduct(ctx context.Context, id uuid.UUID) (*models.Product, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *productService) GetProductBySlug(ctx context.Context, slug string) (*models.Product, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *productService) UpdateProduct(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Product, error) {
	// Get existing product
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Update fields
	if name, ok := updates["name"].(string); ok && name != "" {
		product.Name = name
		if slug, ok := updates["slug"].(string); !ok || slug == "" {
			product.Slug = s.GenerateSlug(name)
		}
	}
	if slug, ok := updates["slug"].(string); ok && slug != "" {
		product.Slug = slug
	}
	if shortDesc, ok := updates["short_description"].(string); ok {
		product.ShortDescription = &shortDesc
	}
	if desc, ok := updates["description"].(string); ok {
		product.Description = &desc
	}
	if price, ok := updates["price"].(decimal.Decimal); ok {
		product.Price = price
	}
	if comparePrice, ok := updates["compare_price"].(decimal.Decimal); ok {
		product.ComparePrice = &comparePrice
	}
	if stockQty, ok := updates["stock_quantity"].(int); ok {
		product.StockQuantity = stockQty
	}
	if lowStock, ok := updates["low_stock_threshold"].(int); ok {
		product.LowStockThreshold = lowStock
	}
	if isActive, ok := updates["is_active"].(bool); ok {
		product.IsActive = isActive
	}
	if isFeatured, ok := updates["is_featured"].(bool); ok {
		product.IsFeatured = isFeatured
	}
	if isDigital, ok := updates["is_digital"].(bool); ok {
		product.IsDigital = isDigital
	}
	if categoryID, ok := updates["category_id"].(uuid.UUID); ok {
		product.CategoryID = &categoryID
	}
	if brandID, ok := updates["brand_id"].(uuid.UUID); ok {
		product.BrandID = &brandID
	}
	if vendorID, ok := updates["vendor_id"].(uuid.UUID); ok {
		product.VendorID = &vendorID
	}

	// Validate updated product
	if err := s.ValidateProduct(product); err != nil {
		return nil, err
	}

	// Ensure slug uniqueness
	if product.Slug != "" {
		existing, _ := s.repo.GetBySlug(ctx, product.Slug)
		if existing != nil && existing.ID != product.ID {
			return nil, errors.New("slug already exists")
		}
	}

	// Update product
	if err := s.repo.Update(ctx, product); err != nil {
		return nil, err
	}

	return s.repo.GetByID(ctx, product.ID)
}

func (s *productService) DeleteProduct(ctx context.Context, id uuid.UUID) error {
	// Check if product exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	return s.repo.Delete(ctx, id)
}

func (s *productService) ListProducts(ctx context.Context, page, limit int, filters map[string]interface{}) ([]*models.Product, int64, error) {
	offset := (page - 1) * limit
	return s.repo.List(ctx, limit, offset, filters)
}

// Category CRUD Implementation
func (s *productService) CreateCategory(ctx context.Context, category *models.Category) (*models.Category, error) {
	// Generate slug if not provided
	if category.Slug == "" {
		category.Slug = s.GenerateSlug(category.Name)
	}

	// Ensure slug is unique
	existing, _ := s.repo.GetCategoryByID(ctx, uuid.New()) // This is a hack, need to implement GetBySlug for categories
	counter := 1
	originalSlug := category.Slug
	for existing != nil {
		category.Slug = fmt.Sprintf("%s-%d", originalSlug, counter)
		// Check uniqueness logic here
		counter++
	}

	if err := s.repo.CreateCategory(ctx, category); err != nil {
		return nil, err
	}

	return s.repo.GetCategoryByID(ctx, category.ID)
}

func (s *productService) GetCategory(ctx context.Context, id uuid.UUID) (*models.Category, error) {
	return s.repo.GetCategoryByID(ctx, id)
}

func (s *productService) UpdateCategory(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Category, error) {
	category, err := s.repo.GetCategoryByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Update fields
	if name, ok := updates["name"].(string); ok && name != "" {
		category.Name = name
	}
	if slug, ok := updates["slug"].(string); ok && slug != "" {
		category.Slug = slug
	}
	if desc, ok := updates["description"].(string); ok {
		category.Description = &desc
	}
	if image, ok := updates["image"].(string); ok {
		category.Image = &image
	}
	if isActive, ok := updates["is_active"].(bool); ok {
		category.IsActive = isActive
	}
	if sortOrder, ok := updates["sort_order"].(int); ok {
		category.SortOrder = sortOrder
	}

	if err := s.repo.UpdateCategory(ctx, category); err != nil {
		return nil, err
	}

	return s.repo.GetCategoryByID(ctx, category.ID)
}

func (s *productService) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteCategory(ctx, id)
}

func (s *productService) ListCategories(ctx context.Context, parentID *uuid.UUID) ([]*models.Category, error) {
	return s.repo.ListCategories(ctx, parentID)
}

// Brand CRUD Implementation
func (s *productService) CreateBrand(ctx context.Context, brand *models.Brand) (*models.Brand, error) {
	// Generate slug if not provided
	if brand.Slug == "" {
		brand.Slug = s.GenerateSlug(brand.Name)
	}

	if err := s.repo.CreateBrand(ctx, brand); err != nil {
		return nil, err
	}

	return s.repo.GetBrandByID(ctx, brand.ID)
}

func (s *productService) GetBrand(ctx context.Context, id uuid.UUID) (*models.Brand, error) {
	return s.repo.GetBrandByID(ctx, id)
}

func (s *productService) UpdateBrand(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.Brand, error) {
	brand, err := s.repo.GetBrandByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Update fields
	if name, ok := updates["name"].(string); ok && name != "" {
		brand.Name = name
	}
	if slug, ok := updates["slug"].(string); ok && slug != "" {
		brand.Slug = slug
	}
	if logo, ok := updates["logo"].(string); ok {
		brand.Logo = &logo
	}
	if desc, ok := updates["description"].(string); ok {
		brand.Description = &desc
	}
	if website, ok := updates["website"].(string); ok {
		brand.Website = &website
	}
	if isActive, ok := updates["is_active"].(bool); ok {
		brand.IsActive = isActive
	}

	if err := s.repo.UpdateBrand(ctx, brand); err != nil {
		return nil, err
	}

	return s.repo.GetBrandByID(ctx, brand.ID)
}

func (s *productService) DeleteBrand(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteBrand(ctx, id)
}

func (s *productService) ListBrands(ctx context.Context) ([]*models.Brand, error) {
	return s.repo.ListBrands(ctx)
}

// Product Variants Implementation
func (s *productService) CreateVariant(ctx context.Context, variant *models.ProductVariant) (*models.ProductVariant, error) {
	// Generate SKU for variant if not provided
	if variant.SKU == "" {
		// Get product to generate variant SKU
		product, err := s.repo.GetByID(ctx, variant.ProductID)
		if err != nil {
			return nil, err
		}
		variant.SKU = fmt.Sprintf("%s-V%d", product.SKU, 1) // Simple variant SKU generation
	}

	if err := s.repo.CreateVariant(ctx, variant); err != nil {
		return nil, err
	}

	return variant, nil
}

func (s *productService) UpdateVariant(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.ProductVariant, error) {
	// This would need to be implemented in repository first
	return nil, errors.New("not implemented")
}

func (s *productService) DeleteVariant(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteVariant(ctx, id)
}

func (s *productService) GetProductVariants(ctx context.Context, productID uuid.UUID) ([]*models.ProductVariant, error) {
	return s.repo.GetVariantsByProductID(ctx, productID)
}

// Inventory Management Implementation
func (s *productService) UpdateStock(ctx context.Context, productID uuid.UUID, quantity int, reason string, referenceID *string, createdBy *uuid.UUID) error {
	return s.repo.UpdateStock(ctx, productID, quantity, reason, referenceID, createdBy)
}

func (s *productService) GetLowStockProducts(ctx context.Context) ([]*models.Product, error) {
	return s.repo.GetLowStockProducts(ctx)
}

// Utility Functions
func (s *productService) GenerateSKU(ctx context.Context, categorySlug string) (string, error) {
	return s.repo.GenerateSKU(ctx, categorySlug)
}

func (s *productService) GenerateSlug(name string) string {
	// Convert to lowercase and replace spaces/special chars with hyphens
	slug := strings.ToLower(name)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, "_", "-")

	// Remove special characters
	var result strings.Builder
	for _, r := range slug {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			result.WriteRune(r)
		}
	}

	// Remove multiple consecutive hyphens
	slug = strings.ReplaceAll(result.String(), "--", "-")

	// Trim hyphens from start and end
	return strings.Trim(slug, "-")
}

func (s *productService) ValidateProduct(product *models.Product) error {
	if product.Name == "" {
		return errors.New("product name is required")
	}
	if product.Name != "" && len(product.Name) > 200 {
		return errors.New("product name must be less than 200 characters")
	}
	if product.SKU != "" && len(product.SKU) > 50 {
		return errors.New("SKU must be less than 50 characters")
	}
	if product.Slug != "" && len(product.Slug) > 200 {
		return errors.New("slug must be less than 200 characters")
	}
	if product.ShortDescription != nil && len(*product.ShortDescription) > 500 {
		return errors.New("short description must be less than 500 characters")
	}
	if product.Price.IsZero() || product.Price.IsNegative() {
		return errors.New("price must be greater than 0")
	}
	if product.ComparePrice != nil && product.ComparePrice.LessThan(product.Price) {
		return errors.New("compare price must be greater than or equal to price")
	}
	if product.StockQuantity < 0 {
		return errors.New("stock quantity cannot be negative")
	}

	return nil
}