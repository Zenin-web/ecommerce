import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating = 0, size = 14, showValue = true, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}
