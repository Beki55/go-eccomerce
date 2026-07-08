'use client';

import React, { createContext, useContext, useCallback } from 'react';
import {
    useUserLikes,
    useIsProductLiked,
    useLikeProduct,
    useUnlikeProduct,
} from '@/hooks/use-likes';
import { Product } from './products';

interface LikesContextType {
    likedProducts: Product[];
    totalLikes: number;
    isLoading: boolean;
    error: Error | null;
    toggleLike: (productId: string) => void;
    isLiked: (productId: string) => boolean;
    likeIds: Set<string>;
}

const LikesContext = createContext<LikesContextType | null>(null);

export function LikesProvider({ children }: { children: React.ReactNode }) {
    const { data: likedProducts, isLoading, error } = useUserLikes();
    const likeMutation = useLikeProduct();
    const unlikeMutation = useUnlikeProduct();

    const items = likedProducts || [];
    const likeIds = new Set(items.map((p) => p.id));

    const isLikedFn = useCallback(
        (productId: string) => likeIds.has(productId),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items]
    );

    const toggleLike = useCallback(
        (productId: string) => {
            if (likeIds.has(productId)) {
                unlikeMutation.mutate(productId);
            } else {
                likeMutation.mutate(productId);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items, likeMutation, unlikeMutation]
    );

    return (
        <LikesContext.Provider
            value={{
                likedProducts: items,
                totalLikes: items.length,
                isLoading,
                error: error as Error | null,
                toggleLike,
                isLiked: isLikedFn,
                likeIds,
            }}
        >
            {children}
        </LikesContext.Provider>
    );
}

export function useLikes() {
    const ctx = useContext(LikesContext);
    if (!ctx) throw new Error('useLikes must be used within LikesProvider');
    return ctx;
}
