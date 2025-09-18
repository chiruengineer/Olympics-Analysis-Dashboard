"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface SportData {
  sport: string
  medals: number
  percentage: number
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
]

export function SportDistribution() {
  const [data, setData] = useState<SportData[]>([])

  useEffect(() => {
    // Simulated data - in real app, this would come from CSV processing
    const sportData = [
      { sport: "Athletics", medals: 6234, percentage: 21.3 },
      { sport: "Aquatics", medals: 4567, percentage: 15.6 },
      { sport: "Gymnastics", medals: 2890, percentage: 9.9 },
      { sport: "Wrestling", medals: 2345, percentage: 8.0 },
      { sport: "Boxing", medals: 1987, percentage: 6.8 },
      { sport: "Cycling", medals: 1654, percentage: 5.7 },
      { sport: "Rowing", medals: 1432, percentage: 4.9 },
      { sport: "Weightlifting", medals: 1234, percentage: 4.2 },
      { sport: "Judo", medals: 1098, percentage: 3.8 },
      { sport: "Others", medals: 5775, percentage: 19.8 },
    ]
    setData(sportData)
  }, [])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ sport, percentage }) => `${sport}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="medals"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
