package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/services/payment/models"
)

func main() {
	cfg := config.LoadServiceConfig("payment-service", "8085", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for payment idempotency keys

	if err := database.AutoMigrate(db,
		&models.Payment{},
		&models.Refund{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
}
