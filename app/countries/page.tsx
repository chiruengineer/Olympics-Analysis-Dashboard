"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountryMedalChart } from "@/components/charts/country-medal-chart"
import { CountryTrendsChart } from "@/components/charts/country-trends-chart"
import { CountryComparison } from "@/components/charts/country-comparison"
import { Globe, Trophy } from "lucide-react"

interface CountryData {
  country: string
  totalMedals: number
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
  years: number[]
  sports: string[]
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<CountryData[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from CSV
    loadCountryData()
  }, [])

  const loadCountryData = async () => {
    try {
      const response = await fetch("/api/countries")
      const data = await response.json()
      setCountries(data)
      if (data.length > 0) {
        setSelectedCountry(data[0].country)
      }
    } catch (error) {
      console.error("Error loading country data:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCountryData = countries.find((c) => c.country === selectedCountry)

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
          <Globe className="h-10 w-10 text-blue-600" />
          Country Analysis
        </h1>
        <p className="text-lg text-gray-600">Explore Olympic performance by country from 1976 to 2008</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Country</TabsTrigger>
          <TabsTrigger value="comparison">Country Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 15 Countries by Total Medals</CardTitle>
                <CardDescription>Medal distribution across all Olympic Games</CardDescription>
              </CardHeader>
              <CardContent>
                <CountryMedalChart countries={countries.slice(0, 15)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medal Statistics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-700">
                        {countries.reduce((sum, c) => sum + c.goldMedals, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-yellow-600">Total Gold Medals</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">{countries.length}</div>
                      <div className="text-sm text-blue-600">Countries Participated</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Top 5 Countries:</h4>
                    {countries.slice(0, 5).map((country, index) => (
                      <div key={country.country} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {country.country}
                        </span>
                        <span className="font-semibold">{country.totalMedals} medals</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Country for Detailed Analysis</CardTitle>
              <CardDescription>Choose a country to view detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.country} value={country.country}>
                      {country.country} ({country.totalMedals} medals)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCountryData && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCountryData.country} - Medal Breakdown</CardTitle>
                  <CardDescription>Distribution of gold, silver, and bronze medals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-700">{selectedCountryData.goldMedals}</div>
                        <div className="text-sm text-yellow-600">Gold</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-700">{selectedCountryData.silverMedals}</div>
                        <div className="text-sm text-gray-600">Silver</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-700">{selectedCountryData.bronzeMedals}</div>
                        <div className="text-sm text-orange-600">Bronze</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Participation Years:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountryData.years.map((year) => (
                          <Badge key={year} variant="secondary">
                            {year}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Sports Participated:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountryData.sports.slice(0, 10).map((sport) => (
                          <Badge key={sport} variant="outline">
                            {sport}
                          </Badge>
                        ))}
                        {selectedCountryData.sports.length > 10 && (
                          <Badge variant="outline">+{selectedCountryData.sports.length - 10} more</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Medal count progression over Olympic Games</CardDescription>
                </CardHeader>
                <CardContent>
                  <CountryTrendsChart country={selectedCountryData.country} />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Country Comparison</CardTitle>
              <CardDescription>Compare performance between multiple countries</CardDescription>
            </CardHeader>
            <CardContent>
              <CountryComparison countries={countries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
