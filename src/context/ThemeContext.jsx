"use client"
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext()

const getFromLocalStorage = () => {
  if (typeof window !== "undefined"){
    const value = localStorage.getItem("theme")
    return value || "light"
  }
}
export const ThemeContextProvider = ({children}) => {
  const [theme, setTheme] = useState(() => {
    return getFromLocalStorage()
  })
  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])
  const value = {
    theme,
    setTheme,
    toggle
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const useThemeContext = () => {
  const context = useContext(ThemeContext)
  return context;
}

export default useThemeContext;