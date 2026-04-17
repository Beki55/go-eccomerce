"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productApi } from "@/lib/api/products";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setLoading(true);
        const fileArray = Array.from(files);

        const { data, error } = await productApi.uploadImages(fileArray);

        if (error) {
            toast.error(error);
        } else if (data) {
            onChange([...value, ...data.urls]);
            toast.success("Images uploaded successfully");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <img
                            className="object-cover size-full"
                            alt="Image"
                            src={url.startsWith("http") ? url : `http://localhost:8080${url}`}
                        />
                    </div>
                ))}
            </div>
            <div>
                <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-muted/50 transition bg-muted/20 border-muted">
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload images</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        disabled={loading}
                        onChange={onUpload}
                    />
                </label>
            </div>
        </div>
    );
}
