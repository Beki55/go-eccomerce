package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/services/order/models"
)

func main() {
	cfg := config.LoadServiceConfig("order-service", "8084", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for order status caching, rate limiting

	if err := database.AutoMigrate(db,
		&models.Order{},
		&models.OrderItem{},
		&models.OrderStatusHistory{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
}
