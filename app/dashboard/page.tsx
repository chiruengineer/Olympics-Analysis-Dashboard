"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedalsByYear } from "@/components/charts/medals-by-year"
import { TopCountries } from "@/components/charts/top-countries"
import { SportDistribution } from "@/components/charts/sport-distribution"
import { GenderDistribution } from "@/components/charts/gender-distribution"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-lg text-gray-600">Comprehensive overview of Olympic performance from 1976 to 2008</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Medals Over Time</CardTitle>
                <CardDescription>Total medals awarded in each Olympic Games</CardDescription>
              </CardHeader>
              <CardContent>
                <MedalsByYear />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Countries</CardTitle>
                <CardDescription>Countries with the most medals (1976-2008)</CardDescription>
              </CardHeader>
              <CardContent>
                <TopCountries />
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sport Categories</CardTitle>
                <CardDescription>Distribution of medals across different sports</CardDescription>
              </CardHeader>
              <CardContent>
                <SportDistribution />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Participation</CardTitle>
                <CardDescription>Analysis of male vs female participation in Olympic events</CardDescription>
              </CardHeader>
              <CardContent>
                <GenderDistribution />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
