import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/lib/products";

// Assuming your backend API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Query keys for React Query
export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  categories: ["categories"] as const,
};

// Fetch all products
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async (): Promise<Product[]> => {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      return response.data;
    },
    // Since currently using static data, you can set initialData
    // initialData: products,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: async (): Promise<Product> => {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Fetch products by category
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: [...queryKeys.products, "category", category],
    queryFn: async (): Promise<Product[]> => {
      const response = await axios.get(
        `${API_BASE_URL}/api/products/category/${category}`,
      );
      return response.data;
    },
    enabled: !!category,
  });
}

// Mutation for creating a product (admin functionality)
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id">): Promise<Product> => {
      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        product,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
}

// Mutation for updating a product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: Product): Promise<Product> => {
      const response = await axios.put(
        `${API_BASE_URL}/api/products/${id}`,
        product,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(data.id) });
    },
  });
}

// Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async (): Promise<
      { id: string; name: string; count: number }[]
    > => {
      const backendCategories = await fetchCategories();
      // For now, add a count property (could be fetched separately or calculated)
      return backendCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: 0, // TODO: Fetch actual count from backend
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
