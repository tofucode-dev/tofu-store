import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"

type StarRatingProps = {
    rating: number 
}
export const StarRating = ({rating}: StarRatingProps) => {
    return (
      <div 
        className="flex items-center gap-0.5" 
        role="img" 
        aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map(star => (
          <StarIcon
            key={star}
            aria-hidden="true"
            className={cn(
              'h-3 w-3',
              star <= Math.round(rating) ? 'fill-amber-400 stroke-amber-400' : 'fill-muted stroke-muted-foreground/30',
            )}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    )
  }