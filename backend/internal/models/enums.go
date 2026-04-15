package models

import "database/sql/driver"

// UserRole represents the role of a user
type UserRole string

const (
	RoleCustomer UserRole = "customer"
	RoleAdmin    UserRole = "admin"
	RoleVendor   UserRole = "vendor"
)

func (r UserRole) Value() (driver.Value, error) { return string(r), nil }
func (r *UserRole) Scan(value interface{}) error {
	*r = UserRole(value.(string))
	return nil
}

// AddressType represents address category
type AddressType string

const (
	AddressShipping AddressType = "shipping"
	AddressBilling  AddressType = "billing"
)

func (a AddressType) Value() (driver.Value, error) { return string(a), nil }
func (a *AddressType) Scan(value interface{}) error {
	*a = AddressType(value.(string))
	return nil
}

// OrderStatus represents order lifecycle states
type OrderStatus string

const (
	OrderPending    OrderStatus = "pending"
	OrderConfirmed  OrderStatus = "confirmed"
	OrderProcessing OrderStatus = "processing"
	OrderShipped    OrderStatus = "shipped"
	OrderDelivered  OrderStatus = "delivered"
	OrderCancelled  OrderStatus = "cancelled"
	OrderRefunded   OrderStatus = "refunded"
	OrderReturned   OrderStatus = "returned"
)

func (o OrderStatus) Value() (driver.Value, error) { return string(o), nil }
func (o *OrderStatus) Scan(value interface{}) error {
	*o = OrderStatus(value.(string))
	return nil
}

// PaymentStatus represents payment states
type PaymentStatus string

const (
	PaymentPending  PaymentStatus = "pending"
	PaymentPaid     PaymentStatus = "paid"
	PaymentFailed   PaymentStatus = "failed"
	PaymentRefunded PaymentStatus = "refunded"
)

func (p PaymentStatus) Value() (driver.Value, error) { return string(p), nil }
func (p *PaymentStatus) Scan(value interface{}) error {
	*p = PaymentStatus(value.(string))
	return nil
}

// CouponType represents discount type
type CouponType string

const (
	CouponPercentage CouponType = "percentage"
	CouponFixed      CouponType = "fixed"
)

func (c CouponType) Value() (driver.Value, error) { return string(c), nil }
func (c *CouponType) Scan(value interface{}) error {
	*c = CouponType(value.(string))
	return nil
}
