package main

import (
	"log"
	"net/http"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/pkg/utils"
	"github.com/beki55/go-ecommerce/services/product/handler"
	"github.com/beki55/go-ecommerce/services/product/models"
	"github.com/beki55/go-ecommerce/services/product/repository"
	"github.com/beki55/go-ecommerce/services/product/service"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadServiceConfig("product-service", "8082", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for product caching, search, etc.

	if err := database.AutoMigrate(db,
		&models.Category{},
		&models.Brand{},
		&models.Product{},
		&models.ProductVariant{},
		&models.InventoryLog{},
		&models.Wishlist{},
		&models.ProductLike{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	// Dependency Injection
	productRepo := repository.NewProductRepository(db)
	productService := service.NewProductService(productRepo)
	productHandler := handler.NewProductHandler(productService)

	// Admin middleware (for protected routes)
	adminMiddleware := func(c *gin.Context) {
		token, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "no token"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(token, cfg.JWTSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// Check if user is admin
		if claims.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "admin access required"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Next()
	}

	// Setup Gin router
	r := gin.Default()

	// API routes
	api := r.Group("/api/v1")
	{
		// Public product routes (read-only)
		products := api.Group("/products")
		{
			products.GET("", productHandler.ListProducts)
			products.GET("/:id", productHandler.GetProduct)
			products.GET("/slug/:slug", productHandler.GetProductBySlug)
			products.GET("/low-stock", productHandler.GetLowStockProducts)
		}

		// Public category routes
		categories := api.Group("/categories")
		{
			categories.GET("", productHandler.ListCategories)
			categories.GET("/:id", productHandler.GetCategory)
		}

		// Public brand routes
		brands := api.Group("/brands")
		{
			brands.GET("", productHandler.ListBrands)
			brands.GET("/:id", productHandler.GetBrand)
		}

		// Admin-only routes (require authentication)
		admin := api.Group("")
		admin.Use(adminMiddleware)
		{
			// Admin product routes
			adminProducts := admin.Group("/products")
			{
				adminProducts.POST("", productHandler.CreateProduct)
				adminProducts.PUT("/:id", productHandler.UpdateProduct)
				adminProducts.DELETE("/:id", productHandler.DeleteProduct)
				adminProducts.PUT("/:id/stock", productHandler.UpdateStock)
			}

			// Admin category routes
			adminCategories := admin.Group("/categories")
			{
				adminCategories.POST("", productHandler.CreateCategory)
				adminCategories.PUT("/:id", productHandler.UpdateCategory)
				adminCategories.DELETE("/:id", productHandler.DeleteCategory)
			}

			// Admin brand routes
			adminBrands := admin.Group("/brands")
			{
				adminBrands.POST("", productHandler.CreateBrand)
				adminBrands.PUT("/:id", productHandler.UpdateBrand)
				adminBrands.DELETE("/:id", productHandler.DeleteBrand)
			}
		}
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
