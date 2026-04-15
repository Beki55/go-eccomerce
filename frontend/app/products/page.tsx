'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search, Grid3x3 as Grid3X3, LayoutList } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import GoldBackground from '@/components/ui/GoldBackground';
import { products, categories } from '@/lib/products';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const priceRanges = [
  { label: 'Under $300', min: 0, max: 300 },
  { label: '$300 – $800', min: 300, max: 800 },
  { label: '$800 – $1,500', min: 800, max: 1500 },
  { label: 'Over $1,500', min: 1500, max: Infinity },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeFilters: string[] = [];
  if (selectedCategory !== 'all') {
    activeFilters.push(categories.find(c => c.id === selectedCategory)?.name || selectedCategory);
  }
  selectedPriceRanges.forEach(idx => activeFilters.push(priceRanges[idx].label));

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory);
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter(p =>
        selectedPriceRanges.some(idx => {
          const range = priceRanges[idx];
          return p.price >= range.min && p.price < range.max;
        })
      );
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [selectedCategory, selectedPriceRanges, sortBy, searchQuery]);

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRanges([]);
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen pt-20">
      <GoldBackground />

      {/* Page Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <p className="font-sans text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>
          Curated For You
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-4">
          The <span className="gold-text font-semibold">Collection</span>
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-4 mb-6" />
        <p className="text-muted-foreground text-sm max-w-md mx-auto font-light leading-relaxed">
          Each piece has been hand-selected by our curators for its exceptional quality, provenance, and enduring beauty.
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded border text-sm font-sans font-medium transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              style={{ borderColor: 'rgba(212,175,55,0.3)' }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', color: '#000' }}>
                  {activeFilters.length}
                </span>
              )}
            </button>

            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="gold-input pl-9 text-sm"
                style={{ padding: '8px 12px 8px 32px' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-light">
              {filteredProducts.length} items
            </span>

            <div className="flex items-center gap-1 border rounded p-1" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-[#D4AF37]'}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-[#D4AF37]'}`}
              >
                <LayoutList size={14} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded border text-sm font-sans transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                style={{ borderColor: 'rgba(212,175,55,0.3)' }}
              >
                {sortOptions.find(s => s.value === sortBy)?.label}
                <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden shadow-xl z-50 min-w-[180px]"
                    style={{ background: 'hsl(var(--card))', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(212,175,55,0.1)] ${sortBy === opt.value ? 'text-[#D4AF37]' : 'text-foreground'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active:</span>
            {activeFilters.map(f => (
              <span
                key={f}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                {f}
                <button
                  onClick={clearAllFilters}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {filterOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 240 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="hidden md:block flex-shrink-0 overflow-hidden"
              >
                <div className="w-60">
                  <div className="mb-8">
                    <h3 className="font-sans text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#D4AF37' }}>
                      Category
                    </h3>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded text-sm transition-all duration-200 ${
                            selectedCategory === cat.id
                              ? 'text-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                              : 'text-foreground hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.05)]'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs text-muted-foreground">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="gold-divider mb-8" />

                  <div>
                    <h3 className="font-sans text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#D4AF37' }}>
                      Price Range
                    </h3>
                    <div className="space-y-2">
                      {priceRanges.map((range, idx) => (
                        <label
                          key={range.label}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${
                              selectedPriceRanges.includes(idx)
                                ? 'border-[#D4AF37]'
                                : 'border-muted-foreground group-hover:border-[#D4AF37]'
                            }`}
                            style={{
                              background: selectedPriceRanges.includes(idx)
                                ? 'linear-gradient(135deg, #FFD700, #D4AF37)'
                                : 'transparent'
                            }}
                            onClick={() => togglePriceRange(idx)}
                          >
                            {selectedPriceRanges.includes(idx) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            )}
                          </div>
                          <span
                            className="text-sm transition-colors group-hover:text-[#D4AF37]"
                            onClick={() => togglePriceRange(idx)}
                          >
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="font-serif text-5xl mb-4" style={{ color: 'rgba(212,175,55,0.3)' }}>✦</div>
                <h3 className="font-serif text-2xl mb-2">No items found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearAllFilters} className="gold-btn rounded">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
