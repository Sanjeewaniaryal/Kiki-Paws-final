'use client'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}: StarRatingProps) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.round(value)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${SIZE[size]} transition-transform ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
            aria-label={`${i + 1} star`}
          >
            <span className={filled ? 'text-amber-500' : 'text-gray-300'}>★</span>
          </button>
        )
      })}
    </span>
  )
}
