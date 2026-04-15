package main

import (
	"log"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/services/user/models"
)

func main() {
	cfg := config.LoadServiceConfig("user-service", "8081", "go_ecommerce")

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("❌ [%s] DB connection failed: %v", cfg.ServiceName, err)
	}

	rdb, err := database.NewRedisConnection(cfg.Redis)
	if err != nil {
		log.Fatalf("❌ [%s] Redis connection failed: %v", cfg.ServiceName, err)
	}
	_ = rdb // Will be used for session caching, rate limiting, etc.

	if err := database.AutoMigrate(db,
		&models.User{},
		&models.Session{},
		&models.PasswordReset{},
		&models.Address{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
}
