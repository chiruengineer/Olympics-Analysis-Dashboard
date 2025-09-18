"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MedalTrendsChart } from "@/components/charts/medal-trends-chart"
import { CountryEvolutionChart } from "@/components/charts/country-evolution-chart"
import { ParticipationGrowthChart } from "@/components/charts/participation-growth-chart"
import { SportEvolutionChart } from "@/components/charts/sport-evolution-chart"
import { TrendingUp, BarChart3, Globe, Activity } from "lucide-react"

interface TrendData {
  year: number
  totalMedals: number
  uniqueCountries: number
  uniqueAthletes: number
  uniqueSports: number
  maleParticipation: number
  femaleParticipation: number
}

export default function TrendsPage() {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [selectedMetric, setSelectedMetric] = useState("totalMedals")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrendData()
  }, [])

  const loadTrendData = async () => {
    try {
      const response = await fetch("/api/trends")
      const data = await response.json()
      setTrendData(data)
    } catch (error) {
      console.error("Error loading trend data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const firstYear = trendData[0]
  const lastYear = trendData[trendData.length - 1]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-blue-600" />
          Trend Analysis
        </h1>
        <p className="text-lg text-gray-600">Visualize trends and patterns in Olympic performance from 1976 to 2008</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medal Growth</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastYear && firstYear
                ? `+${(((lastYear.totalMedals - firstYear.totalMedals) / firstYear.totalMedals) * 100).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">From 1976 to 2008</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Country Growth</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastYear && firstYear
                ? `+${(((lastYear.uniqueCountries - firstYear.uniqueCountries) / firstYear.uniqueCountries) * 100).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Participating nations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Athlete Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastYear && firstYear
                ? `+${(((lastYear.uniqueAthletes - firstYear.uniqueAthletes) / firstYear.uniqueAthletes) * 100).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Medal winners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Female Participation</CardTitle>
            <Activity className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastYear && firstYear
                ? `+${((lastYear.femaleParticipation / lastYear.totalMedals) * 100 - (firstYear.femaleParticipation / firstYear.totalMedals) * 100).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Percentage point increase</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="countries">Country Evolution</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="sports">Sport Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Olympic Games Growth Trends</CardTitle>
              <CardDescription>Select a metric to visualize how the Olympics have evolved over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select metric to display" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totalMedals">Total Medals Awarded</SelectItem>
                    <SelectItem value="uniqueCountries">Number of Countries</SelectItem>
                    <SelectItem value="uniqueAthletes">Number of Athletes</SelectItem>
                    <SelectItem value="uniqueSports">Number of Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <MedalTrendsChart data={trendData} metric={selectedMetric} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Country Performance Evolution</CardTitle>
              <CardDescription>How top countries' performance has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <CountryEvolutionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participation Growth Analysis</CardTitle>
              <CardDescription>Growth in athlete participation and gender representation</CardDescription>
            </CardHeader>
            <CardContent>
              <ParticipationGrowthChart data={trendData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sport Evolution Over Time</CardTitle>
              <CardDescription>How different sports have grown or declined in popularity</CardDescription>
            </CardHeader>
            <CardContent>
              <SportEvolutionChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
