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

    // Process trend data by year
    const yearMap = new Map()

    records.forEach((record: any) => {
      const year = Number.parseInt(record.year)
      if (!year) return

      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year,
          totalMedals: 0,
          uniqueCountries: new Set(),
          uniqueAthletes: new Set(),
          uniqueSports: new Set(),
          maleParticipation: 0,
          femaleParticipation: 0,
        })
      }

      const yearData = yearMap.get(year)
      yearData.totalMedals++

      if (record.country) yearData.uniqueCountries.add(record.country)
      if (record.athlete) yearData.uniqueAthletes.add(record.athlete)
      if (record.sport) yearData.uniqueSports.add(record.sport)

      if (record.gender === "Men") yearData.maleParticipation++
      else if (record.gender === "Women") yearData.femaleParticipation++
    })

    // Convert to array and sort by year
    const trends = Array.from(yearMap.values())
      .map((year) => ({
        year: year.year,
        totalMedals: year.totalMedals,
        uniqueCountries: year.uniqueCountries.size,
        uniqueAthletes: year.uniqueAthletes.size,
        uniqueSports: year.uniqueSports.size,
        maleParticipation: year.maleParticipation,
        femaleParticipation: year.femaleParticipation,
      }))
      .sort((a, b) => a.year - b.year)

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error processing trends data:", error)
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
