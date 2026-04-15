package main

import (
	"log"
	"os"

	"github.com/beki55/go-ecommerce/pkg/config"
	"github.com/beki55/go-ecommerce/pkg/database"
	"github.com/beki55/go-ecommerce/pkg/utils"
	"github.com/beki55/go-ecommerce/services/user/handler"
	"github.com/beki55/go-ecommerce/services/user/models"
	"github.com/beki55/go-ecommerce/services/user/repository"
	"github.com/beki55/go-ecommerce/services/user/service"
	"github.com/gin-gonic/gin"
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
	_ = rdb

	if err := database.AutoMigrate(db,
		&models.User{},
		&models.Session{},
		&models.PasswordReset{},
		&models.Address{},
	); err != nil {
		log.Fatalf("❌ [%s] Migration failed: %v", cfg.ServiceName, err)
	}

	// Firebase Init
	firebaseCreds := os.Getenv("FIREBASE_CREDENTIALS_PATH")
	if firebaseCreds == "" {
		firebaseCreds = "./firebase-credentials.json"
	}

	fbApp, err := utils.InitFirebase(firebaseCreds)
	if err != nil {
		log.Printf("⚠️  Firebase initialization failed (Google Auth will be disabled): %v", err)
	}

	// Dependency Injection
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, fbApp, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	// Router Setup
	r := gin.Default()

	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/google", authHandler.GoogleLogin)
	}

	log.Printf("🚀 [%s] running on port %s", cfg.ServiceName, cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
