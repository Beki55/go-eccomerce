package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/pkg/utils"
	"github.com/beki55/go-ecommerce/services/cart/handler"
	"github.com/beki55/go-ecommerce/services/cart/models"
	"github.com/beki55/go-ecommerce/services/cart/repository"
	"github.com/beki55/go-ecommerce/services/cart/service"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadServiceConfig("cart-service", "8083", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for cart session caching

	if err := database.AutoMigrate(db,
		&models.Cart{},
		&models.CartItem{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	// Dependency Injection
	cartRepo := repository.NewCartRepository(db)
	cartService := service.NewCartService(cartRepo)
	cartHandler := handler.NewCartHandler(cartService)

	// Authentication middleware (optional for session-based carts)
	authMiddleware := func(c *gin.Context) {
		token, err := c.Cookie("access_token")
		if err != nil {
			// No token, allow session-based access
			c.Next()
			return
		}

		claims, err := utils.ValidateToken(token, cfg.JWTSecret)
		if err != nil {
			// Invalid token, allow session-based access
			c.Next()
			return
		}

		// Valid token, set user context
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Next()
	}

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Session-ID")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Apply auth middleware to all routes
	r.Use(authMiddleware)

	// API routes
	api := r.Group("/api/v1")
	{
		cart := api.Group("/cart")
		{
			cart.GET("", cartHandler.GetCart)
			cart.POST("/items", cartHandler.AddItem)
			cart.PUT("/items/:itemId", cartHandler.UpdateItem)
			cart.DELETE("/items/:itemId", cartHandler.RemoveItem)
			cart.DELETE("", cartHandler.ClearCart)
			cart.POST("/coupon", cartHandler.ApplyCoupon)
			cart.DELETE("/coupon", cartHandler.RemoveCoupon)
		}
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
