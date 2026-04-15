package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
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
		{Name: "user-service", BaseURL: "http://localhost:8081", Prefix: "/api/v1/users"},
		{Name: "product-service", BaseURL: "http://localhost:8082", Prefix: "/api/v1/products"},
		{Name: "cart-service", BaseURL: "http://localhost:8083", Prefix: "/api/v1/cart"},
		{Name: "order-service", BaseURL: "http://localhost:8084", Prefix: "/api/v1/orders"},
		{Name: "payment-service", BaseURL: "http://localhost:8085", Prefix: "/api/v1/payments"},
		{Name: "review-service", BaseURL: "http://localhost:8086", Prefix: "/api/v1/reviews"},
		{Name: "coupon-service", BaseURL: "http://localhost:8087", Prefix: "/api/v1/coupons"},
		{Name: "notification-service", BaseURL: "http://localhost:8088", Prefix: "/api/v1/notifications"},
	}

	log.Printf("🌐 [%s] Gateway starting on port %s", cfg.ServiceName, cfg.Port)
	log.Println("📡 Registered services:")
	for _, svc := range services {
		log.Printf("   ├── %s → %s (%s)", svc.Prefix, svc.BaseURL, svc.Name)
	}

	// TODO: Add HTTP router (gin/chi/fiber) with reverse proxy to each service
	// TODO: Add JWT middleware for authentication
	// TODO: Add rate limiting via Redis
	// TODO: Add request logging
	log.Println("⚠️  Gateway routes not yet implemented — add HTTP router next")
}
