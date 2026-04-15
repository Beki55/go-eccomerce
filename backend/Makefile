# Makefile for Go Ecommerce Microservices

# Services list
SERVICES := gateway user-service product-service order-service cart-service payment-service notification-service coupon-service review-service
BIN_DIR := bin

# Go parameters
GOCMD = go
GOBUILD = $(GOCMD) build
GOCLEAN = $(GOCMD) clean
GOTEST = $(GOCMD) test
GOMOD = $(GOCMD) mod

.PHONY: all build clean tidy test help $(SERVICES)

all: build

## build: Build all services
build: $(SERVICES)

$(SERVICES):
	@echo "Building $@..."
	@mkdir -p $(BIN_DIR)
	@$(GOBUILD) -o $(BIN_DIR)/$@ ./cmd/$@

## clean: Remove binary files
clean:
	@echo "Cleaning up binaries..."
	@rm -rf $(BIN_DIR)

## tidy: Tidy go modules
tidy:
	@$(GOMOD) tidy

## test: Run tests for all packages
test:
	@$(GOTEST) -v ./...

## help: Show this help message
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Shortcut to run a service (e.g., make run-gateway)
run-%:
	@$(GOCMD) run ./cmd/$*
