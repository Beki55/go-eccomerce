import { apiClient, ApiResponse, PaginatedResponse } from "./client";

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string;
    image?: string;
    is_active: boolean;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    is_active: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: string;
    compare_price?: string;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
    is_featured: boolean;
    category_id?: string;
    brand_id?: string;
    images?: string[];
    description?: string;
    category?: Category;
    brand?: Brand;
}

export const productApi = {
    // Products
    listProducts: (params?: any) => {
        const searchParams = new URLSearchParams(params).toString();
        return apiClient.get<any>(`/products?${searchParams}`);
    },
    getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),
    createProduct: (data: any) => apiClient.post<Product>("/products", data),
    updateProduct: (id: string, data: any) => apiClient.put<Product>(`/products/${id}`, data),
    deleteProduct: (id: string) => apiClient.delete<any>(`/products/${id}`),
    updateStock: (id: string, data: { quantity: number; reason: string }) =>
        apiClient.put<any>(`/products/${id}/stock`, data),

    // Categories
    listCategories: () => apiClient.get<Category[]>("/categories"),
    createCategory: (data: any) => apiClient.post<Category>("/categories", data),
    updateCategory: (id: string, data: any) => apiClient.put<Category>(`/categories/${id}`, data),
    deleteCategory: (id: string) => apiClient.delete<any>(`/categories/${id}`),

    // Brands
    listBrands: () => apiClient.get<Brand[]>("/brands"),
    createBrand: (data: any) => apiClient.post<Brand>("/brands", data),
    updateBrand: (id: string, data: any) => apiClient.put<Brand>(`/brands/${id}`, data),
    deleteBrand: (id: string) => apiClient.delete<any>(`/brands/${id}`),

    // Image Upload
    uploadImages: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        // We use fetch directly here because apiClient.post stringifies body
        const url = `http://localhost:8080/api/v1/products/upload`;
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                credentials: "include",
                // Note: browser sets Content-Type to multipart/form-data with boundary automatically
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: error.error || "Upload failed" };
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return { error: error instanceof Error ? error.message : "Upload error" };
        }
    },
};
