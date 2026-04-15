'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import GoldBackground from '@/components/ui/GoldBackground';

const VALID_COUPONS: Record<string, number> = {
  LUXE10: 0.1,
  ELITE20: 0.2,
  VIP15: 0.15,
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const discount = appliedCoupon ? VALID_COUPONS[appliedCoupon] * subtotal : 0;
  const shipping = subtotal > 500 ? 0 : 35;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleApplyCoupon = () => {
    const upper = coupon.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      setAppliedCoupon(upper);
      setCouponSuccess(`${Math.round(VALID_COUPONS[upper] * 100)}% discount applied!`);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try LUXE10, ELITE20, or VIP15.');
      setCouponSuccess('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen pt-20">
        <GoldBackground />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.3)' }}>
              <ShoppingBag size={36} style={{ color: '#D4AF37' }} />
            </div>
            <h1 className="font-serif text-4xl font-light mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-sm mb-8 font-light">
              Discover our curated collection of luxury goods and add your favourites.
            </p>
            <Link href="/products" className="gold-btn rounded inline-flex items-center gap-2">
              Explore Collection
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-20">
      <GoldBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-2" style={{ color: '#D4AF37' }}>Your Selection</p>
          <h1 className="font-serif text-5xl font-light">
            Shopping <span className="gold-text font-semibold">Cart</span>
          </h1>
          <div className="gold-divider max-w-xs mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  layout
                  className="rounded-xl overflow-hidden art-deco-corner"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <div className="flex gap-4 p-4">
                    <Link href={`/products/${item.product.id}`} className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground mb-1">
                            {item.product.category}
                          </p>
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-serif text-lg font-medium text-foreground hover:text-[#D4AF37] transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.size && (
                            <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded transition-colors hover:text-red-400 text-muted-foreground flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-0 rounded" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#D4AF37] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium" style={{ borderLeft: '1px solid rgba(212,175,55,0.2)', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#D4AF37] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-serif text-lg font-semibold gold-text">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              ${item.product.price.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <Link href="/products" className="gold-outline-btn rounded inline-flex items-center gap-2 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-xl overflow-hidden sticky top-24"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37, #FFA500)' }} />
              <div className="p-6">
                <h2 className="font-serif text-2xl font-light mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#D4AF37' }}>
                    Promo Code
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        className="gold-input pl-9 text-sm w-full"
                        style={{ padding: '8px 12px 8px 34px' }}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="gold-btn rounded text-xs px-4 whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-400 mt-2">{couponError}</p>}
                  {couponSuccess && (
                    <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#D4AF37' }}>
                      <span>✦</span> {couponSuccess}
                    </p>
                  )}
                </div>

                <div className="gold-divider mb-5" />

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount ({appliedCoupon})</span>
                      <span className="text-green-400">-${discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <span style={{ color: '#D4AF37' }}>Free</span> : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="gold-divider mb-5" />

                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-sans font-semibold">Total</span>
                  <span className="font-serif text-2xl font-semibold gold-text">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="gold-btn rounded-lg w-full flex items-center justify-center gap-2 py-4"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free shipping on orders over $500
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {['VISA', 'MC', 'AMEX', 'PayPal'].map(method => (
                    <span
                      key={method}
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        color: '#D4AF37',
                        fontSize: '9px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
