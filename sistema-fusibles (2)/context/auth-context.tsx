"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  currentTecnico: string | null
  login: (tecnico: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [currentTecnico, setCurrentTecnico] = useState<string | null>(null)

  // Cargar estado de autenticación del localStorage al iniciar
  useEffect(() => {
    const storedTecnico = localStorage.getItem("currentTecnico")
    if (storedTecnico) {
      setCurrentTecnico(storedTecnico)
      setIsLoggedIn(true)
    }
  }, [])

  const login = (tecnico: string) => {
    localStorage.setItem("currentTecnico", tecnico)
    setCurrentTecnico(tecnico)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem("currentTecnico")
    setCurrentTecnico(null)
    setIsLoggedIn(false)
  }

  return <AuthContext.Provider value={{ isLoggedIn, currentTecnico, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

