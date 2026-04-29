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
  brand?: string;
  slug?: string;
}

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
