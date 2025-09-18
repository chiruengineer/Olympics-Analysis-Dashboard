"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuickInsights() {
  const insights = [
    {
      title: "Top Performing Country",
      value: "United States",
      description: "Most medals won overall",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Most Successful Athlete",
      value: "Michael Phelps",
      description: "16 medals in the dataset period",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Dominant Sport",
      value: "Athletics",
      description: "Highest number of events",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Gender Participation",
      value: "65% Male, 35% Female",
      description: "Historical participation ratio",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Quick Insights</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${insight.color} text-lg px-3 py-1 mb-2`}>{insight.value}</Badge>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
