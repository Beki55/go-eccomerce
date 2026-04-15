package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/beki55/go-ecommerce/pkg/config"
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

		// Route handler for the proxy
		handler := func(c *gin.Context) {
			proxy.ServeHTTP(c.Writer, c.Request)
		}

		r.Any(svc.Prefix, handler)
		r.Any(svc.Prefix+"/*path", handler)
	}

	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ Failed to start gateway: %v", err)
	}
}
