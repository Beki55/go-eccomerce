// API Client for Go Ecommerce Backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// ─── Backend Response Types ───────────────────────────────────────────────────

export interface BackendProduct {
    id: string;
    sku: string;
    name: string;
    slug: string;
    short_description?: string;
    description?: string;
    price: string;         // decimal comes as string from Go
    compare_price?: string;
    cost_per_item?: string;
    stock_quantity: number;
    low_stock_threshold: number;
    images?: string[];     // JSON array of URLs
    tags?: string[];       // JSON array of strings
    attributes?: Record<string, unknown>;
    is_active: boolean;
    is_featured: boolean;
    is_digital: boolean;
    views_count: number;
    sold_count: number;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    brand?: {
        id: string;
        name: string;
        slug: string;
        logo?: string;
    };
    created_at: string;
    updated_at: string;
}

export interface BackendCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    is_active: boolean;
    sort_order: number;
    children?: BackendCategory[];
}

export interface BackendCartItem {
    id: string;
    cart_id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    added_at: string;
}

export interface BackendCart {
    id: string;
    user_id?: string;
    session_id?: string;
    coupon_code?: string;
    discount_amount: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
    items: BackendCartItem[];
}

export interface ListProductsResponse {
    products: BackendProduct[];
    total: number;
    page: number;
    limit: number;
}

export interface ListProductsParams {
    page?: number;
    limit?: number;
    category_id?: string;
    brand_id?: string;
    is_active?: boolean;
    is_featured?: boolean;
    search?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a BackendProduct into the shape our frontend ProductCard expects.
 * Fields that aren't available from the API are given sensible defaults.
 */
export function mapBackendProduct(p: BackendProduct) {
    // Parse images – could be an array or stringified JSON
    let images: string[] = [];
    if (Array.isArray(p.images)) {
        images = p.images.filter(Boolean);
    }

    // Prefix relative upload paths with the API base URL
    images = images.map(img =>
        img.startsWith('http') ? img : `${API_URL.replace('/api/v1', '')}${img}`
    );

    // Fallback image when no images are provided
    if (images.length === 0) {
        images = [
            'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
        ];
    }

    const price = parseFloat(p.price) || 0;
    const comparePrice = p.compare_price ? parseFloat(p.compare_price) : undefined;

    // Tags
    let tags: string[] = [];
    if (Array.isArray(p.tags)) tags = p.tags.filter(Boolean);

    // Badge derivation
    let badge: string | undefined;
    if (comparePrice && comparePrice > price) badge = 'Sale';
    else if (p.is_featured) badge = 'Featured';

    return {
        id: p.id,
        name: p.name,
        price,
        originalPrice: comparePrice,
        rating: 4.5,         // Will be provided by review service in future
        reviewCount: p.sold_count || 0,
        category: p.category?.name || 'General',
        subcategory: '',
        description: p.description || p.short_description || '',
        images,
        badge,
        inStock: p.stock_quantity > 0,
        tags,
        features: [],
        slug: p.slug,
        brand: p.brand?.name,
    };
}

// ─── API Functions ────────────────────────────────────────────────────────────

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

/** List products with optional filters & pagination */
export async function fetchProducts(params: ListProductsParams = {}): Promise<ListProductsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category_id) query.set('category_id', params.category_id);
    if (params.brand_id) query.set('brand_id', params.brand_id);
    if (params.search) query.set('search', params.search);
    if (params.is_active !== undefined) query.set('is_active', String(params.is_active));
    if (params.is_featured !== undefined) query.set('is_featured', String(params.is_featured));

    return fetchJSON<ListProductsResponse>(`/products?${query.toString()}`);
}

/** Fetch featured products (is_featured=true, limit 8) */
export async function fetchFeaturedProducts(limit = 8) {
    return fetchProducts({ is_featured: true, is_active: true, limit });
}

/** Fetch a single product by ID */
export async function fetchProduct(id: string): Promise<BackendProduct> {
    return fetchJSON<BackendProduct>(`/products/${id}`);
}

/** Fetch a single product by slug */
export async function fetchProductBySlug(slug: string): Promise<BackendProduct> {
    return fetchJSON<BackendProduct>(`/products/slug/${slug}`);
}

/** List all categories */
export async function fetchCategories(): Promise<BackendCategory[]> {
    return fetchJSON<BackendCategory[]>('/categories');
}

// ─── Cart API Functions ──────────────────────────────────────────────────────

/** Get current cart (authenticated or session-based) */
export async function fetchCart(sessionId?: string): Promise<BackendCart> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<BackendCart>('/cart', { headers });
}

/** Add item to cart */
export async function addCartItem(
    productId: string,
    variantId: string | undefined,
    quantity: number,
    unitPrice: string,
    sessionId?: string
): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>('/cart/items', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            product_id: productId,
            variant_id: variantId,
            quantity,
            unit_price: unitPrice,
        }),
    });
}

/** Update cart item quantity */
export async function updateCartItem(
    itemId: string,
    quantity: number,
    sessionId?: string
): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>(`/cart/items/${itemId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ quantity }),
    });
}

/** Remove item from cart */
export async function removeCartItem(itemId: string, sessionId?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>(`/cart/items/${itemId}`, {
        method: 'DELETE',
        headers,
    });
}

/** Clear cart */
export async function clearCart(sessionId?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>('/cart', {
        method: 'DELETE',
        headers,
    });
}

/** Apply coupon to cart */
export async function applyCoupon(
    couponCode: string,
    discountAmount: string,
    sessionId?: string
): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>('/cart/coupon', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            coupon_code: couponCode,
            discount_amount: discountAmount,
        }),
    });
}

/** Remove coupon from cart */
export async function removeCoupon(sessionId?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {};
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return fetchJSON<{ message: string }>('/cart/coupon', {
        method: 'DELETE',
        headers,
    });
}

export const apiClient = {
    get: async <T = any>(path: string, options?: RequestInit) => {
        const data = await fetchJSON<T>(path, { ...options, method: 'GET' });
        return { data };
    },
    post: async <T = any>(path: string, body?: any, options?: RequestInit) => {
        const data = await fetchJSON<T>(path, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
        return { data };
    },
    put: async <T = any>(path: string, body?: any, options?: RequestInit) => {
        const data = await fetchJSON<T>(path, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
        return { data };
    },
    delete: async <T = any>(path: string, options?: RequestInit) => {
        const data = await fetchJSON<T>(path, { ...options, method: 'DELETE' });
        return { data };
    },
};
