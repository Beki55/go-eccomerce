"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Tag } from "lucide-react";
import { productApi, Brand } from "@/lib/api/products";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const fetchBrands = async () => {
        setLoading(true);
        const { data, error } = await productApi.listBrands();
        if (error) {
            toast.error(error);
        } else {
            setBrands(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSubmit = async () => {
        if (!name) return;
        try {
            if (editingBrand) {
                const { error } = await productApi.updateBrand(editingBrand.id, { name, slug });
                if (error) throw new Error(error);
                toast.success("Brand updated");
            } else {
                const { error } = await productApi.createBrand({ name, slug });
                if (error) throw new Error(error);
                toast.success("Brand created");
            }
            setIsOpen(false);
            resetForm();
            fetchBrands();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setEditingBrand(null);
        setName("");
        setSlug("");
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setName(brand.name);
        setSlug(brand.slug);
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this brand?")) {
            const { error } = await productApi.deleteBrand(id);
            if (error) toast.error(error);
            else {
                toast.success("Brand deleted");
                fetchBrands();
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
                    <p className="text-muted-foreground">Manage product brands.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Brand
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
                            <DialogDescription>
                                Create a new brand for your products.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (Optional)</Label>
                                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit}>{editingBrand ? "Update" : "Create"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Brand</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Tag className="size-4 text-muted-foreground" />
                                    {brand.name}
                                </TableCell>
                                <TableCell>{brand.slug}</TableCell>
                                <TableCell>
                                    <Badge variant={brand.is_active ? "default" : "secondary"}>
                                        {brand.is_active ? "Active" : "Inactive"}
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
                                            <DropdownMenuItem onClick={() => handleEdit(brand)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(brand.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
