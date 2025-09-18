import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), "public/data/Summer-Olympic-medals-1976-to-2008.csv")
    const csvData = fs.readFileSync(csvPath, "utf-8")

    // Parse CSV data
    const lines = csvData.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const records = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])
        if (values.length >= headers.length) {
          const record: any = {}
          headers.forEach((header, index) => {
            record[normalizeHeader(header)] = values[index]?.replace(/"/g, "") || ""
          })
          records.push(record)
        }
      }
    }

    // Process sport data
    const sportMap = new Map()

    records.forEach((record: any) => {
      const sport = record.sport
      if (!sport) return

      if (!sportMap.has(sport)) {
        sportMap.set(sport, {
          sport,
          totalMedals: 0,
          uniqueEvents: new Set(),
          uniqueAthletes: new Set(),
          uniqueCountries: new Set(),
          maleParticipation: 0,
          femaleParticipation: 0,
          years: new Set(),
          countryMedals: new Map(),
        })
      }

      const sportData = sportMap.get(sport)
      sportData.totalMedals++

      if (record.event) sportData.uniqueEvents.add(record.event)
      if (record.athlete) sportData.uniqueAthletes.add(record.athlete)
      if (record.country) {
        sportData.uniqueCountries.add(record.country)
        const currentCount = sportData.countryMedals.get(record.country) || 0
        sportData.countryMedals.set(record.country, currentCount + 1)
      }
      if (record.year) sportData.years.add(Number.parseInt(record.year))

      if (record.gender === "Men") sportData.maleParticipation++
      else if (record.gender === "Women") sportData.femaleParticipation++
    })

    // Convert to array and sort
    const sports = Array.from(sportMap.values())
      .map((sport) => {
        const years = Array.from(sport.years).sort()
        const topCountries = Array.from(sport.countryMedals.entries())
          .map(([country, medals]) => ({ country, medals }))
          .sort((a, b) => b.medals - a.medals)

        return {
          sport: sport.sport,
          totalMedals: sport.totalMedals,
          uniqueEvents: sport.uniqueEvents.size,
          uniqueAthletes: sport.uniqueAthletes.size,
          uniqueCountries: sport.uniqueCountries.size,
          maleParticipation: sport.maleParticipation,
          femaleParticipation: sport.femaleParticipation,
          yearRange: {
            start: years[0] || 1976,
            end: years[years.length - 1] || 2008,
          },
          topCountries,
        }
      })
      .sort((a, b) => b.totalMedals - a.totalMedals)

    return NextResponse.json(sports)
  } catch (error) {
    console.error("Error processing sports data:", error)
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
