'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shield, Truck, RefreshCw, Award } from 'lucide-react';
import GoldBackground from '@/components/ui/GoldBackground';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { products, testimonials, categories } from '@/lib/products';

const featuredProducts = products.slice(0, 4);

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const categoryImages = [
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <GoldBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://image.slidesdocs.com/responsive-images/background/shopping-online-made-easy-with-mobile-app-3d-rendering-powerpoint-background_3663844562__960_540.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#D4AF37' }}>
              The Pinnacle of Luxurys
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl font-light text-white mb-6 leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            ELEVATE
            <br />
            <span className="gold-text font-semibold">YOUR STYLE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-light text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed tracking-wide"
          >
            Discover luxury at your fingertips — where every piece tells a story of masterful craftsmanship and timeless elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products" className="gold-btn rounded shimmer-overlay flex items-center gap-2">
              Shop Collection
              <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="px-8 py-3 font-sans font-semibold text-sm tracking-widest uppercase text-white border border-white/30 rounded hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300">
              Explore More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            {[{ value: '25K+', label: 'Happy Clients' }, { value: '98%', label: 'Satisfaction' }, { value: '150+', label: 'Brands' }].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-2xl font-semibold gold-text">{stat.value}</p>
                <p className="text-xs font-sans tracking-widest uppercase text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border flex items-center justify-center"
            style={{ borderColor: 'rgba(212,175,55,0.5)' }}
          >
            <div className="w-1.5 h-3 rounded-full" style={{ background: '#D4AF37' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="relative z-10 py-10 border-y" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Authenticity Guaranteed', desc: 'Every item verified' },
              { icon: Truck, title: 'White Glove Delivery', desc: 'Complimentary worldwide' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day policy' },
              { icon: Award, title: 'Award-Winning Service', desc: 'Since 1998' },
            ].map(({ icon: Icon, title, desc }) => (
              <FadeInSection key={title}>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <Icon size={18} style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>
                Curated Selection
              </p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-4">
                Featured <span className="gold-text font-semibold">Pieces</span>
              </h2>
              <div className="gold-divider max-w-xs mx-auto mt-4" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <FadeInSection delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/products" className="gold-outline-btn rounded inline-flex items-center gap-2">
                View Full Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>
                Explore By Category
              </p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground">
                Our <span className="gold-text font-semibold">Collections</span>
              </h2>
              <div className="gold-divider max-w-xs mx-auto mt-4" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((cat, i) => (
              <FadeInSection key={cat.id} delay={i * 0.07}>
                <Link href={`/products?category=${cat.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer"
                    style={{ border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    <Image
                      src={categoryImages[i]}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="200px"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)',
                      }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(212,175,55,0.15)' }} />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <p className="font-serif text-sm text-white font-medium">{cat.name}</p>
                      <p className="text-xs text-white/70 mt-0.5">{cat.count} items</p>
                    </div>
                    <div className="absolute top-2 right-2 w-5 h-5 opacity-0 group-hover:opacity-70 transition-opacity duration-300" style={{ borderTop: '1px solid #D4AF37', borderRight: '1px solid #D4AF37' }} />
                  </motion.div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="relative z-10 py-6 overflow-hidden border-y" style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.05)' }}>
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-12 whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 font-sans text-sm tracking-widest uppercase">
              <span style={{ color: '#D4AF37' }}>✦</span>
              <span className="text-muted-foreground">Free Worldwide Shipping</span>
              <span style={{ color: '#D4AF37' }}>✦</span>
              <span className="text-muted-foreground">Authenticity Guaranteed</span>
              <span style={{ color: '#D4AF37' }}>✦</span>
              <span className="text-muted-foreground">Exclusive Members Benefits</span>
            </span>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="font-sans text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>
                Client Stories
              </p>
              <h2 className="font-serif text-5xl md:text-6xl font-light">
                What Our <span className="gold-text font-semibold">Clients Say</span>
              </h2>
              <div className="gold-divider max-w-xs mx-auto mt-4" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeInSection key={t.id} delay={i * 0.12}>
                <div
                  className="relative p-8 rounded-lg art-deco-corner"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <div className="mb-4">
                    <StarRating rating={t.rating} size={14} />
                  </div>
                  <p className="font-serif text-base font-light leading-relaxed text-foreground mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="gold-divider mb-6" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid rgba(212,175,55,0.5)' }}>
                      <Image src={t.avatar} alt={t.name} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.title}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-6 font-serif text-6xl leading-none" style={{ color: 'rgba(212,175,55,0.15)' }}>&ldquo;</div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInSection>
            <div
              className="p-12 rounded-2xl relative overflow-hidden"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 0 60px rgba(212,175,55,0.08)',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37, #FFA500)' }} />
              <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#D4AF37' }}>
                Exclusive Access
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
                Join the <span className="gold-text font-semibold">Inner Circle</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-light max-w-sm mx-auto">
                Receive exclusive invitations, early access to new arrivals, and curated recommendations tailored for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="gold-input flex-1"
                />
                <button className="gold-btn rounded whitespace-nowrap">
                  Join Now
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Join 25,000+ members. Unsubscribe anytime.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
