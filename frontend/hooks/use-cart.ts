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

export interface CartItem extends BackendCartItem {
    product?: {
        id: string;
        name: string;
        price: number;
        images: string[];
    };
}

export interface Cart extends Omit<BackendCart, 'items'> {
    items: CartItem[];
}

export const cartQueryKeys = {
    cart: ["cart"] as const,
};

// Generate or get session ID for guest users
function getSessionId(): string {
    let sessionId = localStorage.getItem('cart-session-id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cart-session-id', sessionId);
    }
    return sessionId;
}

// Fetch current cart
export function useCart() {
    return useQuery({
        queryKey: cartQueryKeys.cart,
        queryFn: async (): Promise<Cart> => {
            const sessionId = getSessionId();
            const backendCart = await fetchCart(sessionId);
            
            // Fetch product details for each cart item
            const itemsWithProducts: CartItem[] = await Promise.all(
                backendCart.items.map(async (item) => {
                    try {
                        const product = await fetchProduct(item.product_id);
                        const mappedProduct = mapBackendProduct(product);
                        return {
                            ...item,
                            product: {
                                id: mappedProduct.id,
                                name: mappedProduct.name,
                                price: mappedProduct.price,
                                images: mappedProduct.images,
                            },
                        };
                    } catch (error) {
                        console.error(`Failed to fetch product ${item.product_id}:`, error);
                        return item; // Return item without product if fetch fails
                    }
                })
            );
            
            return {
                ...backendCart,
                items: itemsWithProducts,
            };
        },
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
            const sessionId = getSessionId();
            return addCartItem(productId, variantId, quantity, unitPrice, sessionId);
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
            const sessionId = getSessionId();
            return updateCartItem(itemId, quantity, sessionId);
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
            const sessionId = getSessionId();
            return removeCartItem(itemId, sessionId);
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
        mutationFn: async () => {
            const sessionId = getSessionId();
            return clearCart(sessionId);
        },
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
            const sessionId = getSessionId();
            return applyCoupon(couponCode, discountAmount, sessionId);
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
        mutationFn: async () => {
            const sessionId = getSessionId();
            return removeCoupon(sessionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
        },
    });
}
