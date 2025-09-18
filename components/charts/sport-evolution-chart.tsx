"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"

export function SportEvolutionChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Simulate sport evolution data
    const years = [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008]
    const sports = ["Athletics", "Aquatics", "Gymnastics", "Wrestling", "Boxing"]

    const evolutionData = years.map((year) => {
      const yearData: any = { year }
      sports.forEach((sport) => {
        // Simulate different growth patterns for different sports
        let baseValue = 100
        if (sport === "Athletics") baseValue = 150 + (year - 1976) * 2
        else if (sport === "Aquatics") baseValue = 120 + (year - 1976) * 1.5
        else if (sport === "Gymnastics") baseValue = 80 + (year - 1976) * 1
        else if (sport === "Wrestling") baseValue = 90 - (year - 1976) * 0.5
        else baseValue = 70 + (year - 1976) * 0.8

        yearData[sport] = Math.max(0, baseValue + Math.random() * 20 - 10)
      })
      return yearData
    })

    setData(evolutionData)
  }, [])

  const COLORS = ["#2563eb", "#f59e0b", "#dc2626", "#10b981", "#7c3aed"]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {["Athletics", "Aquatics", "Gymnastics", "Wrestling", "Boxing"].map((sport, index) => (
            <Line key={sport} type="monotone" dataKey={sport} stroke={COLORS[index]} strokeWidth={2} dot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
