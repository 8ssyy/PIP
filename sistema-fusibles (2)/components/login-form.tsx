"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"

// Lista predefinida de técnicos
const TECNICOS = ["Carlos Rodríguez", "Ana Martínez", "Juan López", "María García", "Pedro Sánchez"]

export default function LoginForm() {
  const [selectedTecnico, setSelectedTecnico] = useState<string>("")
  const [customTecnico, setCustomTecnico] = useState<string>("")
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tecnicoName = isCustom ? customTecnico : selectedTecnico

    if (tecnicoName) {
      login(tecnicoName)
      router.push("/diagramas")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tecnico">Seleccione Técnico</Label>
        {!isCustom ? (
          <Select value={selectedTecnico} onValueChange={setSelectedTecnico}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar técnico" />
            </SelectTrigger>
            <SelectContent>
              {TECNICOS.map((tecnico) => (
                <SelectItem key={tecnico} value={tecnico}>
                  {tecnico}
                </SelectItem>
              ))}
              <SelectItem value="custom">Otro (Ingresar manualmente)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="customTecnico"
            placeholder="Ingrese su nombre"
            value={customTecnico}
            onChange={(e) => setCustomTecnico(e.target.value)}
          />
        )}
      </div>

      {selectedTecnico === "custom" && !isCustom && (
        <Button type="button" variant="outline" onClick={() => setIsCustom(true)} className="w-full">
          Ingresar nombre manualmente
        </Button>
      )}

      {isCustom && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCustom(false)
            setCustomTecnico("")
          }}
          className="w-full"
        >
          Volver a la lista
        </Button>
      )}

      <Button type="submit" className="w-full">
        Iniciar Sesión
      </Button>
    </form>
  )
}

