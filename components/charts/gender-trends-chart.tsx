"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface YearGenderData {
  year: number
  maleCount: number
  femaleCount: number
  malePercentage: number
  femalePercentage: number
}

interface GenderTrendsChartProps {
  data: YearGenderData[]
}

export function GenderTrendsChart({ data }: GenderTrendsChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const isMale = entry.dataKey === "malePercentage"
            const genderLabel = isMale ? "Male" : "Female"
            const count = isMale ? entry.payload.maleCount : entry.payload.femaleCount
            return (
              <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
                <span>{genderLabel}:</span>
                <span>
                  {entry.value.toFixed(1)}% ({count.toLocaleString()} medals)
                </span>
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex !== undefined) {
              // Force tooltip visibility
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#666", strokeWidth: 1, strokeDasharray: "3 3" }}
            isAnimationActive={false}
            position={{ x: undefined, y: undefined }}
            allowEscapeViewBox={{ x: false, y: false }}
            wrapperStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          />
          <Legend
            formatter={(value, entry) => {
              const color = entry.color
              return <span style={{ color }}>{value === "malePercentage" ? "Male %" : "Female %"}</span>
            }}
          />
          <Line
            type="monotone"
            dataKey="malePercentage"
            stroke="#2563eb"
            strokeWidth={3}
            name="malePercentage"
            dot={{ r: 5, fill: "#2563eb", strokeWidth: 2 }}
            activeDot={{ r: 8, fill: "#2563eb", strokeWidth: 3, stroke: "#fff" }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="femalePercentage"
            stroke="#ec4899"
            strokeWidth={3}
            name="femalePercentage"
            dot={{ r: 5, fill: "#ec4899", strokeWidth: 2 }}
            activeDot={{ r: 8, fill: "#ec4899", strokeWidth: 3, stroke: "#fff" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
