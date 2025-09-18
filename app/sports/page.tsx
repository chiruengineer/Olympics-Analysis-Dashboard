"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SportDistributionChart } from "@/components/charts/sport-distribution-chart"
import { SportGenderChart } from "@/components/charts/sport-gender-chart"
import { SportTrendsChart } from "@/components/charts/sport-trends-chart"
import { Medal, Activity, TrendingUp } from "lucide-react"

interface SportData {
  sport: string
  totalMedals: number
  uniqueEvents: number
  uniqueAthletes: number
  uniqueCountries: number
  maleParticipation: number
  femaleParticipation: number
  yearRange: { start: number; end: number }
  topCountries: { country: string; medals: number }[]
}

export default function SportsPage() {
  const [sports, setSports] = useState<SportData[]>([])
  const [selectedSport, setSelectedSport] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSportData()
  }, [])

  const loadSportData = async () => {
    try {
      const response = await fetch("/api/sports")
      const data = await response.json()
      setSports(data)
      if (data.length > 0) {
        setSelectedSport(data[0].sport)
      }
    } catch (error) {
      console.error("Error loading sport data:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedSportData = sports.find((s) => s.sport === selectedSport)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="h-10 w-10 text-blue-600" />
          Sports Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Explore different sports, disciplines, and event categories in Olympic Games
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Sport Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Sport</TabsTrigger>
          <TabsTrigger value="trends">Sport Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Medal Distribution by Sport</CardTitle>
                <CardDescription>Total medals awarded across different sports</CardDescription>
              </CardHeader>
              <CardContent>
                <SportDistributionChart sports={sports} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sport Statistics</CardTitle>
                <CardDescription>Key metrics across all sports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">{sports.length}</div>
                      <div className="text-sm text-blue-600">Total Sports</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Medal className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">
                        {sports.reduce((sum, s) => sum + s.uniqueEvents, 0)}
                      </div>
                      <div className="text-sm text-green-600">Total Events</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Top 5 Sports by Medal Count:</h4>
                    {sports.slice(0, 5).map((sport, index) => (
                      <div key={sport.sport} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {sport.sport}
                        </span>
                        <span className="font-semibold">{sport.totalMedals} medals</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gender Participation by Sport</CardTitle>
              <CardDescription>Male vs Female participation across different sports</CardDescription>
            </CardHeader>
            <CardContent>
              <SportGenderChart sports={sports.slice(0, 15)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Sport for Detailed Analysis</CardTitle>
              <CardDescription>Choose a sport to view detailed statistics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport.sport} value={sport.sport}>
                      {sport.sport} ({sport.totalMedals} medals)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedSportData && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSportData.sport} - Overview</CardTitle>
                  <CardDescription>Comprehensive statistics for this sport</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-700">{selectedSportData.totalMedals}</div>
                        <div className="text-sm text-blue-600">Total Medals</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-700">{selectedSportData.uniqueEvents}</div>
                        <div className="text-sm text-green-600">Unique Events</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-700">{selectedSportData.uniqueAthletes}</div>
                        <div className="text-sm text-purple-600">Athletes</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-700">{selectedSportData.uniqueCountries}</div>
                        <div className="text-sm text-orange-600">Countries</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Gender Distribution:</h4>
                      <div className="flex gap-4">
                        <div className="flex-1 bg-blue-50 p-3 rounded">
                          <div className="text-lg font-bold text-blue-700">
                            {((selectedSportData.maleParticipation / selectedSportData.totalMedals) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-blue-600">Male ({selectedSportData.maleParticipation})</div>
                        </div>
                        <div className="flex-1 bg-pink-50 p-3 rounded">
                          <div className="text-lg font-bold text-pink-700">
                            {((selectedSportData.femaleParticipation / selectedSportData.totalMedals) * 100).toFixed(1)}
                            %
                          </div>
                          <div className="text-sm text-pink-600">Female ({selectedSportData.femaleParticipation})</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Active Years:</h4>
                      <Badge variant="secondary">
                        {selectedSportData.yearRange.start} - {selectedSportData.yearRange.end}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Countries in {selectedSportData.sport}</CardTitle>
                  <CardDescription>Countries with most medals in this sport</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedSportData.topCountries.slice(0, 10).map((country, index) => (
                      <div key={country.country} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {country.country}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{country.medals} medals</div>
                          <div className="text-sm text-gray-600">
                            {((country.medals / selectedSportData.totalMedals) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sport Popularity Trends
              </CardTitle>
              <CardDescription>How different sports have evolved over the Olympic Games</CardDescription>
            </CardHeader>
            <CardContent>
              <SportTrendsChart sports={sports.slice(0, 10)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
