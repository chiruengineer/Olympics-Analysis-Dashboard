import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Globe, TrendingUp, BarChart3, Medal } from "lucide-react"
import Link from "next/link"
import { StatsOverview } from "@/components/stats-overview"
import { QuickInsights } from "@/components/quick-insights"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Trophy className="mx-auto h-16 w-16 mb-6 text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">Olympics Data Analysis</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore comprehensive analysis of Summer Olympic medals from 1976 to 2008. Discover trends, insights, and
              predictions using advanced data analytics.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Start Analysis
                </Button>
              </Link>
              <Link href="/data-explorer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  Explore Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-12">
        <StatsOverview />
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Analysis Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Country Analysis</CardTitle>
              <CardDescription>Analyze medal distribution by countries and track performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/countries">
                <Button className="w-full">Explore Countries</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Athlete Analysis</CardTitle>
              <CardDescription>
                Discover top-performing athletes and their achievements across different sports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/athletes">
                <Button className="w-full">View Athletes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Medal className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Sports Analysis</CardTitle>
              <CardDescription>Explore different sports, disciplines, and event categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sports">
                <Button className="w-full">Analyze Sports</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Visualize trends and patterns in Olympic performance over the years</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/trends">
                <Button className="w-full">View Trends</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Gender Analysis</CardTitle>
              <CardDescription>Study gender distribution and participation across different events</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/gender">
                <Button className="w-full">Gender Insights</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>ML Predictions</CardTitle>
              <CardDescription>Use machine learning to predict medal outcomes based on various factors</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/predictions">
                <Button className="w-full">Make Predictions</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="container mx-auto px-4 py-12">
        <QuickInsights />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Olympics Data Analysis. Built with Next.js and modern data analytics.</p>
        </div>
      </footer>
    </div>
  )
}
