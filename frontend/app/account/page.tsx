'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Star, CreditCard as Edit2, Plus, Trash2, Check, Bell, Shield, CreditCard } from 'lucide-react';
import GoldBackground from '@/components/ui/GoldBackground';
import StarRating from '@/components/ui/StarRating';
import { products } from '@/lib/products';
import { useAuth } from '@/lib/auth-context';

const mockOrders = [
  { id: 'LUXE-A8F2K3', date: 'April 10, 2026', status: 'Delivered', items: 2, total: 1090, product: products[0] },
  { id: 'LUXE-B7C1M4', date: 'March 28, 2026', status: 'In Transit', items: 1, total: 1290, product: products[1] },
  { id: 'LUXE-D5E9N2', date: 'March 12, 2026', status: 'Processing', items: 3, total: 2420, product: products[2] },
];

const mockWishlist = products.slice(3, 7);

const mockAddresses = [
  { id: 1, label: 'Home', name: 'Alexandre Dupont', line1: '12 Rue de Rivoli', city: 'Paris', country: 'France', zip: '75001', default: true },
  { id: 2, label: 'Office', name: 'Alexandre Dupont', line1: '45 Avenue des Champs-Élysées', city: 'Paris', country: 'France', zip: '75008', default: false },
];

const statusColors: Record<string, string> = {
  Delivered: 'rgba(34,197,94,0.15)',
  'In Transit': 'rgba(212,175,55,0.15)',
  Processing: 'rgba(59,130,246,0.15)',
};

const statusTextColors: Record<string, string> = {
  Delivered: '#22c55e',
  'In Transit': '#D4AF37',
  Processing: '#60a5fa',
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative min-h-screen pt-20">
      <GoldBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-2" style={{ color: '#D4AF37' }}>My Profile</p>
          <h1 className="font-serif text-5xl font-light">
            My <span className="gold-text font-semibold">Account</span>
          </h1>
          <div className="gold-divider max-w-xs mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37, #FFA500)' }} />

              {/* Profile */}
              <div className="p-6 text-center border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <Image
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-20 h-20"
                    style={{ border: '2px solid rgba(212,175,55,0.5)' }}
                  />
                  <button
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', color: '#000' }}
                  >
                    <Edit2 size={11} />
                  </button>
                </div>
                <h3 className="font-serif text-lg font-medium">Alexandre Dupont</h3>
                <p className="text-xs text-muted-foreground">Member since 2022</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star size={12} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                  <span className="text-xs font-sans font-semibold" style={{ color: '#D4AF37' }}>Gold Member</span>
                </div>
              </div>

              <nav className="p-3">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                      activeTab === item.id
                        ? 'text-[#D4AF37]'
                        : 'text-muted-foreground hover:text-[#D4AF37]'
                    }`}
                    style={{
                      background: activeTab === item.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                    }}
                  >
                    <item.icon size={15} />
                    {item.label}
                    {activeTab === item.id && <ChevronRight size={12} className="ml-auto" />}
                  </button>
                ))}

                <div className="gold-divider my-3" />

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-red-400 transition-colors">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Orders', value: '12' },
                      { label: 'Total Spent', value: '$18,420' },
                      { label: 'Wishlist Items', value: `${wishlist.length}` },
                    ].map(stat => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-5 text-center"
                        style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}
                      >
                        <p className="font-serif text-3xl font-semibold gold-text mb-1">{stat.value}</p>
                        <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="rounded-xl overflow-hidden" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                      <h3 className="font-serif text-xl font-light">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-sans text-muted-foreground hover:text-[#D4AF37] transition-colors">
                        View All
                      </button>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                      {mockOrders.slice(0, 2).map(order => (
                        <div key={order.id} className="flex items-center gap-4 p-4">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                            <Image src={order.product.images[0]} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                            <p className="text-sm font-medium mt-0.5">{order.date}</p>
                            <p className="text-xs text-muted-foreground">{order.items} item{order.items > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-serif font-semibold gold-text">${order.total.toLocaleString()}</p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-sans"
                              style={{ background: statusColors[order.status], color: statusTextColors[order.status] }}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="rounded-xl overflow-hidden" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                      <h3 className="font-serif text-xl font-light">Order History</h3>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                      {mockOrders.map(order => (
                        <div key={order.id} className="flex items-center gap-4 p-5 hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                          <div className="relative w-14 h-18 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                            <Image src={order.product.images[0]} alt="" width={56} height={72} className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                            <p className="text-sm font-medium mt-0.5">{order.date}</p>
                            <p className="text-xs text-muted-foreground">{order.items} item{order.items > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-serif font-semibold text-xl gold-text">${order.total.toLocaleString()}</p>
                            <span
                              className="text-xs px-2 py-1 rounded-full mt-1 inline-block font-sans font-medium"
                              style={{ background: statusColors[order.status], color: statusTextColors[order.status] }}
                            >
                              {order.status}
                            </span>
                            <button className="block text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors mt-1 ml-auto">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="rounded-xl overflow-hidden" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                      <h3 className="font-serif text-xl font-light">Wishlist ({wishlist.length} items)</h3>
                    </div>
                    {wishlist.length === 0 ? (
                      <div className="p-12 text-center">
                        <Heart size={36} className="mx-auto mb-4" style={{ color: 'rgba(212,175,55,0.3)' }} />
                        <p className="text-muted-foreground">Your wishlist is empty</p>
                        <Link href="/products" className="gold-outline-btn rounded inline-flex mt-4 text-sm">Browse Collection</Link>
                      </div>
                    ) : (
                      <div className="divide-y" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                        {wishlist.map(product => (
                          <div key={product.id} className="flex items-center gap-4 p-4">
                            <Link href={`/products/${product.id}`} className="relative w-14 h-18 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                              <Image src={product.images[0]} alt={product.name} width={56} height={72} className="object-cover" />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground tracking-wider uppercase">{product.category}</p>
                              <Link href={`/products/${product.id}`}>
                                <p className="font-serif text-base font-medium hover:text-[#D4AF37] transition-colors">{product.name}</p>
                              </Link>
                              <StarRating rating={product.rating} size={12} />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-serif font-semibold gold-text">${product.price.toLocaleString()}</p>
                              <Link href={`/products/${product.id}`} className="text-xs gold-btn rounded px-3 py-1.5">
                                Add to Cart
                              </Link>
                              <button
                                onClick={() => setWishlist(prev => prev.filter(p => p.id !== product.id))}
                                className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
                              >
                                <Trash2 size={11} /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  {mockAddresses.map(addr => (
                    <div
                      key={addr.id}
                      className="rounded-xl p-6 relative"
                      style={{
                        background: 'hsl(var(--card))',
                        border: `1px solid ${addr.default ? '#D4AF37' : 'rgba(212,175,55,0.2)'}`,
                        boxShadow: addr.default ? '0 0 20px rgba(212,175,55,0.1)' : 'none',
                      }}
                    >
                      {addr.default && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-sans font-semibold rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                          Default
                        </span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={14} style={{ color: '#D4AF37' }} />
                        <span className="font-sans text-sm font-semibold tracking-wider uppercase" style={{ color: '#D4AF37' }}>{addr.label}</span>
                      </div>
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-sm text-muted-foreground">{addr.line1}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.zip}</p>
                      <p className="text-sm text-muted-foreground">{addr.country}</p>
                      <div className="flex gap-3 mt-4">
                        <button className="gold-outline-btn rounded text-xs px-4 py-2 flex items-center gap-1.5">
                          <Edit2 size={11} /> Edit
                        </button>
                        {!addr.default && (
                          <button className="text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                            <Check size={11} /> Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="w-full rounded-xl p-4 border-2 border-dashed text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 text-sm" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                    <Plus size={16} /> Add New Address
                  </button>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl p-8" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h3 className="font-serif text-xl font-light mb-6 flex items-center gap-2">
                      <User size={18} style={{ color: '#D4AF37' }} /> Profile Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>First Name</label>
                        <input type="text" defaultValue="Alexandre" className="gold-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Last Name</label>
                        <input type="text" defaultValue="Dupont" className="gold-input" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4AF37' }}>Email</label>
                        <input type="email" defaultValue="alexandre@example.com" className="gold-input" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-8" style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h3 className="font-serif text-xl font-light mb-6 flex items-center gap-2">
                      <Bell size={18} style={{ color: '#D4AF37' }} /> Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Order Updates', desc: 'Receive shipping and delivery notifications' },
                        { label: 'New Arrivals', desc: 'Be first to know about new luxury pieces' },
                        { label: 'Exclusive Offers', desc: 'Members-only promotions and events' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div>
                            <p className="font-sans text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <button
                            className="w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)' }}
                          >
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="gold-btn rounded-lg px-10 py-4 flex items-center gap-2"
                    style={{
                      background: savedSuccess ? 'linear-gradient(135deg, #22c55e, #16a34a)' : undefined,
                    }}
                  >
                    {savedSuccess ? <><Check size={16} /> Saved!</> : 'Save Changes'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
