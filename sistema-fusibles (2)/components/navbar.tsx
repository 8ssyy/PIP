"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { LogOut, User } from "lucide-react"

export default function Navbar() {
  const { isLoggedIn, currentTecnico, logout } = useAuth()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          Sistema de Fusibles NH
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/diagramas">
            <Button variant="ghost">Diagramas</Button>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-slate-100">
                <User className="h-4 w-4" />
                <span>{currentTecnico}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

