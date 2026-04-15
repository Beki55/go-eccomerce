import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <span className="font-serif text-3xl font-bold gold-text tracking-[0.15em]">LUXE</span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed font-light">
              Curating the world&apos;s finest luxury goods since 1998. We believe that true luxury is not just about objects — it&apos;s about the experience.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-gold"
                  style={{ borderColor: 'rgba(212,175,55,0.3)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#D4AF37' }}>
              Collections
            </h4>
            <ul className="space-y-3">
              {['Bags & Accessories', 'Fine Jewellery', 'Timepieces', 'Fragrance', 'Ready-to-Wear', 'Shoes'].map(item => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors duration-300 font-light">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#D4AF37' }}>
              Services
            </h4>
            <ul className="space-y-3">
              {['Personal Shopping', 'Private Appointments', 'Gift Concierge', 'Authentication', 'Repairs & Care', 'Bespoke Orders'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors duration-300 font-light">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#D4AF37' }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <span className="font-light">12 Rue du Faubourg Saint-Honoré, Paris, France</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={14} className="flex-shrink-0" style={{ color: '#D4AF37' }} />
                <span className="font-light">+33 1 42 68 24 00</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={14} className="flex-shrink-0" style={{ color: '#D4AF37' }} />
                <span className="font-light">hello@luxe.com</span>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-xs font-sans font-semibold tracking-widest uppercase mb-3" style={{ color: '#D4AF37' }}>
                Newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="gold-input flex-1 text-xs"
                  style={{ padding: '8px 12px' }}
                />
                <button className="gold-btn rounded text-xs px-4 py-2 whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="gold-divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-light">
            &copy; {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Authenticity'].map(item => (
              <Link key={item} href="#" className="text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors font-light">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
