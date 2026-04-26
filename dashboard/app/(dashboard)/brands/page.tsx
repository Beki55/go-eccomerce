"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Tag } from "lucide-react";
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
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "@/hooks/use-products";

export default function BrandsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const { data: brands = [], isLoading } = useBrands();
    const createBrandMutation = useCreateBrand();
    const updateBrandMutation = useUpdateBrand();
    const deleteBrandMutation = useDeleteBrand();

    const handleSubmit = () => {
        if (!name) return;
        if (editingBrand) {
            updateBrandMutation.mutate(
                { id: editingBrand.id, data: { name, slug } },
                {
                    onSuccess: () => {
                        setIsOpen(false);
                        resetForm();
                    },
                }
            );
        } else {
            createBrandMutation.mutate(
                { name, slug },
                {
                    onSuccess: () => {
                        setIsOpen(false);
                        resetForm();
                    },
                }
            );
        }
    };

    const resetForm = () => {
        setEditingBrand(null);
        setName("");
        setSlug("");
    };

    const handleEdit = (brand: any) => {
        setEditingBrand(brand);
        setName(brand.name);
        setSlug(brand.slug);
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this brand?")) {
            deleteBrandMutation.mutate(id);
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No brands found.</TableCell>
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
