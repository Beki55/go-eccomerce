"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ShoppingBag,
    ArrowRight,
    Trash2,
    Loader2,
    Eye,
} from "lucide-react";
import { useLikes } from "@/lib/likes-context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import GoldBackground from "@/components/ui/GoldBackground";
import { toast } from "sonner";

export default function WishlistPage() {
    const { likedProducts, totalLikes, isLoading, error, toggleLike } =
        useLikes();
    const { user } = useAuth();
    const { addItem, isInCart } = useCart();
    const router = useRouter();
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

    const needsLogin =
        !user || error?.message?.toLowerCase().includes("please login");

    const handleAddToCart = (product: any) => {
        addItem(product);
        setAddedItems((prev) => new Set(prev).add(product.id));
        toast.success(`${product.name} added to cart`);
        setTimeout(() => {
            setAddedItems((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 2000);
    };

    const handleRemoveFromWishlist = (productId: string, productName: string) => {
        toggleLike(productId);
        toast.success(`${productName} removed from wishlist`);
    };

    const handleAddAllToCart = () => {
        likedProducts.forEach((product) => {
            if (!isInCart(product.id)) {
                addItem(product);
            }
        });
        toast.success("All wishlist items added to cart!");
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-20">
                <GoldBackground />
                <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
                    <div
                        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{
                            background: "rgba(212,175,55,0.1)",
                            border: "2px solid rgba(212,175,55,0.3)",
                        }}
                    >
                        <Heart size={36} style={{ color: "#D4AF37" }} />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                        <p className="text-muted-foreground">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Not logged in or error state
    if (needsLogin) {
        return (
            <div className="relative min-h-screen pt-20">
                <GoldBackground />
                <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{
                                background: "rgba(212,175,55,0.1)",
                                border: "2px solid rgba(212,175,55,0.3)",
                            }}
                        >
                            <Heart size={36} style={{ color: "#D4AF37" }} />
                        </div>
                        <h1 className="font-serif text-4xl font-light mb-4">
                            Please Login First
                        </h1>
                        <p className="text-muted-foreground text-sm mb-8 font-light">
                            Sign in to view and manage your wishlist.
                        </p>
                        <Link
                            href="/auth"
                            className="gold-btn rounded inline-flex items-center gap-2"
                        >
                            Go to Login
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="relative min-h-screen pt-20">
                <GoldBackground />
                <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
                    <div
                        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{
                            background: "rgba(212,175,55,0.1)",
                            border: "2px solid rgba(212,175,55,0.3)",
                        }}
                    >
                        <Heart size={36} style={{ color: "#D4AF37" }} />
                    </div>
                    <h1 className="font-serif text-4xl font-light mb-4">
                        Error Loading Wishlist
                    </h1>
                    <p className="text-muted-foreground text-sm mb-8">{error.message}</p>
                </div>
            </div>
        );
    }

    // Empty wishlist
    if (likedProducts.length === 0) {
        return (
            <div className="relative min-h-screen pt-20">
                <GoldBackground />
                <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{
                                background: "rgba(212,175,55,0.1)",
                                border: "2px solid rgba(212,175,55,0.3)",
                            }}
                        >
                            <Heart size={36} style={{ color: "#D4AF37" }} />
                        </div>
                        <h1 className="font-serif text-4xl font-light mb-4">
                            Your Wishlist is Empty
                        </h1>
                        <p className="text-muted-foreground text-sm mb-8 font-light">
                            Discover our curated collection and save your favourite pieces for
                            later.
                        </p>
                        <Link
                            href="/products"
                            className="gold-btn rounded inline-flex items-center gap-2"
                        >
                            Explore Collection
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Wishlist with items
    return (
        <div className="relative min-h-screen pt-20">
            <GoldBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <p
                        className="font-sans text-xs tracking-[0.4em] uppercase mb-2"
                        style={{ color: "#D4AF37" }}
                    >
                        Your Favourites
                    </p>
                    <h1 className="font-serif text-5xl font-light">
                        My <span className="gold-text font-semibold">Wishlist</span>
                    </h1>
                    <div className="gold-divider max-w-xs mt-4" />
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-muted-foreground">
                            {totalLikes} {totalLikes === 1 ? "item" : "items"} saved
                        </p>
                        {likedProducts.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddAllToCart}
                                className="gold-outline-btn rounded text-xs flex items-center gap-2"
                            >
                                <ShoppingBag size={14} />
                                Add All to Cart
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {likedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                layout
                                className="group relative"
                            >
                                <div
                                    className="rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
                                    style={{
                                        background: "hsl(var(--card))",
                                        border: "1px solid rgba(212,175,55,0.2)",
                                    }}
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="relative block aspect-[3/4] overflow-hidden"
                                    >
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-3">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{
                                                        background: "rgba(0,0,0,0.8)",
                                                        border: "1px solid #D4AF37",
                                                        color: "#D4AF37",
                                                    }}
                                                >
                                                    <Eye size={16} />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        {product.badge && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span
                                                    className="px-3 py-1 text-xs font-sans font-semibold tracking-widest uppercase"
                                                    style={{
                                                        background:
                                                            product.badge === "Sale"
                                                                ? "rgba(0,0,0,0.85)"
                                                                : "linear-gradient(135deg, #FFD700, #D4AF37)",
                                                        color:
                                                            product.badge === "Sale" ? "#D4AF37" : "#000",
                                                        border: "1px solid rgba(212,175,55,0.5)",
                                                    }}
                                                >
                                                    {product.badge}
                                                </span>
                                            </div>
                                        )}

                                        {/* Liked heart */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveFromWishlist(product.id, product.name);
                                            }}
                                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, rgba(255,0,80,0.9), rgba(220,30,70,0.9))",
                                                border: "1px solid rgba(255,255,255,0.3)",
                                                color: "#fff",
                                            }}
                                            title="Remove from wishlist"
                                        >
                                            <Heart size={14} fill="#fff" />
                                        </button>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <p className="text-xs font-sans text-muted-foreground tracking-widest uppercase mb-1">
                                            {product.category}
                                        </p>
                                        <Link href={`/products/${product.id}`}>
                                            <h3 className="font-serif text-base font-medium leading-tight text-foreground hover:text-[#D4AF37] transition-colors mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="font-serif text-lg font-semibold gold-text">
                                                {product.price.toLocaleString()} Birr
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {product.originalPrice.toLocaleString()} Birr
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 py-2.5 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300"
                                                style={{
                                                    background:
                                                        isInCart(product.id) || addedItems.has(product.id)
                                                            ? "linear-gradient(135deg, #FFD700, #D4AF37)"
                                                            : "transparent",
                                                    border: "1px solid #D4AF37",
                                                    color:
                                                        isInCart(product.id) || addedItems.has(product.id)
                                                            ? "#000"
                                                            : "#D4AF37",
                                                }}
                                            >
                                                <ShoppingBag size={14} />
                                                {addedItems.has(product.id)
                                                    ? "Added!"
                                                    : isInCart(product.id)
                                                        ? "In Cart"
                                                        : "Add to Cart"}
                                            </motion.button>

                                            <button
                                                onClick={() =>
                                                    handleRemoveFromWishlist(product.id, product.name)
                                                }
                                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:text-red-400 text-muted-foreground flex-shrink-0"
                                                style={{
                                                    border: "1px solid rgba(212,175,55,0.2)",
                                                }}
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Continue Shopping */}
                <div className="pt-8 text-center">
                    <Link
                        href="/products"
                        className="gold-outline-btn rounded inline-flex items-center gap-2 text-sm"
                    >
                        Continue Shopping
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
