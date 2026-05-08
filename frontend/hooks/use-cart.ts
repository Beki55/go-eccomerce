import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  BackendCart,
  BackendCartItem,
  fetchProduct,
  mapBackendProduct,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Product } from "@/lib/products";

export interface CartItem extends BackendCartItem {
  product?: Product;
}

export interface Cart extends Omit<BackendCart, "items"> {
  items: CartItem[];
}

export const cartQueryKeys = {
  cart: ["cart"] as const,
};

// Fetch current cart
export function useCart() {
  const { user, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: [...cartQueryKeys.cart, user?.id ?? "guest"],
    queryFn: async (): Promise<Cart> => {
      const backendCart = await fetchCart();

      // Fetch product details for each cart item
      const itemsWithProducts: CartItem[] = await Promise.all(
        (backendCart.items || []).map(async (item) => {
          try {
            const product = await fetchProduct(item.product_id);
            const mappedProduct = mapBackendProduct(product);
            return {
              ...item,
              product: mappedProduct,
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.product_id}:`, error);
            return item; // Return item without product if fetch fails
          }
        }),
      );

      return {
        ...backendCart,
        items: itemsWithProducts,
      };
    },
    enabled: !isAuthLoading && !!user,
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
      unitPrice,
    }: {
      productId: string;
      variantId?: string;
      quantity: number;
      unitPrice: string;
    }) => {
      return addCartItem(productId, variantId, quantity, unitPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      return updateCartItem(itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return removeCartItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}

// Apply coupon
export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      couponCode,
      discountAmount,
    }: {
      couponCode: string;
      discountAmount: string;
    }) => {
      return applyCoupon(couponCode, discountAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}

// Remove coupon
export function useRemoveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
    },
  });
}
