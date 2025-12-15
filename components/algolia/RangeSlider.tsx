'use client'

import { useRange } from 'react-instantsearch'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { useRef, useEffect, useState } from 'react'

type RangeSliderProps = {
  attribute: string
  title: string
}

export const RangeSlider = ({ attribute, title }: RangeSliderProps) => {
  const { start, range, refine } = useRange({ attribute })

  const min = range.min ?? 0
  const max = range.max ?? 1000
  const algoliaMin = start[0] !== -Infinity && start[0] !== undefined ? start[0] : min
  const algoliaMax = start[1] !== Infinity && start[1] !== undefined ? start[1] : max

  const [sliderValue, setSliderValue] = useState<[number, number]>([algoliaMin, algoliaMax])
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate unique IDs for accessibility
  const rangeGroupId = `range-group-${attribute}`
  const minInputId = `min-input-${attribute}`
  const maxInputId = `max-input-${attribute}`
  const rangeInfoId = `range-info-${attribute}`

  const handleRangeChange = (values: [number, number]) => {
    setSliderValue(values)

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      refine([values[0], values[1]])
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-3">
      <Typography
        variant="h6"
        className="uppercase tracking-wider text-sidebar-foreground/60 text-sm font-semibold"
        id={`${rangeGroupId}-label`}
      >
        {title}
      </Typography>
      <div role="group" aria-labelledby={`${rangeGroupId}-label`} aria-describedby={rangeInfoId}>
        <div className="flex items-center gap-2">
          <label htmlFor={minInputId} className="sr-only">
            Minimum {title}
          </label>
          <Input
            id={minInputId}
            type="number"
            min={min}
            max={max}
            value={sliderValue[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value === '' ? min : Number(e.target.value)
              const newMin = Math.max(min, Math.min(value, sliderValue[1]))
              handleRangeChange([newMin, sliderValue[1]])
            }}
            className="h-8 w-20 text-sm"
            placeholder="Min"
            aria-valuemin={min}
            aria-valuemax={sliderValue[1]}
            aria-valuenow={sliderValue[0]}
            aria-describedby={rangeInfoId}
          />
          <span className="text-muted-foreground" aria-hidden="true">
            –
          </span>
          <label htmlFor={maxInputId} className="sr-only">
            Maximum {title}
          </label>
          <Input
            id={maxInputId}
            type="number"
            min={min}
            max={max}
            value={sliderValue[1]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value === '' ? max : Number(e.target.value)
              const newMax = Math.min(max, Math.max(value, sliderValue[0]))
              handleRangeChange([sliderValue[0], newMax])
            }}
            className="h-8 w-20 text-sm"
            placeholder="Max"
            aria-valuemin={sliderValue[0]}
            aria-valuemax={max}
            aria-valuenow={sliderValue[1]}
            aria-describedby={rangeInfoId}
          />
        </div>
      </div>
      <Typography
        variant="muted"
        className="text-xs"
        id={rangeInfoId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Range: ${min.toFixed(0)} – ${max.toFixed(0)}. Current selection: ${sliderValue[0].toFixed(0)} – $
        {sliderValue[1].toFixed(0)}
      </Typography>
    </div>
  )
}
