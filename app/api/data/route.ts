import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), "public/data/Summer-Olympic-medals-1976-to-2008.csv")
    const csvData = fs.readFileSync(csvPath, "utf-8")

    // Parse CSV data
    const lines = csvData.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log(`Processing ${lines.length - 1} records from CSV...`)

    const records = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])
        if (values.length >= headers.length) {
          const record: any = {}
          headers.forEach((header, index) => {
            record[normalizeHeader(header)] = values[index]?.replace(/"/g, "").trim() || ""
          })
          if (record.country && record.athlete && record.medal) {
            records.push(record)
          }
        }
      }
    }

    console.log(`Successfully processed ${records.length} valid records`)

    // Calculate summary statistics
    const totalMedals = records.length
    const uniqueAthletes = new Set(records.map((r) => r.athlete)).size
    const uniqueCountries = new Set(records.map((r) => r.country)).size
    const uniqueSports = new Set(records.map((r) => r.sport)).size
    const years = records.map((r) => Number.parseInt(r.year)).filter((y) => !isNaN(y))
    const yearRange = { start: Math.min(...years), end: Math.max(...years) }

    // Top countries
    const countryMap = new Map()
    records.forEach((record) => {
      const country = record.country
      if (!countryMap.has(country)) {
        countryMap.set(country, { country, totalMedals: 0, goldMedals: 0, silverMedals: 0, bronzeMedals: 0 })
      }
      const countryData = countryMap.get(country)
      countryData.totalMedals++
      if (record.medal === "Gold") countryData.goldMedals++
      else if (record.medal === "Silver") countryData.silverMedals++
      else if (record.medal === "Bronze") countryData.bronzeMedals++
    })

    const topCountries = Array.from(countryMap.values())
      .sort((a, b) => b.totalMedals - a.totalMedals)
      .slice(0, 10)

    // Top athletes
    const athleteMap = new Map()
    records.forEach((record) => {
      const key = `${record.athlete}-${record.country}`
      if (!athleteMap.has(key)) {
        athleteMap.set(key, {
          athlete: record.athlete,
          country: record.country,
          totalMedals: 0,
          sports: new Set(),
          years: new Set(),
        })
      }
      const athleteData = athleteMap.get(key)
      athleteData.totalMedals++
      athleteData.sports.add(record.sport)
      athleteData.years.add(Number.parseInt(record.year))
    })

    const topAthletes = Array.from(athleteMap.values())
      .map((athlete) => ({
        ...athlete,
        sports: Array.from(athlete.sports),
        years: Array.from(athlete.years).sort(),
      }))
      .sort((a, b) => b.totalMedals - a.totalMedals)
      .slice(0, 10)

    // Medals by year
    const yearMap = new Map()
    records.forEach((record) => {
      const year = Number.parseInt(record.year)
      if (!isNaN(year)) {
        yearMap.set(year, (yearMap.get(year) || 0) + 1)
      }
    })

    const medalsByYear = Array.from(yearMap.entries())
      .map(([year, medals]) => ({ year, medals }))
      .sort((a, b) => a.year - b.year)

    const response = {
      summary: {
        totalMedals,
        uniqueAthletes,
        uniqueCountries,
        uniqueSports,
        yearRange,
      },
      topCountries,
      topAthletes,
      medalsByYear,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing Olympics data:", error)
    return NextResponse.json({ error: "Failed to process data" }, { status: 500 })
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function normalizeHeader(header: string): string {
  const mapping: { [key: string]: string } = {
    City: "city",
    Year: "year",
    Sport: "sport",
    Discipline: "discipline",
    Event: "event",
    Athlete: "athlete",
    Gender: "gender",
    Country_Code: "country_code",
    Country: "country",
    Event_gender: "event_gender",
    Medal: "medal",
  }
  return mapping[header] || header.toLowerCase()
}
