export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  badge?: string;
  inStock: boolean;
  tags: string[];
  features: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Maison Noir Leather Tote',
    price: 485,
    originalPrice: 620,
    rating: 4.9,
    reviewCount: 124,
    category: 'Bags',
    subcategory: 'Totes',
    description: 'Crafted from the finest full-grain Italian leather, this structured tote combines timeless elegance with modern functionality. Features hand-stitched gold hardware and a silk-lined interior.',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'Sale',
    inStock: true,
    tags: ['leather', 'luxury', 'italian'],
    features: ['Full-grain Italian leather', 'Gold-plated hardware', 'Silk lining', 'Interior pockets'],
  },
  {
    id: '2',
    name: 'Aurore Silk Evening Gown',
    price: 1290,
    rating: 5.0,
    reviewCount: 89,
    category: 'Clothing',
    subcategory: 'Dresses',
    description: 'An ethereal silk evening gown adorned with delicate gold embroidery. The flowing silhouette drapes elegantly, creating an unforgettable presence at any formal occasion.',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'New',
    inStock: true,
    tags: ['silk', 'evening', 'formal', 'embroidered'],
    features: ['100% pure silk', 'Hand-embroidered gold detailing', 'French seams', 'Dry clean only'],
  },
  {
    id: '3',
    name: 'Lumière Diamond Watch',
    price: 3850,
    rating: 4.8,
    reviewCount: 56,
    category: 'Watches',
    subcategory: 'Luxury',
    description: 'Swiss-made automatic movement encased in 18k gold with a diamond-set bezel. A timepiece that transcends generations and defines the pinnacle of horological artistry.',
    images: [
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'Exclusive',
    inStock: true,
    tags: ['gold', 'diamond', 'swiss', 'automatic'],
    features: ['Swiss automatic movement', '18k gold case', 'Diamond bezel', 'Sapphire crystal'],
  },
  {
    id: '4',
    name: 'Versailles Perfume Elixir',
    price: 285,
    rating: 4.7,
    reviewCount: 203,
    category: 'Fragrance',
    subcategory: 'Perfume',
    description: 'An extraordinary olfactory journey inspired by the gardens of Versailles. Notes of Bulgarian rose, oud, and rare white amber compose this intoxicating masterpiece.',
    images: [
      'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2291073/pexels-photo-2291073.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    inStock: true,
    tags: ['fragrance', 'rose', 'oud', 'amber'],
    features: ['100ml Eau de Parfum', 'Bulgarian rose extract', 'Oud wood', 'Vintage crystal bottle'],
  },
  {
    id: '5',
    name: 'Oberon Cashmere Blazer',
    price: 795,
    originalPrice: 950,
    rating: 4.6,
    reviewCount: 78,
    category: 'Clothing',
    subcategory: 'Jackets',
    description: 'Tailored from the most exquisite Mongolian cashmere, this single-breasted blazer redefines understated luxury. Each piece is hand-finished in our Milan atelier.',
    images: [
      'https://images.pexels.com/photos/1936314/pexels-photo-1936314.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'Sale',
    inStock: true,
    tags: ['cashmere', 'blazer', 'tailored', 'milan'],
    features: ['100% Mongolian cashmere', 'Hand-finished', 'Gold-thread buttonholes', 'Slim fit'],
  },
  {
    id: '6',
    name: 'Soleil Gold Cuff Bracelet',
    price: 620,
    rating: 4.9,
    reviewCount: 145,
    category: 'Jewelry',
    subcategory: 'Bracelets',
    description: 'An architectural cuff inspired by Art Deco motifs, crafted in 18k gold with intricate geometric patterns. A statement piece that commands attention.',
    images: [
      'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'Bestseller',
    inStock: true,
    tags: ['gold', 'jewelry', 'art deco', 'cuff'],
    features: ['18k gold', 'Art Deco design', 'Adjustable fit', 'Comes with certificate'],
  },
  {
    id: '7',
    name: 'Noir Suede Oxford Shoes',
    price: 545,
    rating: 4.7,
    reviewCount: 92,
    category: 'Shoes',
    subcategory: 'Oxfords',
    description: 'Handcrafted in Florence from premium black suede with gold-tone Goodyear welt construction. The epitome of gentlemanly elegance reimagined for the modern era.',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    inStock: true,
    tags: ['suede', 'oxford', 'florence', 'handcrafted'],
    features: ['Goodyear welt', 'Calfskin lining', 'Leather sole', 'Hand-polished'],
  },
  {
    id: '8',
    name: 'Celeste Pearl Necklace',
    price: 1150,
    rating: 5.0,
    reviewCount: 67,
    category: 'Jewelry',
    subcategory: 'Necklaces',
    description: 'South Sea pearls of exceptional luster strung with an 18k gold clasp. Each pearl is hand-selected for its perfect roundness, overtone, and orient.',
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: 'New',
    inStock: true,
    tags: ['pearl', 'necklace', 'south sea', 'gold'],
    features: ['South Sea pearls', '18k gold clasp', 'Hand-strung', 'GIA certified'],
  },
];

export const categories = [
  { id: 'all', name: 'All Items', count: products.length },
  { id: 'bags', name: 'Bags', count: 1 },
  { id: 'clothing', name: 'Clothing', count: 2 },
  { id: 'watches', name: 'Watches', count: 1 },
  { id: 'fragrance', name: 'Fragrance', count: 1 },
  { id: 'jewelry', name: 'Jewelry', count: 2 },
  { id: 'shoes', name: 'Shoes', count: 1 },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sophia Marchetti',
    title: 'Fashion Director, Vogue Italia',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'LUXE has completely transformed my wardrobe. The quality of every piece is beyond exceptional — each item tells its own story of masterful craftsmanship.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Alexander von Richter',
    title: 'Entrepreneur & Collector',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'I have shopped at luxury boutiques worldwide, and LUXE consistently surpasses them all. The curation is impeccable and the service is truly white-glove.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Isabella Laurent',
    title: 'Interior Designer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'The Lumière watch I purchased is an absolute masterpiece. The attention to detail and the packaging experience itself felt like receiving a work of art.',
    rating: 5,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, count)
    .concat(products.filter(p => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}
