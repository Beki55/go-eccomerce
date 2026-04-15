import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  max = 5,
  size = 14,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0"
              style={{ color: '#D4AF37', opacity: 0.25 }}
              fill="#D4AF37"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: filled ? '100%' : partial ? `${(rating % 1) * 100}%` : '0%' }}
            >
              <Star size={size} style={{ color: '#D4AF37' }} fill="#D4AF37" />
            </div>
          </div>
        );
      })}
      {showValue && (
        <span className="text-xs font-medium ml-1" style={{ color: '#D4AF37' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
