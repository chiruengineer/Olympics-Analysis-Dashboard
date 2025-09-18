import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), "public/data/Summer-Olympic-medals-1976-to-2008.csv")

    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found at:", csvPath)
      return NextResponse.json({ error: "CSV file not found" }, { status: 404 })
    }

    const csvData = fs.readFileSync(csvPath, "utf-8")
    console.log("CSV file loaded, size:", csvData.length, "characters")

    // Parse CSV data
    const lines = csvData.split("\n").filter((line) => line.trim())
    console.log("Total lines in CSV:", lines.length)

    if (lines.length === 0) {
      return NextResponse.json({ error: "Empty CSV file" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("CSV Headers:", headers)

    const records = []
    let processedCount = 0
    let skippedCount = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const values = parseCSVLine(line)

        if (values.length >= headers.length) {
          const record: any = {}
          headers.forEach((header, index) => {
            const value = values[index]?.replace(/"/g, "").trim() || ""
            record[normalizeHeader(header)] = value
          })

          // Convert year to number and validate required fields
          const year = Number.parseInt(record.year)
          if (!isNaN(year) && record.country && record.athlete && record.medal && record.sport) {
            record.year = year
            records.push({
              city: record.city || "",
              year: record.year,
              sport: record.sport,
              discipline: record.discipline || "",
              event: record.event || "",
              athlete: record.athlete,
              gender: record.gender || "",
              country: record.country,
              medal: record.medal,
            })
            processedCount++
          } else {
            skippedCount++
          }
        } else {
          skippedCount++
        }
      } catch (error) {
        console.error(`Error parsing line ${i}:`, error)
        skippedCount++
      }
    }

    console.log(`Processed: ${processedCount}, Skipped: ${skippedCount}, Total: ${records.length}`)

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error processing data explorer data:", error)
    return NextResponse.json({ error: "Failed to process data", details: error.message }, { status: 500 })
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
