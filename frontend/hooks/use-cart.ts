import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export const cartQueryKeys = {
  cart: (userId: string) => ["cart", userId] as const,
};

// Fetch user's cart
export function useCart(userId: string) {
  return useQuery({
    queryKey: cartQueryKeys.cart(userId),
    queryFn: async (): Promise<Cart> => {
      const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) => {
      const response = await axios.post(`${API_BASE_URL}/api/cart/${userId}/items`, {
        productId,
        quantity,
      });
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart(userId) });
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      itemId,
      quantity
    }: {
      userId: string;
      itemId: string;
      quantity: number;
    }) => {
      const response = await axios.put(`${API_BASE_URL}/api/cart/${userId}/items/${itemId}`, {
        quantity,
      });
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart(userId) });
    },
  });
}

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, itemId }: { userId: string; itemId: string }) => {
      await axios.delete(`${API_BASE_URL}/api/cart/${userId}/items/${itemId}`);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart(userId) });
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await axios.delete(`${API_BASE_URL}/api/cart/${userId}`);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart(userId) });
    },
  });
}