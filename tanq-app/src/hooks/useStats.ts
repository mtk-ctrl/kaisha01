'use client'

import { useState, useCallback, useEffect } from 'react'
import { computeStats, type AppStats } from '@/lib/stats'

export function useStats() {
  const [stats, setStats] = useState<AppStats | null>(null)

  const refresh = useCallback(() => {
    setStats(computeStats())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, refresh }
}
