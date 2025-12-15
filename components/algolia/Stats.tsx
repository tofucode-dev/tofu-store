'use client'

import { useStats } from 'react-instantsearch'

export const Stats = () => {
  const { nbHits, processingTimeMS } = useStats()

  return (
    <p className="text-sm text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
      {nbHits.toLocaleString()} results found in {processingTimeMS}ms
    </p>
  )
}
