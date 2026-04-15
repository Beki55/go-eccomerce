'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative art-deco-corner"
    >
      <div
        className="luxury-card overflow-hidden"
        style={{
          borderColor: hovered ? '#D4AF37' : undefined,
          boxShadow: hovered ? '0 20px 60px rgba(212,175,55,0.2)' : undefined,
          transform: hovered ? 'translateY(-5px)' : undefined,
        }}
      >
        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden aspect-[3/4] bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="px-3 py-1 text-xs font-sans font-semibold tracking-widest uppercase"
                  style={{
                    background: product.badge === 'Sale'
                      ? 'rgba(0,0,0,0.85)'
                      : 'linear-gradient(135deg, #FFD700, #D4AF37)',
                    color: product.badge === 'Sale' ? '#D4AF37' : '#000',
                    border: '1px solid rgba(212,175,55,0.5)',
                  }}
                >
                  {product.badge}
                </span>
              </div>
            )}

            {discount && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-900/80 text-red-200">
                  -{discount}%
                </span>
              </div>
            )}

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center gap-3"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <motion.button
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    onClick={handleAddToCart}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shimmer-overlay"
                    style={{
                      background: addedToCart
                        ? 'linear-gradient(135deg, #FFD700, #D4AF37)'
                        : 'rgba(0,0,0,0.8)',
                      border: '1px solid #D4AF37',
                      color: addedToCart ? '#000' : '#D4AF37',
                    }}
                    title="Add to cart"
                  >
                    <ShoppingBag size={16} />
                  </motion.button>

                  <motion.button
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={e => {
                      e.preventDefault();
                      setWishlisted(!wishlisted);
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: 'rgba(0,0,0,0.8)',
                      border: `1px solid ${wishlisted ? '#FFD700' : '#D4AF37'}`,
                      color: wishlisted ? '#FFD700' : '#D4AF37',
                    }}
                    title="Add to wishlist"
                  >
                    <Heart size={16} fill={wishlisted ? '#FFD700' : 'none'} />
                  </motion.button>

                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37',
                      }}
                      title="Quick view"
                    >
                      <Eye size={16} />
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-xs font-sans text-muted-foreground tracking-widest uppercase mb-1">
                  {product.category}
                </p>
                <h3 className="font-serif text-base font-medium leading-tight text-foreground group-hover:text-[#D4AF37] transition-colors">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.rating} size={12} />
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-semibold gold-text">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="px-3 py-1.5 text-xs font-sans font-semibold tracking-wider uppercase rounded transition-all duration-300"
                style={{
                  background: isInCart(product.id) || addedToCart
                    ? 'linear-gradient(135deg, #FFD700, #D4AF37)'
                    : 'transparent',
                  border: '1px solid #D4AF37',
                  color: isInCart(product.id) || addedToCart ? '#000' : '#D4AF37',
                }}
              >
                {addedToCart ? 'Added!' : isInCart(product.id) ? 'In Cart' : 'Add'}
              </motion.button>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
