import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi, Product, Category, Brand } from "@/lib/api/products";
import { toast } from "sonner";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  brands: () => [...productKeys.all, "brands"] as const,
};

// Products
export function useProducts(filters?: Record<string, any>) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: async () => {
      const { data, error } = await productApi.listProducts(filters);
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await productApi.getProduct(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: product, error } = await productApi.createProduct(data);
      if (error) throw new Error(error);
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: product, error } = await productApi.updateProduct(id, data);
      if (error) throw new Error(error);
      return product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(productKeys.detail(data.id), data);
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await productApi.deleteProduct(id);
      if (error) throw new Error(error);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { quantity: number; reason: string } }) => {
      const { error } = await productApi.updateStock(id, data);
      if (error) throw new Error(error);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Stock updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update stock");
    },
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: async () => {
      const { data, error } = await productApi.listCategories();
      if (error) throw new Error(error);
      return data;
    },
  });
}

// Categories
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const { data: category, error } = await productApi.createCategory(data);
      if (error) throw new Error(error);
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await productApi.updateCategory(id, data);
      if (error) throw new Error(error);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await productApi.deleteCategory(id);
      if (error) throw new Error(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const { data, error } = await productApi.uploadImages(files);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.success("Images uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload images");
    },
  });
}

// Brands
export function useBrands() {
  return useQuery({
    queryKey: productKeys.brands(),
    queryFn: async () => {
      const { data, error } = await productApi.listBrands();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const { data: brand, error } = await productApi.createBrand(data);
      if (error) throw new Error(error);
      return brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.brands() });
      toast.success("Brand created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create brand");
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await productApi.updateBrand(id, data);
      if (error) throw new Error(error);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.brands() });
      toast.success("Brand updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update brand");
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await productApi.deleteBrand(id);
      if (error) throw new Error(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.brands() });
      toast.success("Brand deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete brand");
    },
  });
}