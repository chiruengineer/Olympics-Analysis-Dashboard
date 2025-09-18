"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CountryData {
  country: string
  medals: number
  gold: number
  silver: number
  bronze: number
}

interface TopCountriesProps {
  detailed?: boolean
}

export function TopCountries({ detailed = false }: TopCountriesProps) {
  const [data, setData] = useState<CountryData[]>([])

  useEffect(() => {
    // Simulated data - in real app, this would come from CSV processing
    const countryData = [
      { country: "United States", medals: 2235, gold: 756, silver: 659, bronze: 820 },
      { country: "Soviet Union", medals: 1204, gold: 473, silver: 376, bronze: 355 },
      { country: "Germany", medals: 1015, gold: 364, silver: 350, bronze: 301 },
      { country: "Australia", medals: 789, gold: 263, silver: 261, bronze: 265 },
      { country: "China", medals: 634, gold: 201, silver: 202, bronze: 231 },
      { country: "Italy", medals: 522, gold: 190, silver: 156, bronze: 176 },
      { country: "France", medals: 445, gold: 142, silver: 156, bronze: 147 },
      { country: "United Kingdom", medals: 398, gold: 123, silver: 134, bronze: 141 },
      { country: "Romania", medals: 378, gold: 89, silver: 94, bronze: 195 },
      { country: "Canada", medals: 321, gold: 99, silver: 110, bronze: 112 },
    ]
    setData(detailed ? countryData : countryData.slice(0, 6))
  }, [detailed])

  return (
    <div className={detailed ? "h-96" : "h-80"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={detailed ? "horizontal" : "vertical"}>
          <CartesianGrid strokeDasharray="3 3" />
          {detailed ? (
            <>
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
              <YAxis />
            </>
          )}
          <Tooltip />
          <Bar dataKey="medals" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
