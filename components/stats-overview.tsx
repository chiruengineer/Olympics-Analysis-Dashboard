"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Globe, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  totalMedals: number
  uniqueAthletes: number
  uniqueCountries: number
  uniqueSports: number
  yearRange: { start: number; end: number }
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalMedals: 0,
    uniqueAthletes: 0,
    uniqueCountries: 0,
    uniqueSports: 0,
    yearRange: { start: 1976, end: 2008 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/data")
        const data = await response.json()
        setStats(data.summary)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Medals</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMedals.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Awarded from {stats.yearRange.start}-{stats.yearRange.end}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Athletes</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueAthletes.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Unique medal winners</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Countries</CardTitle>
          <Globe className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueCountries}</div>
          <p className="text-xs text-muted-foreground">Participating nations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sports</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueSports}</div>
          <p className="text-xs text-muted-foreground">Different sports categories</p>
        </CardContent>
      </Card>
    </div>
  )
}
