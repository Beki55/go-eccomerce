'use client';

import { useQuery } from '@tanstack/react-query';
import {
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchProduct,
    mapBackendProduct,
    type ListProductsParams,
    type BackendCategory,
} from '@/lib/api';
import { type Product } from '@/lib/products';

export const productFrontKeys = {
  all: ['front-products'] as const,
  lists: () => [...productFrontKeys.all, 'list'] as const,
  list: (filters: ListProductsParams) => [...productFrontKeys.lists(), filters] as const,
  details: () => [...productFrontKeys.all, 'detail'] as const,
  detail: (id: string | undefined) => [...productFrontKeys.details(), id] as const,
  categories: () => [...productFrontKeys.all, 'categories'] as const,
  featured: (limit: number) => [...productFrontKeys.all, 'featured', limit] as const,
  related: (id: string | undefined, limit: number) => [...productFrontKeys.all, 'related', id, limit] as const,
};

// ─── useFeaturedProducts ──────────────────────────────────────────────────────

export function useFeaturedProducts(limit = 8) {
    const query = useQuery({
        queryKey: productFrontKeys.featured(limit),
        queryFn: async () => {
            const res = await fetchFeaturedProducts(limit);
            if (res.products && res.products.length > 0) {
                return res.products.map(mapBackendProduct) as unknown as Product[];
            }
            return [];
        },
    });

    return { 
        data: query.data || [], 
        loading: query.isLoading, 
        error: query.error ? query.error.message : null 
    };
}

// ─── useProductList ───────────────────────────────────────────────────────────

export function useProductList(params: ListProductsParams = {}) {
    const query = useQuery({
        queryKey: productFrontKeys.list(params),
        queryFn: async () => {
            const res = await fetchProducts(params);
            if (res.products && res.products.length > 0) {
                return {
                    data: res.products.map(mapBackendProduct) as unknown as Product[],
                    total: res.total
                };
            }
            return { data: [], total: 0 };
        },
    });

    return { 
        data: query.data?.data || [], 
        total: query.data?.total || 0,
        loading: query.isLoading, 
        error: query.error ? query.error.message : null, 
        refetch: query.refetch 
    };
}

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
    const query = useQuery({
        queryKey: productFrontKeys.categories(),
        queryFn: async () => {
            const cats: BackendCategory[] = await fetchCategories();
            if (cats && cats.length > 0) {
                const mapped = [
                    { id: 'all', name: 'All Items', count: 0 },
                    ...cats.map(c => ({ id: c.id, name: c.name, count: 0 })),
                ];
                return mapped;
            }
            return [];
        },
    });

    return { 
        data: query.data || [], 
        loading: query.isLoading 
    };
}

// ─── useProductDetail ─────────────────────────────────────────────────────────

export function useProductDetail(id: string) {
    const query = useQuery({
        queryKey: productFrontKeys.detail(id),
        queryFn: async () => {
            const p = await fetchProduct(id);
            const mapped = mapBackendProduct(p) as unknown as Product;
                
            // Fallback handling to ensure required properties always exist
            return {
                ...mapped,
                images: mapped.images?.length > 0 ? mapped.images : ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'],
                tags: mapped.tags || [],
                features: mapped.features || []
            };
        },
        enabled: !!id,
    });

    return { 
        data: query.data || null, 
        loading: query.isLoading, 
        error: query.error ? query.error.message : null 
    };
}

// ─── useRelatedProducts ───────────────────────────────────────────────────────

export function useRelatedProducts(productId: string, limit = 4) {
    const query = useQuery({
        queryKey: productFrontKeys.related(productId, limit),
        queryFn: async () => {
            const res = await fetchProducts({ limit: limit + 1 });
            if (res.products && res.products.length > 0) {
                const mapped = res.products.map(mapBackendProduct) as unknown as Product[];
                const filtered = mapped.filter(p => p.id !== productId).slice(0, limit);
                
                // Secure arrays
                return filtered.map(p => ({
                    ...p,
                    images: p.images?.length > 0 ? p.images : ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'],
                    tags: p.tags || [],
                    features: p.features || []
                }));
            }
            return [];
        },
        enabled: !!productId,
    });

    return { 
        data: query.data || [], 
        loading: query.isLoading 
    };
}
