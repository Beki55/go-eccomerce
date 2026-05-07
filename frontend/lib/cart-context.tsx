'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart as useCartQuery, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/use-cart';
import { Product } from './products';

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  added_at: string;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isInCart: (productId: string) => boolean;
  isLoading: boolean;
  error: Error | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cart, isLoading, error } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const items = cart?.items || [];

  const addItem = useCallback(async (product: Product, quantity = 1, variantId?: string) => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        variantId,
        quantity,
        unitPrice: product.price.toString(),
      });
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    }
  }, [addToCartMutation]);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      await removeFromCartMutation.mutateAsync(itemId);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  }, [removeFromCartMutation]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
    } else {
      try {
        await updateCartItemMutation.mutateAsync({ itemId, quantity });
      } catch (err) {
        console.error('Failed to update item quantity:', err);
      }
    }
  }, [updateCartItemMutation, removeItem]);

  const clearCartCallback = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [clearCartMutation]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

  const isInCart = useCallback(
    (productId: string) => items.some(item => item.product_id === productId),
    [items]
  );

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart: clearCartCallback,
      totalItems,
      subtotal,
      isInCart,
      isLoading,
      error: error as Error | null,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
