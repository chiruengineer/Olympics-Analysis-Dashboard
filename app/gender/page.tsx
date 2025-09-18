"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GenderOverviewChart } from "@/components/charts/gender-overview-chart"
import { GenderBySportChart } from "@/components/charts/gender-by-sport-chart"
import { GenderTrendsChart } from "@/components/charts/gender-trends-chart"
import { GenderByCountryChart } from "@/components/charts/gender-by-country-chart"
import { Users, TrendingUp, Activity } from 'lucide-react'

interface GenderData {
  overall: {
    maleTotal: number
    femaleTotal: number
    malePercentage: number
    femalePercentage: number
  }
  bySport: Array<{
    sport: string
    maleCount: number
    femaleCount: number
    malePercentage: number
    femalePercentage: number
  }>
  byYear: Array<{
    year: number
    maleCount: number
    femaleCount: number
    malePercentage: number
    femalePercentage: number
  }>
  byCountry: Array<{
    country: string
    maleCount: number
    femaleCount: number
    totalMedals: number
  }>
}

export default function GenderPage() {
  const [genderData, setGenderData] = useState<GenderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGenderData()
  }, [])

  const loadGenderData = async () => {
    try {
      const response = await fetch("/api/gender")
      const data = await response.json()
      setGenderData(data)
    } catch (error) {
      console.error("Error loading gender data:", error)
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

  if (!genderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Failed to load gender data</p>
        </div>
      </div>
    )
  }

  const firstYear = genderData.byYear[0]
  const lastYear = genderData.byYear[genderData.byYear.length - 1]
  const femaleGrowth = lastYear.femalePercentage - firstYear.femalePercentage

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Users className="h-10 w-10 text-blue-600" />
          Gender Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Study gender distribution and participation across Olympic events from 1976 to 2008
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Male Participation</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{genderData.overall.malePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{genderData.overall.maleTotal.toLocaleString()} medals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Female Participation</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{genderData.overall.femalePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{genderData.overall.femaleTotal.toLocaleString()} medals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Female Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">+{femaleGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">From 1976 to 2008</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports with Female Events</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {genderData.bySport.filter((s) => s.femaleCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">of {genderData.bySport.length} total sports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sports">By Sport</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="countries">By Country</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Gender Distribution</CardTitle>
                <CardDescription>Male vs Female participation across all Olympic Games</CardDescription>
              </CardHeader>
              <CardContent>
                <GenderOverviewChart data={genderData.overall} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Important findings about gender participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Historical Context</h4>
                    <p className="text-sm text-blue-700">
                      The Olympics from 1976-2008 show a period of significant growth in female participation,
                      reflecting broader social changes in women's sports.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Progress Made</h4>
                    <p className="text-sm text-green-700">
                      Female participation increased by {femaleGrowth.toFixed(1)} percentage points over this period,
                      showing steady progress toward gender equality in Olympic sports.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Most Gender-Balanced Sports:</h4>
                    {genderData.bySport
                      .filter((s) => s.femaleCount > 0 && s.maleCount > 0)
                      .sort((a, b) => Math.abs(50 - a.femalePercentage) - Math.abs(50 - b.femalePercentage))
                      .slice(0, 5)
                      .map((sport) => (
                        <div key={sport.sport} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{sport.sport}</span>
                          <Badge variant="outline">
                            {sport.femalePercentage.toFixed(1)}% F / {sport.malePercentage.toFixed(1)}% M
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution by Sport</CardTitle>
              <CardDescription>Male vs Female participation across different sports</CardDescription>
            </CardHeader>
            <CardContent>
              <GenderBySportChart data={genderData.bySport} />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Male-Dominated Sports</CardTitle>
                <CardDescription>Sports with highest male participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {genderData.bySport
                    .filter((s) => s.malePercentage > 80)
                    .sort((a, b) => b.malePercentage - a.malePercentage)
                    .slice(0, 10)
                    .map((sport) => (
                      <div key={sport.sport} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span>{sport.sport}</span>
                        <Badge className="bg-blue-100 text-blue-800">{sport.malePercentage.toFixed(1)}% Male</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Female-Dominated Sports</CardTitle>
                <CardDescription>Sports with highest female participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {genderData.bySport
                    .filter((s) => s.femalePercentage > 50)
                    .sort((a, b) => b.femalePercentage - a.femalePercentage)
                    .slice(0, 10)
                    .map((sport) => (
                      <div key={sport.sport} className="flex justify-between items-center p-2 bg-pink-50 rounded">
                        <span>{sport.sport}</span>
                        <Badge className="bg-pink-100 text-pink-800">{sport.femalePercentage.toFixed(1)}% Female</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Participation Trends Over Time</CardTitle>
              <CardDescription>How male and female participation has evolved from 1976 to 2008</CardDescription>
            </CardHeader>
            <CardContent>
              <GenderTrendsChart data={genderData.byYear} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution by Country</CardTitle>
              <CardDescription>Male vs Female medal winners by country</CardDescription>
            </CardHeader>
            <CardContent>
              <GenderByCountryChart data={genderData.byCountry.slice(0, 20)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
