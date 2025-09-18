"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Countries", href: "/countries" },
  { name: "Athletes", href: "/athletes" },
  { name: "Sports", href: "/sports" },
  { name: "Trends", href: "/trends" },
  { name: "Gender", href: "/gender" },
  { name: "Predictions", href: "/predictions" },
  { name: "Data Explorer", href: "/data-explorer" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Olympics Analysis</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 px-3 py-2 rounded-md",
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
