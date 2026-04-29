'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    mapBackendProduct,
    type ListProductsParams,
    type BackendCategory,
} from '@/lib/api';
import { type Product, products as staticProducts, categories as staticCategories } from '@/lib/products';

// ─── useFeaturedProducts ──────────────────────────────────────────────────────

export function useFeaturedProducts(limit = 8) {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await fetchFeaturedProducts(limit);
                if (!cancelled) {
                    if (res.products && res.products.length > 0) {
                        setData(res.products.map(mapBackendProduct) as unknown as Product[]);
                    } else {
                        // Fallback to static data when DB is empty
                        setData(staticProducts.slice(0, limit));
                    }
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    console.warn('Failed to fetch featured products from API, using static data.', err);
                    setData(staticProducts.slice(0, limit));
                    setError(null); // Don't propagate error – just use fallback
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [limit]);

    return { data, loading, error };
}

// ─── useProductList ───────────────────────────────────────────────────────────

export function useProductList(params: ListProductsParams = {}) {
    const [data, setData] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const key = JSON.stringify(params);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchProducts(params);
            if (res.products && res.products.length > 0) {
                setData(res.products.map(mapBackendProduct) as unknown as Product[]);
                setTotal(res.total);
            } else {
                setData(staticProducts);
                setTotal(staticProducts.length);
            }
            setError(null);
        } catch (err) {
            console.warn('Failed to fetch products from API, using static data.', err);
            setData(staticProducts);
            setTotal(staticProducts.length);
            setError(null);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => { load(); }, [load]);

    return { data, total, loading, error, refetch: load };
}

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
    const [data, setData] = useState(staticCategories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const cats: BackendCategory[] = await fetchCategories();
                if (!cancelled && cats.length > 0) {
                    const mapped = [
                        { id: 'all', name: 'All Items', count: 0 },
                        ...cats.map(c => ({ id: c.id, name: c.name, count: 0 })),
                    ];
                    setData(mapped);
                }
            } catch {
                // silently fall back to static data
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return { data, loading };
}
