package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/beki55/go-ecommerce/internal/models"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB holds database and cache connections
type DB struct {
	Postgres *gorm.DB
	Redis    *redis.Client
}

// PostgresConfig holds PostgreSQL connection parameters
type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// RedisConfig holds Redis connection parameters
type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

// NewPostgresConnection establishes a connection to PostgreSQL
func NewPostgresConnection(cfg PostgresConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Enable UUID extension
	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")

	log.Println("✅ PostgreSQL connected successfully")
	return db, nil
}

// NewRedisConnection establishes a connection to Redis
func NewRedisConnection(cfg RedisConfig) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("✅ Redis connected successfully")
	return client, nil
}

// AutoMigrate runs GORM auto-migration for all models
func AutoMigrate(db *gorm.DB) error {
	log.Println("🔄 Running database migrations...")

	err := db.AutoMigrate(
		// 1. User & Auth
		&models.User{},
		&models.Session{},
		&models.PasswordReset{},

		// 2. Address
		&models.Address{},

		// 3. Product Catalog
		&models.Category{},
		&models.Brand{},
		&models.Product{},
		&models.ProductVariant{},
		&models.InventoryLog{},

		// 4. Shopping Cart
		&models.Cart{},
		&models.CartItem{},

		// 5. Order Management
		&models.Order{},
		&models.OrderItem{},
		&models.OrderStatusHistory{},

		// 6. Reviews & Ratings
		&models.Review{},
		&models.ReviewHelpfulVote{},

		// 7. Wishlist & Favorites
		&models.Wishlist{},
		&models.ProductLike{},

		// 8. Coupons & Discounts
		&models.Coupon{},
		&models.CouponUsage{},

		// 9. Payments
		&models.Payment{},
		&models.Refund{},

		// 10. Notifications & Logging
		&models.Notification{},
		&models.APILog{},
	)
	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("✅ Database migrations completed successfully")
	return nil
}
