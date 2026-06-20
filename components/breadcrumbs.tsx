"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter((path) => path)

  if (paths.length === 0) return null

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    ...paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return { href, label }
    }),
  ]

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 md:px-6 lg:px-8">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground max-w-7xl mx-auto">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRightIcon />}
            {index === breadcrumbItems.length - 1 ? (
              <span className="ml-2 text-foreground font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="ml-2 hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
