'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, CreditCard, Truck, User, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import GoldBackground from '@/components/ui/GoldBackground';

const steps = [
  { id: 1, label: 'Contact', icon: User },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
];

const shippingMethods = [
  { id: 'standard', label: 'Standard Delivery', desc: '5-7 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', desc: '2-3 business days', price: 25 },
  { id: 'overnight', label: 'White Glove Overnight', desc: 'Next business day', price: 75 },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [contact, setContact] = useState({ email: '', firstName: '', lastName: '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'United States' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });

  const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="relative min-h-screen pt-20 flex items-center justify-center">
        <GoldBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', boxShadow: '0 0 40px rgba(212,175,55,0.5)' }}
          >
            <Check size={40} color="#000" strokeWidth={2.5} />
          </motion.div>
          <h1 className="font-serif text-4xl font-light mb-3">Order Confirmed</h1>
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#D4AF37' }}>
            Thank you for your purchase
          </p>
          <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8">
            Your order has been received and is being prepared with the utmost care. You will receive a confirmation email shortly with tracking details.
          </p>
          <p className="font-mono text-sm mb-8" style={{ color: '#D4AF37' }}>
            Order #LUXE-{Math.random().toString(36).substr(2, 8).toUpperCase()}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account" className="gold-btn rounded flex items-center gap-2 justify-center">
              View My Orders
            </Link>
            <Link href="/products" className="gold-outline-btn rounded flex items-center gap-2 justify-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-20">
      <GoldBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-light mb-6">
            Secure <span className="gold-text font-semibold">Checkout</span>
          </h1>

          {/* Steps */}
          <div className="flex items-center justify-center gap-0 max-w-xs mx-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-1 ${currentStep > step.id ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: currentStep >= step.id
                        ? 'linear-gradient(135deg, #FFD700, #D4AF37)'
                        : 'transparent',
                      border: currentStep >= step.id ? 'none' : '1px solid rgba(212,175,55,0.3)',
                      boxShadow: currentStep === step.id ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                    }}
                  >
                    {currentStep > step.id ? (
                      <Check size={16} color="#000" />
                    ) : (
                      <step.icon size={16} color={currentStep >= step.id ? '#000' : '#D4AF37'} />
                    )}
                  </div>
                  <span className="text-xs font-sans" style={{ color: currentStep >= step.id ? '#D4AF37' : 'hsl(var(--muted-foreground))' }}>
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-12 h-px mx-1 mb-5" style={{ background: currentStep > step.id ? 'linear-gradient(90deg, #FFD700, #D4AF37)' : 'rgba(212,175,55,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-xl p-8"
                  style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <h2 className="font-serif text-2xl font-light mb-6">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>First Name</label>
                      <input type="text" className="gold-input" value={contact.firstName} onChange={e => setContact({ ...contact, firstName: e.target.value })} placeholder="Alexandre" />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Last Name</label>
                      <input type="text" className="gold-input" value={contact.lastName} onChange={e => setContact({ ...contact, lastName: e.target.value })} placeholder="Dupont" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Email Address</label>
                      <input type="email" className="gold-input" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="alexandre@example.com" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Phone Number</label>
                      <input type="tel" className="gold-input" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="gold-btn rounded-lg w-full mt-6 flex items-center justify-center gap-2 py-4">
                    Continue to Shipping <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl p-8" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h2 className="font-serif text-2xl font-light mb-6">Delivery Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Address Line 1</label>
                        <input type="text" className="gold-input" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} placeholder="12 Rue du Faubourg" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Address Line 2</label>
                        <input type="text" className="gold-input" value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} placeholder="Apt 3B (optional)" />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>City</label>
                        <input type="text" className="gold-input" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Paris" />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>ZIP Code</label>
                        <input type="text" className="gold-input" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} placeholder="75001" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-8" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h2 className="font-serif text-2xl font-light mb-6">Shipping Method</h2>
                    <div className="space-y-3">
                      {shippingMethods.map(method => (
                        <button
                          key={method.id}
                          onClick={() => setShippingMethod(method.id)}
                          className="w-full rounded-lg p-4 text-left transition-all duration-300"
                          style={{
                            border: `1px solid ${shippingMethod === method.id ? '#D4AF37' : 'rgba(212,175,55,0.2)'}`,
                            background: shippingMethod === method.id ? 'rgba(212,175,55,0.08)' : 'transparent',
                            boxShadow: shippingMethod === method.id ? '0 0 15px rgba(212,175,55,0.15)' : 'none',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center`} style={{ borderColor: shippingMethod === method.id ? '#D4AF37' : 'rgba(212,175,55,0.3)' }}>
                                {shippingMethod === method.id && <div className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />}
                              </div>
                              <div>
                                <p className="font-sans text-sm font-medium">{method.label}</p>
                                <p className="text-xs text-muted-foreground">{method.desc}</p>
                              </div>
                            </div>
                            <span className="font-serif font-semibold" style={{ color: '#D4AF37' }}>
                              {method.price === 0 ? 'Free' : `$${method.price}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setCurrentStep(3)} className="gold-btn rounded-lg w-full flex items-center justify-center gap-2 py-4">
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-xl p-8"
                  style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-light">Payment Details</h2>
                    <div className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
                      <ShieldCheck size={16} />
                      <span className="text-xs font-sans">Secure & Encrypted</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Cardholder Name</label>
                      <input type="text" className="gold-input" value={payment.name} onChange={e => setPayment({ ...payment, name: e.target.value })} placeholder="As it appears on your card" />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Card Number</label>
                      <div className="relative">
                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
                        <input type="text" className="gold-input pl-10" maxLength={19} value={payment.cardNumber} onChange={e => setPayment({ ...payment, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Expiry Date</label>
                        <input type="text" className="gold-input" maxLength={5} value={payment.expiry} onChange={e => setPayment({ ...payment, expiry: e.target.value })} placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Security Code</label>
                        <input type="text" className="gold-input" maxLength={4} value={payment.cvv} onChange={e => setPayment({ ...payment, cvv: e.target.value })} placeholder="CVV" />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    className="gold-btn rounded-lg w-full mt-6 flex items-center justify-center gap-2 py-4 text-base"
                  >
                    <ShieldCheck size={18} />
                    Place Order — ${total.toFixed(2)}
                  </motion.button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden sticky top-24" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37, #FFA500)' }} />
              <div className="p-6">
                <h3 className="font-serif text-xl font-light mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', color: '#000' }}>
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                      <p className="text-sm font-serif font-semibold" style={{ color: '#D4AF37' }}>
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="gold-divider mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? <span style={{ color: '#D4AF37' }}>Free</span> : `$${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="gold-divider my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Total</span>
                  <span className="font-serif text-2xl font-semibold gold-text">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
