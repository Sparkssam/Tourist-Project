"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemTheme: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    // Get initial system theme
    const getSystemTheme = () => (mediaQuery.matches ? "dark" : "light")
    setSystemTheme(getSystemTheme())

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("kekeo-theme") as Theme
    const initialTheme = savedTheme && ["light", "dark", "system"].includes(savedTheme) ? savedTheme : "light"

    setThemeState(initialTheme)
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    const effectiveTheme = theme === "system" ? systemTheme : theme

    // Apply or remove dark class
    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme, systemTheme, mounted])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("kekeo-theme", newTheme)
  }, [])

  const toggleTheme = React.useCallback(() => {
    const themeOrder: Theme[] = ["light", "dark", "system"]
    const currentIndex = themeOrder.indexOf(theme)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    setTheme(nextTheme)
  }, [theme, setTheme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      systemTheme,
    }),
    [theme, setTheme, toggleTheme, systemTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
