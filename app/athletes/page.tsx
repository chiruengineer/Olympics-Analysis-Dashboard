"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopAthletesChart } from "@/components/charts/top-athletes-chart"
import { AthleteProfile } from "@/components/athlete-profile"
import { Users, Search, Medal, Trophy } from "lucide-react"

interface AthleteData {
  athlete: string
  country: string
  totalMedals: number
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
  sports: string[]
  years: number[]
  events: string[]
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<AthleteData[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAthleteData()
  }, [])

  useEffect(() => {
    filterAthletes()
  }, [searchTerm, selectedCountry, selectedSport, athletes])

  const loadAthleteData = async () => {
    try {
      const response = await fetch("/api/athletes")
      const data = await response.json()
      setAthletes(data)
      setFilteredAthletes(data)
    } catch (error) {
      console.error("Error loading athlete data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAthletes = () => {
    let filtered = athletes

    if (searchTerm) {
      filtered = filtered.filter(
        (athlete) =>
          athlete.athlete.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((athlete) => athlete.country === selectedCountry)
    }

    if (selectedSport !== "all") {
      filtered = filtered.filter((athlete) => athlete.sports.includes(selectedSport))
    }

    setFilteredAthletes(filtered)
  }

  const uniqueCountries = [...new Set(athletes.map((a) => a.country))].sort()
  const uniqueSports = [...new Set(athletes.flatMap((a) => a.sports))].sort()

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
          <Users className="h-10 w-10 text-blue-600" />
          Athlete Analysis
        </h1>
        <p className="text-lg text-gray-600">Discover top-performing athletes and their Olympic achievements</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Top Athletes</TabsTrigger>
          <TabsTrigger value="search">Search & Filter</TabsTrigger>
          <TabsTrigger value="profile">Athlete Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 20 Athletes by Medal Count</CardTitle>
                <CardDescription>Most successful Olympic athletes (1976-2008)</CardDescription>
              </CardHeader>
              <CardContent>
                <TopAthletesChart athletes={athletes.slice(0, 20)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Athlete Statistics</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">{athletes.length.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Total Athletes</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-700">{athletes[0]?.totalMedals || 0}</div>
                      <div className="text-sm text-yellow-600">Highest Medal Count</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Top 5 Athletes:</h4>
                    {athletes.slice(0, 5).map((athlete, index) => (
                      <div key={athlete.athlete} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="flex items-center gap-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{athlete.athlete}</span>
                          </span>
                          <div className="text-sm text-gray-600">{athlete.country}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{athlete.totalMedals} medals</div>
                          <div className="text-sm text-gray-600">
                            {athlete.goldMedals}G {athlete.silverMedals}S {athlete.bronzeMedals}B
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Athletes
              </CardTitle>
              <CardDescription>Find specific athletes or filter by country and sport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search athletes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {uniqueSports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Showing {filteredAthletes.length} of {athletes.length} athletes
              </div>

              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredAthletes.slice(0, 50).map((athlete) => (
                  <div
                    key={`${athlete.athlete}-${athlete.country}`}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAthlete(athlete)}
                  >
                    <div>
                      <div className="font-medium">{athlete.athlete}</div>
                      <div className="text-sm text-gray-600">{athlete.country}</div>
                      <div className="flex gap-2 mt-1">
                        {athlete.sports.slice(0, 3).map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                        {athlete.sports.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{athlete.sports.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{athlete.totalMedals} medals</div>
                      <div className="text-sm text-gray-600">
                        {athlete.goldMedals}G {athlete.silverMedals}S {athlete.bronzeMedals}B
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {selectedAthlete ? (
            <AthleteProfile athlete={selectedAthlete} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Medal className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  Select an athlete from the Search & Filter tab to view their detailed profile
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
