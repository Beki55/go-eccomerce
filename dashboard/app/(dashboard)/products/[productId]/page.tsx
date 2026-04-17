"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { productApi, Product } from "@/lib/api/products";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const productId = params.productId as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await productApi.getProduct(productId);
            if (error) {
                toast.error(error);
            } else if (data) {
                setProduct(data);
            }
            setLoading(false);
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Product not found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-muted-foreground">
                    Update the product details and variants.
                </p>
            </div>
            <ProductForm initialData={product} />
        </div>
    );
}
