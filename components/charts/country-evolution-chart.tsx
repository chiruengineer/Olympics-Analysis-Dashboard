"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"

export function CountryEvolutionChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Load country evolution data
    loadCountryEvolution()
  }, [])

  const loadCountryEvolution = async () => {
    try {
      const response = await fetch("/api/country-evolution")
      const evolutionData = await response.json()
      setData(evolutionData)
    } catch (error) {
      console.error("Error loading country evolution:", error)
      // Fallback data
      const years = [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008]
      const countries = ["United States", "Soviet Union", "Germany", "Australia", "China"]

      const fallbackData = years.map((year) => {
        const yearData: any = { year }
        countries.forEach((country) => {
          yearData[country] = Math.floor(Math.random() * 100) + 50
        })
        return yearData
      })
      setData(fallbackData)
    }
  }

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
          {["United States", "Soviet Union", "Germany", "Australia", "China"].map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              stroke={COLORS[index]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
