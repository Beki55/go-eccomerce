'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBag, Sun, Moon, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Collection' },
  { href: '/account', label: 'Account' },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'backdrop-blur-xl border-b'
          : 'bg-transparent'
          }`}
        style={{
          backgroundColor: scrolled
            ? isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.92)'
            : 'transparent',
          borderColor: scrolled ? 'rgba(212,175,55,0.2)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            <Link href="/" className="group flex items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <span
                  className="font-serif text-3xl font-bold tracking-[0.15em] gold-text"
                  style={{ letterSpacing: '0.15em' }}
                >
                  BkShop
                </span>
                <div
                  className="absolute -bottom-1 left-0 right-0 h-px opacity-60"
                  style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37, transparent)' }}
                />
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-sans text-sm tracking-widest uppercase transition-colors duration-300 group ${pathname === link.href
                    ? 'text-[#D4AF37]'
                    : 'text-foreground hover:text-[#D4AF37]'
                    }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    style={{ background: 'linear-gradient(90deg, #FFD700, #D4AF37)' }}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)]"
                aria-label="Search"
              >
                <Search size={18} className="text-[#D4AF37]" />
              </button>

              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)]"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun size={18} className="text-[#D4AF37]" />
                  ) : (
                    <Moon size={18} className="text-[#D4AF37]" />
                  )}
                </button>
              )}

              <Link href={user ? "/account" : "/auth"} className="p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)] hidden sm:block">
                <User size={18} className="text-[#D4AF37]" />
              </Link>

              {user && (
                <button
                  onClick={logout}
                  className="p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)] hidden sm:block"
                  aria-label="Logout"
                >
                  <LogOut size={18} className="text-red-500" />
                </button>
              )}

              <Link href="/cart" className="relative p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)]">
                <ShoppingBag size={18} className="text-[#D4AF37]" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', color: '#000' }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-[rgba(212,175,55,0.1)]"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X size={18} className="text-[#D4AF37]" />
                ) : (
                  <Menu size={18} className="text-[#D4AF37]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t px-4 py-3"
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: 'rgba(212,175,55,0.2)',
              }}
            >
              <div className="max-w-7xl mx-auto">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for luxury items..."
                  className="gold-input"
                  onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col pt-20 px-6"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.98)' : 'rgba(255,255,255,0.98)',
            }}
          >
            <div className="gold-divider mb-8" />
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-serif text-3xl font-light tracking-wider transition-colors ${pathname === link.href ? 'gold-text' : 'text-foreground hover:text-[#D4AF37]'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="gold-divider mt-8 mb-8" />
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="gold-outline-btn rounded-full flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
