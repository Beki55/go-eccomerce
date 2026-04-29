import Link from 'next/link';
import GoldBackground from '@/components/ui/GoldBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 relative">
      <GoldBackground />
      <h2 className="text-4xl font-serif text-[#D4AF37] mb-4">Not Found</h2>
      <p className="text-muted-foreground mb-8">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors rounded"
      >
        Return Home
      </Link>
    </div>
  );
}
