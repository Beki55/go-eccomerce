package main

import (
	"log"

	"github.com/beki55/go-ecommerce/internal/config"
	"github.com/beki55/go-ecommerce/internal/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to PostgreSQL
	db, err := database.NewPostgresConnection(database.PostgresConfig{
		Host:     cfg.Database.Host,
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		DBName:   cfg.Database.DBName,
		SSLMode:  cfg.Database.SSLMode,
	})
	if err != nil {
		log.Fatalf("❌ PostgreSQL connection failed: %v", err)
	}

	// Connect to Redis
	_, err = database.NewRedisConnection(database.RedisConfig{
		Host:     cfg.Redis.Host,
		Port:     cfg.Redis.Port,
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})
	if err != nil {
		log.Fatalf("❌ Redis connection failed: %v", err)
	}

	// Run auto-migration (creates/updates all tables)
	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("❌ Migration failed: %v", err)
	}

	log.Printf("🚀 Server starting on port %s", cfg.Server.Port)
}
