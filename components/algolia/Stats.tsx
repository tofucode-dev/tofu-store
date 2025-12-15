'use client'

import { useStats } from 'react-instantsearch'

export const Stats = () => {
  const { nbHits, processingTimeMS } = useStats()

  return (
    <p className="text-sm text-muted-foreground">
      {nbHits.toLocaleString()} results found in {processingTimeMS}ms
    </p>
  )
}

