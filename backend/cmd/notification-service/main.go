package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/services/notification/models"
)

func main() {
	cfg := config.LoadServiceConfig("notification-service", "8088", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for real-time notification pub/sub

	if err := database.AutoMigrate(db,
		&models.Notification{},
		&models.APILog{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
}
