package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/utils"
	"github.com/gin-gonic/gin"
)

// ServiceEndpoint defines a backend microservice target
type ServiceEndpoint struct {
	Name    string
	BaseURL string
	Prefix  string
}

func main() {
	cfg := config.LoadServiceConfig("api-gateway", "8080", "")

	// Service registry — routes requests to backend microservices
	services := []ServiceEndpoint{
		{Name: "user-service", BaseURL: "http://localhost:8081", Prefix: "/api/v1/auth"},
		{Name: "user-service", BaseURL: "http://localhost:8081", Prefix: "/api/v1/users"},
		{Name: "product-service", BaseURL: "http://localhost:8082", Prefix: "/api/v1/products"},
		{Name: "cart-service", BaseURL: "http://localhost:8083", Prefix: "/api/v1/cart"},
		{Name: "order-service", BaseURL: "http://localhost:8084", Prefix: "/api/v1/orders"},
		{Name: "payment-service", BaseURL: "http://localhost:8085", Prefix: "/api/v1/payments"},
		{Name: "review-service", BaseURL: "http://localhost:8086", Prefix: "/api/v1/reviews"},
		{Name: "coupon-service", BaseURL: "http://localhost:8087", Prefix: "/api/v1/coupons"},
		{Name: "notification-service", BaseURL: "http://localhost:8088", Prefix: "/api/v1/notifications"},
	}

	r := gin.Default()

	// Admin authentication middleware
	adminAuthMiddleware := func(c *gin.Context) {
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
		c.Next()
	}

	// CORS middleware
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Allow specific origins for development
		allowedOrigins := []string{
			"http://localhost:3000", // frontend
			"http://localhost:3001", // dashboard
			"http://localhost:3002", // any other dev port
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
			"http://127.0.0.1:3002",
		}

		// Check if origin is allowed
		allowOrigin := false
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				allowOrigin = true
				break
			}
		}

		if allowOrigin {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Logger and Recovery middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "UP",
			"service": cfg.ServiceName,
		})
	})

	log.Printf("🌐 [%s] Gateway starting on port %s", cfg.ServiceName, cfg.Port)
	log.Println("📡 Registering service proxies:")

	for _, svc := range services {
		target, err := url.Parse(svc.BaseURL)
		if err != nil {
			log.Fatalf("❌ Invalid URL for service %s: %v", svc.Name, err)
		}

		proxy := httputil.NewSingleHostReverseProxy(target)
		log.Printf("   ├── %s → %s (%s)", svc.Prefix, svc.BaseURL, svc.Name)

		// Route handler with conditional middleware
		handler := func(c *gin.Context) {
			// Apply admin auth middleware for product routes
			if svc.Name == "product-service" {
				adminAuthMiddleware(c)
				if c.IsAborted() {
					return
				}
			}
			proxy.ServeHTTP(c.Writer, c.Request)
		}

		r.Any(svc.Prefix, handler)
		r.Any(svc.Prefix+"/*path", handler)
	}

	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ Failed to start gateway: %v", err)
	}
}
