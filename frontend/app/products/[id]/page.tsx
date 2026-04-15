'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Share2, Shield, Truck, RotateCcw, ChevronLeft, Plus, Minus, Star } from 'lucide-react';
import GoldBackground from '@/components/ui/GoldBackground';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const { addItem, isInCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return notFound();

  const relatedProducts = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Features' },
    { id: 'care', label: 'Care & Shipping' },
  ];

  return (
    <div className="relative min-h-screen pt-20">
      <GoldBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <span style={{ color: '#D4AF37' }}>✦</span>
          <Link href="/products" className="hover:text-[#D4AF37] transition-colors">Collection</Link>
          <span style={{ color: '#D4AF37' }}>✦</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 text-xs font-sans font-semibold tracking-widest uppercase"
                    style={{
                      background: product.badge === 'Sale' ? 'rgba(0,0,0,0.85)' : 'linear-gradient(135deg, #FFD700, #D4AF37)',
                      color: product.badge === 'Sale' ? '#D4AF37' : '#000',
                      border: '1px solid rgba(212,175,55,0.5)',
                    }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${wishlisted ? '#FFD700' : 'rgba(212,175,55,0.5)'}`,
                  color: wishlisted ? '#FFD700' : '#D4AF37',
                }}
              >
                <Heart size={16} fill={wishlisted ? '#FFD700' : 'none'} />
              </button>
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="relative aspect-square w-20 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0"
                    style={{
                      border: `2px solid ${selectedImage === i ? '#D4AF37' : 'rgba(212,175,55,0.2)'}`,
                      boxShadow: selectedImage === i ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                    }}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <p className="font-sans text-xs tracking-[0.3em] uppercase" style={{ color: '#D4AF37' }}>
                {product.category} — {product.subcategory}
              </p>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} size={16} showValue reviewCount={product.reviewCount} />
              <span className="text-xs text-muted-foreground">{product.reviewCount} verified reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-4xl font-semibold gold-text">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-900/20 text-red-400 font-medium">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="gold-divider mb-8" />

            {/* Size Selector */}
            {product.category === 'Clothing' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4AF37' }}>
                    Size
                  </p>
                  <button className="text-xs text-muted-foreground hover:text-[#D4AF37] underline transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded border text-sm font-sans font-medium transition-all duration-300"
                      style={{
                        background: selectedSize === size ? 'linear-gradient(135deg, #FFD700, #D4AF37)' : 'transparent',
                        borderColor: selectedSize === size ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                        color: selectedSize === size ? '#000' : 'hsl(var(--foreground))',
                        boxShadow: selectedSize === size ? '0 0 15px rgba(212,175,55,0.3)' : 'none',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-sans text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#D4AF37' }}>
                Quantity
              </p>
              <div className="flex items-center gap-0 w-fit" style={{ border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center transition-colors hover:text-[#D4AF37]"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-sans font-semibold" style={{ borderLeft: '1px solid rgba(212,175,55,0.2)', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center transition-colors hover:text-[#D4AF37]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 gold-btn rounded-lg flex items-center justify-center gap-2 py-4"
                style={{
                  background: addedToCart
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : undefined,
                }}
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </motion.button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-14 h-14 rounded-lg border flex items-center justify-center transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                style={{
                  borderColor: wishlisted ? '#FFD700' : 'rgba(212,175,55,0.3)',
                  color: wishlisted ? '#FFD700' : 'hsl(var(--foreground))',
                }}
              >
                <Heart size={18} fill={wishlisted ? '#FFD700' : 'none'} />
              </button>

              <button
                className="w-14 h-14 rounded-lg border flex items-center justify-center transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                style={{ borderColor: 'rgba(212,175,55,0.3)' }}
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Shield, text: 'Authentic' },
                { icon: Truck, text: 'Free Shipping' },
                { icon: RotateCcw, text: '30-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg text-center"
                  style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.05)' }}
                >
                  <Icon size={16} style={{ color: '#D4AF37' }} />
                  <span className="text-xs font-sans text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-sans capitalize"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="flex gap-0 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-sans text-sm tracking-wider transition-all duration-300 relative ${
                  activeTab === tab.id ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-[#D4AF37]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tabBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37)' }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="pt-6"
            >
              {activeTab === 'description' && (
                <p className="font-serif text-base font-light leading-relaxed text-foreground max-w-2xl">
                  {product.description}
                </p>
              )}
              {activeTab === 'features' && (
                <ul className="space-y-3 max-w-md">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span style={{ color: '#D4AF37' }}>✦</span>
                      <span className="text-foreground font-light">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'care' && (
                <div className="space-y-4 max-w-md">
                  <div>
                    <h4 className="font-sans text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>Shipping</h4>
                    <p className="text-sm text-muted-foreground font-light">Complimentary white-glove delivery worldwide. Standard delivery in 3-5 business days. Express available.</p>
                  </div>
                  <div className="gold-divider" />
                  <div>
                    <h4 className="font-sans text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>Returns</h4>
                    <p className="text-sm text-muted-foreground font-light">We offer a 30-day return policy. Items must be in original condition with all tags attached and original packaging.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        <div>
          <div className="text-center mb-10">
            <p className="font-sans text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>
              You May Also Like
            </p>
            <h2 className="font-serif text-4xl font-light">
              Curated <span className="gold-text font-semibold">For You</span>
            </h2>
            <div className="gold-divider max-w-xs mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
