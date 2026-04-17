"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Package } from "lucide-react";
import { productApi, Product } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [stockReason, setStockReason] = useState("Restock");

    const openStockDialog = (product: Product) => {
        setSelectedProduct(product);
        setStockQuantity(0);
        setStockDialogOpen(true);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        const { error } = await productApi.updateStock(selectedProduct.id, {
            quantity: stockQuantity,
            reason: stockReason,
        });
        if (error) {
            toast.error(error);
        } else {
            toast.success("Stock updated");
            setStockDialogOpen(false);
            fetchProducts();
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await productApi.listProducts({ search });
        if (error) {
            toast.error(error);
        } else {
            setProducts(data.products || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            const { error } = await productApi.deleteProduct(id);
            if (error) {
                toast.error(error);
            } else {
                toast.success("Product deleted successfully");
                fetchProducts();
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your store's products and inventory.
                    </p>
                </div>
                <Link href="/products/new">
                    <Button className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].startsWith("http") ? product.images[0] : `http://localhost:8080${product.images[0]}`}
                                                        alt={product.name}
                                                        className="object-cover size-full"
                                                    />
                                                ) : (
                                                    <Package className="size-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="font-medium">{product.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                    <TableCell>{product.category?.name || "N/A"}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={product.stock_quantity <= product.low_stock_threshold ? "text-destructive font-bold" : ""}>
                                                {product.stock_quantity}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "default" : "secondary"}>
                                            {product.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openStockDialog(product)}>
                                                    <Plus className="mr-2 h-4 w-4" /> Update Stock
                                                </DropdownMenuItem>
                                                <Link href={`/products/${product.id}`}>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Stock: {selectedProduct?.name}</DialogTitle>
                        <DialogDescription>
                            Adjust the inventory level. Enter a positive number to add stock, or a negative number to subtract.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity Change</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                                id="reason"
                                placeholder="Restock, Adjustment, Return..."
                                value={stockReason}
                                onChange={(e) => setStockReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStockDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateStock}>Update Stock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
