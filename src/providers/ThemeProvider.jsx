"use client"
import useThemeContext from '@/context/ThemeContext'
import React, { useEffect, useState } from 'react'

const ThemeProvider = ({children}) => {
  const { theme } = useThemeContext()
  const [mounted, setMounted] = useState(false)
  
  useEffect(()=> {
    setMounted(true)
  }, [])
  if (mounted) {
    return (
        <div className={theme}>{children}</div>
      )
  }
  
}

export default ThemeProvider