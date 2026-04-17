package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/beki55/go-ecommerce/services/product/models"
	"github.com/beki55/go-ecommerce/services/product/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
)

type ProductHandler struct {
	productService service.ProductService
}

func NewProductHandler(productService service.ProductService) *ProductHandler {
	return &ProductHandler{productService: productService}
}

// Product Handlers
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req struct {
		CategoryID         *uuid.UUID       `json:"category_id"`
		BrandID           *uuid.UUID       `json:"brand_id"`
		VendorID          *uuid.UUID       `json:"vendor_id"`
		SKU               string          `json:"sku"`
		Name              string          `json:"name" binding:"required"`
		Slug              string          `json:"slug"`
		ShortDescription  *string         `json:"short_description"`
		Description       *string         `json:"description"`
		Price             decimal.Decimal `json:"price" binding:"required"`
		ComparePrice      *decimal.Decimal `json:"compare_price"`
		CostPerItem       *decimal.Decimal `json:"cost_per_item"`
		StockQuantity     int             `json:"stock_quantity"`
		LowStockThreshold int             `json:"low_stock_threshold"`
		Weight            *decimal.Decimal `json:"weight"`
		Dimensions        interface{}     `json:"dimensions"`
		Images            []string        `json:"images"`
		VideoURL          *string         `json:"video_url"`
		Attributes        interface{}     `json:"attributes"`
		Tags              []string        `json:"tags"`
		IsActive          bool            `json:"is_active"`
		IsFeatured        bool            `json:"is_featured"`
		IsDigital         bool            `json:"is_digital"`
		DownloadableFile  *string         `json:"downloadable_file"`
		MetaTitle         *string         `json:"meta_title"`
		MetaDescription   *string         `json:"meta_description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert JSON fields
	dimensionsJSON, _ := json.Marshal(req.Dimensions)
	imagesJSON, _ := json.Marshal(req.Images)
	attributesJSON, _ := json.Marshal(req.Attributes)
	tagsJSON, _ := json.Marshal(req.Tags)

	product := &models.Product{
		CategoryID:         req.CategoryID,
		BrandID:           req.BrandID,
		VendorID:          req.VendorID,
		SKU:               req.SKU,
		Name:              req.Name,
		Slug:              req.Slug,
		ShortDescription:  req.ShortDescription,
		Description:       req.Description,
		Price:             req.Price,
		ComparePrice:      req.ComparePrice,
		CostPerItem:       req.CostPerItem,
		StockQuantity:     req.StockQuantity,
		LowStockThreshold: req.LowStockThreshold,
		Weight:            req.Weight,
		Dimensions:        datatypes.JSON(dimensionsJSON),
		Images:            datatypes.JSON(imagesJSON),
		VideoURL:          req.VideoURL,
		Attributes:        datatypes.JSON(attributesJSON),
		Tags:              datatypes.JSON(tagsJSON),
		IsActive:          req.IsActive,
		IsFeatured:        req.IsFeatured,
		IsDigital:         req.IsDigital,
		DownloadableFile:  req.DownloadableFile,
		MetaTitle:         req.MetaTitle,
		MetaDescription:   req.MetaDescription,
	}

	createdProduct, err := h.productService.CreateProduct(c.Request.Context(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProduct)
}

func (h *ProductHandler) GetProduct(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	product, err := h.productService.GetProduct(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) GetProductBySlug(c *gin.Context) {
	slug := c.Param("slug")

	product, err := h.productService.GetProductBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product, err := h.productService.UpdateProduct(c.Request.Context(), id, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	if err := h.productService.DeleteProduct(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "product deleted successfully"})
}

func (h *ProductHandler) ListProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	filters := make(map[string]interface{})

	if categoryID := c.Query("category_id"); categoryID != "" {
		if id, err := uuid.Parse(categoryID); err == nil {
			filters["category_id"] = id
		}
	}
	if brandID := c.Query("brand_id"); brandID != "" {
		if id, err := uuid.Parse(brandID); err == nil {
			filters["brand_id"] = id
		}
	}
	if isActive := c.Query("is_active"); isActive != "" {
		filters["is_active"] = isActive == "true"
	}
	if isFeatured := c.Query("is_featured"); isFeatured != "" {
		filters["is_featured"] = isFeatured == "true"
	}
	if search := c.Query("search"); search != "" {
		filters["search"] = search
	}

	products, total, err := h.productService.ListProducts(c.Request.Context(), page, limit, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// Category Handlers
func (h *ProductHandler) CreateCategory(c *gin.Context) {
	var req struct {
		ParentID    *uuid.UUID `json:"parent_id"`
		Name        string     `json:"name" binding:"required"`
		Slug        string     `json:"slug"`
		Description *string    `json:"description"`
		Image       *string    `json:"image"`
		IsActive    bool       `json:"is_active"`
		SortOrder   int        `json:"sort_order"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category := &models.Category{
		ParentID:    req.ParentID,
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
		Image:       req.Image,
		IsActive:    req.IsActive,
		SortOrder:   req.SortOrder,
	}

	createdCategory, err := h.productService.CreateCategory(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdCategory)
}

func (h *ProductHandler) GetCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	category, err := h.productService.GetCategory(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *ProductHandler) UpdateCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category, err := h.productService.UpdateCategory(c.Request.Context(), id, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *ProductHandler) DeleteCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	if err := h.productService.DeleteCategory(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "category deleted successfully"})
}

func (h *ProductHandler) ListCategories(c *gin.Context) {
	var parentID *uuid.UUID
	if pid := c.Query("parent_id"); pid != "" {
		if id, err := uuid.Parse(pid); err == nil {
			parentID = &id
		}
	}

	categories, err := h.productService.ListCategories(c.Request.Context(), parentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// Brand Handlers
func (h *ProductHandler) CreateBrand(c *gin.Context) {
	var req struct {
		Name        string  `json:"name" binding:"required"`
		Slug        string  `json:"slug"`
		Logo        *string `json:"logo"`
		Description *string `json:"description"`
		Website     *string `json:"website"`
		IsActive    bool    `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	brand := &models.Brand{
		Name:        req.Name,
		Slug:        req.Slug,
		Logo:        req.Logo,
		Description: req.Description,
		Website:     req.Website,
		IsActive:    req.IsActive,
	}

	createdBrand, err := h.productService.CreateBrand(c.Request.Context(), brand)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdBrand)
}

func (h *ProductHandler) GetBrand(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid brand ID"})
		return
	}

	brand, err := h.productService.GetBrand(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "brand not found"})
		return
	}

	c.JSON(http.StatusOK, brand)
}

func (h *ProductHandler) UpdateBrand(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid brand ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	brand, err := h.productService.UpdateBrand(c.Request.Context(), id, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, brand)
}

func (h *ProductHandler) DeleteBrand(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid brand ID"})
		return
	}

	if err := h.productService.DeleteBrand(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "brand deleted successfully"})
}

func (h *ProductHandler) ListBrands(c *gin.Context) {
	brands, err := h.productService.ListBrands(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, brands)
}

// Inventory Handlers
func (h *ProductHandler) UpdateStock(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	var req struct {
		Quantity   int     `json:"quantity" binding:"required"`
		Reason     string  `json:"reason" binding:"required"`
		ReferenceID *string `json:"reference_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context (assuming middleware sets it)
	var createdBy *uuid.UUID
	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(uuid.UUID); ok {
			createdBy = &uid
		}
	}

	if err := h.productService.UpdateStock(c.Request.Context(), id, req.Quantity, req.Reason, req.ReferenceID, createdBy); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "stock updated successfully"})
}

func (h *ProductHandler) GetLowStockProducts(c *gin.Context) {
	products, err := h.productService.GetLowStockProducts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}