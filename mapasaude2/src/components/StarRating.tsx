import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function StarRating({ rating, reviewCount, size = 13 }: StarRatingProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-[1px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              strokeWidth={1.5}
              fill={filled ? "var(--ms-amber)" : "none"}
              color={filled ? "var(--ms-amber)" : "var(--ms-mist-strong)"}
            />
          );
        })}
      </span>
      <span
        className="text-xs font-mono"
        style={{ color: "var(--ms-ink-soft)" }}
      >
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` · ${reviewCount}`}
      </span>
    </span>
  );
}
