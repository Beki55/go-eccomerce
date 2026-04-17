"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Folder } from "lucide-react";
import { productApi, Category } from "@/lib/api/products";
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

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await productApi.listCategories();
        if (error) {
            toast.error(error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!name) return;
        try {
            if (editingCategory) {
                const { error } = await productApi.updateCategory(editingCategory.id, { name, slug });
                if (error) throw new Error(error);
                toast.success("Category updated");
            } else {
                const { error } = await productApi.createCategory({ name, slug });
                if (error) throw new Error(error);
                toast.success("Category created");
            }
            setIsOpen(false);
            resetForm();
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setEditingCategory(null);
        setName("");
        setSlug("");
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setSlug(category.slug);
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this category?")) {
            const { error } = await productApi.deleteCategory(id);
            if (error) toast.error(error);
            else {
                toast.success("Category deleted");
                fetchCategories();
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage product categories.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                            <DialogDescription>
                                Create a new category for your products.
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
                            <Button onClick={handleSubmit}>{editingCategory ? "Update" : "Create"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
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
                        ) : categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Folder className="size-4 text-muted-foreground" />
                                    {cat.name}
                                </TableCell>
                                <TableCell>{cat.slug}</TableCell>
                                <TableCell>
                                    <Badge variant={cat.is_active ? "default" : "secondary"}>
                                        {cat.is_active ? "Active" : "Inactive"}
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
                                            <DropdownMenuItem onClick={() => handleEdit(cat)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cat.id)}>
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
