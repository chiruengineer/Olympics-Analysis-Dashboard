"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Calendar, Flag } from "lucide-react"

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

interface AthleteProfileProps {
  athlete: AthleteData
}

export function AthleteProfile({ athlete }: AthleteProfileProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            {athlete.athlete}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            {athlete.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{athlete.totalMedals}</div>
                <div className="text-xs text-yellow-600">Total</div>
              </div>
              <div className="text-center p-3 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">{athlete.goldMedals}</div>
                <div className="text-xs text-yellow-700">Gold</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-gray-700">{athlete.silverMedals}</div>
                <div className="text-xs text-gray-600">Silver</div>
              </div>
              <div className="text-center p-3 bg-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{athlete.bronzeMedals}</div>
                <div className="text-xs text-orange-600">Bronze</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Olympic Years:
              </h4>
              <div className="flex flex-wrap gap-2">
                {athlete.years.map((year) => (
                  <Badge key={year} variant="secondary">
                    {year}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Medal className="h-4 w-4" />
                Sports:
              </h4>
              <div className="flex flex-wrap gap-2">
                {athlete.sports.map((sport) => (
                  <Badge key={sport} variant="outline">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events Participated</CardTitle>
          <CardDescription>Specific events where medals were won</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {athlete.events.slice(0, 20).map((event, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                {event}
              </div>
            ))}
            {athlete.events.length > 20 && (
              <div className="text-sm text-gray-600 text-center py-2">
                ... and {athlete.events.length - 20} more events
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
