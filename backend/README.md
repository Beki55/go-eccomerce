# Go Ecommerce Microservices

A high-performance, scalable e-commerce backend built with Go using a microservices architecture.

## 🏗 Architecture

The project is divided into several microservices, each responsible for a specific domain:

- **API Gateway**: Entry point for all requests. Handles routing and reverse proxying.
- **User Service**: Manages user registration, authentication (JWT), and profiles.
- **Product Service**: Handles product catalog, categories, and inventory.
- **Order Service**: Manages order creation, tracking, and history.
- **Cart Service**: Handles user shopping carts and persistence.
- **Payment Service**: Integrates with payment providers (Stripe/PayPal).
- **Notification Service**: Manages email and SMS notifications.
- **Coupon Service**: Handles discounts and promotional codes.
- **Review Service**: Manages product reviews and ratings.

## 🛠 Tech Stack

- **Language**: [Go](https://go.dev/) (v1.26.2+)
- **Web Framework**: [Gin Gonic](https://gin-gonic.com/)
- **ORM**: [GORM](https://gorm.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Caching**: [Redis](https://redis.io/)
- **Authentication**: JWT & [Firebase Auth](https://firebase.google.com/docs/auth)
- **API Documentation**: Swagger (In progress)

## 🚀 Getting Started

### Prerequisites

- Go 1.26.2 or higher
- Docker & Docker Compose (optional, for DB/Redis)
- PostgreSQL
- Redis

### Configuration

1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Update the `.env` file with your credentials.

### Installation & Build

Use the provided `Makefile` in the `backend` directory:

```bash
cd backend

# Build all services
make build

# Tidy dependencies
make tidy

# Clean binaries
make clean
```

### Running Services

You can run individual services using `go run` or the built binaries:

```bash
# Example: Run Gateway
make run-gateway

# Example: Run User Service
make run-user-service
```

## 📂 Project Structure

```text
.
├── backend
│   ├── cmd                   # Service entry points (main.go)
│   ├── pkg                   # Shared packages (config, db, utils)
│   ├── services              # Service-specific logic (handlers, services, repositories)
│   ├── bin                   # Compiled binaries
│   ├── Makefile              # Build tools
│   └── go.mod                # Go module definition
└── ...
```

## 📝 License

This project is licensed under the MIT License.
