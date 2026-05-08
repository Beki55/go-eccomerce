package handler

import (
	"log"
	"net/http"

	"github.com/beki55/go-ecommerce/services/cart/models"
	"github.com/beki55/go-ecommerce/services/cart/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type CartHandler struct {
	cartService service.CartService
}

func NewCartHandler(cartService service.CartService) *CartHandler {
	return &CartHandler{cartService: cartService}
}

func (h *CartHandler) getAuthenticatedUserCart(c *gin.Context) (*models.Cart, bool) {
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "please login first"})
		return nil, false
	}

	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "please login first"})
		return nil, false
	}

	cart, err := h.cartService.GetOrCreateCart(&userID, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return nil, false
	}

	return cart, true
}

// GetCart retrieves the current logged in user's cart
func (h *CartHandler) GetCart(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	c.JSON(http.StatusOK, cart)
}

// AddItem adds an item to the cart
func (h *CartHandler) AddItem(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	var req struct {
		ProductID string  `json:"product_id" binding:"required"`
		VariantID *string `json:"variant_id"`
		Quantity  int     `json:"quantity" binding:"required,min=1"`
		UnitPrice string  `json:"unit_price" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	productID, err := uuid.Parse(req.ProductID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product_id"})
		return
	}

	var variantID *uuid.UUID
	if req.VariantID != nil {
		vID, err := uuid.Parse(*req.VariantID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid variant_id"})
			return
		}
		variantID = &vID
	}

	unitPrice, err := decimal.NewFromString(req.UnitPrice)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid unit_price"})
		return
	}

	err = h.cartService.AddItem(cart, productID, variantID, req.Quantity, unitPrice)
	if err != nil {
		log.Printf("Error adding item to cart: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "item added to cart"})
}

// UpdateItem updates the quantity of an item in the cart
func (h *CartHandler) UpdateItem(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	itemIDStr := c.Param("itemId")
	itemID, err := uuid.Parse(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item ID"})
		return
	}

	var req struct {
		Quantity int `json:"quantity" binding:"required,min=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.cartService.UpdateItemQuantity(cart, itemID, req.Quantity)
	if err != nil {
		if err.Error() == "item not found in cart" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "item updated"})
}

// RemoveItem removes an item from the cart
func (h *CartHandler) RemoveItem(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	itemIDStr := c.Param("itemId")
	itemID, err := uuid.Parse(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item ID"})
		return
	}

	err = h.cartService.RemoveItem(cart, itemID)
	if err != nil {
		if err.Error() == "item not found in cart" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "item removed"})
}

// ClearCart clears all items from the cart
func (h *CartHandler) ClearCart(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	err := h.cartService.ClearCart(cart)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "cart cleared"})
}

// ApplyCoupon applies a coupon to the cart
func (h *CartHandler) ApplyCoupon(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	var req struct {
		CouponCode     string `json:"coupon_code" binding:"required"`
		DiscountAmount string `json:"discount_amount" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	discountAmount, err := decimal.NewFromString(req.DiscountAmount)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid discount_amount"})
		return
	}

	err = h.cartService.ApplyCoupon(cart, req.CouponCode, discountAmount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "coupon applied"})
}

// RemoveCoupon removes the coupon from the cart
func (h *CartHandler) RemoveCoupon(c *gin.Context) {
	cart, ok := h.getAuthenticatedUserCart(c)
	if !ok {
		return
	}

	err := h.cartService.RemoveCoupon(cart)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "coupon removed"})
}
