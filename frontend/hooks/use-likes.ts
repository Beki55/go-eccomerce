import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likeProduct,
  unlikeProduct,
  isProductLiked,
  getProductLikesCount,
  getUserLikes,
  BackendProduct,
  mapBackendProduct,
} from "@/lib/api";

export const likesQueryKeys = {
  productLiked: (productId: string) => ["likes", "product", productId, "liked"] as const,
  productLikesCount: (productId: string) => ["likes", "product", productId, "count"] as const,
  userLikes: ["likes", "user"] as const,
};

// Check if product is liked by current user
export function useIsProductLiked(productId: string) {
  return useQuery({
    queryKey: likesQueryKeys.productLiked(productId),
    queryFn: async () => {
      const result = await isProductLiked(productId);
      return result.liked;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Get product likes count
export function useProductLikesCount(productId: string) {
  return useQuery({
    queryKey: likesQueryKeys.productLikesCount(productId),
    queryFn: async () => {
      const result = await getProductLikesCount(productId);
      return result.count;
    },
    enabled: !!productId,
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
}

// Get user's liked products
export function useUserLikes() {
  return useQuery({
    queryKey: likesQueryKeys.userLikes,
    queryFn: async () => {
      const backendProducts = await getUserLikes();
      return backendProducts.map(mapBackendProduct);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Like a product
export function useLikeProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return likeProduct(productId);
    },
    onSuccess: (_, productId) => {
      // Invalidate and refetch the liked status and count for this product
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.productLiked(productId) });
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.productLikesCount(productId) });
      // Also invalidate user likes list
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.userLikes });
    },
  });
}

// Unlike a product
export function useUnlikeProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return unlikeProduct(productId);
    },
    onSuccess: (_, productId) => {
      // Invalidate and refetch the liked status and count for this product
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.productLiked(productId) });
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.productLikesCount(productId) });
      // Also invalidate user likes list
      queryClient.invalidateQueries({ queryKey: likesQueryKeys.userLikes });
    },
  });
}