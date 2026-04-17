import { ProductForm } from "@/components/products/product-form";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">
                    Add a new product to your marketplace.
                </p>
            </div>
            <ProductForm />
        </div>
    );
}
