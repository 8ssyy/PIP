"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type HistorialEntry = {
  id: string
  fecha: string
  tecnico: string
  notas: string
  tipo: "inspeccion" | "reemplazo"
}

export default function HistorialFusible({ fusibleId }: { fusibleId: string }) {
  const [historial, setHistorial] = useState<HistorialEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nuevaEntrada, setNuevaEntrada] = useState({
    fecha: new Date().toISOString().split("T")[0],
    notas: "",
    tipo: "inspeccion" as const,
  })
  const { isLoggedIn, currentTecnico } = useAuth()

  // Cargar historial del localStorage
  useEffect(() => {
    const storedHistorial = localStorage.getItem(`historial-${fusibleId}`)
    if (storedHistorial) {
      setHistorial(JSON.parse(storedHistorial))
    }
  }, [fusibleId])

  const guardarHistorial = (nuevoHistorial: HistorialEntry[]) => {
    localStorage.setItem(`historial-${fusibleId}`, JSON.stringify(nuevoHistorial))
    setHistorial(nuevoHistorial)
  }

  const agregarEntrada = () => {
    if (!currentTecnico) return

    const nuevaEntradaCompleta: HistorialEntry = {
      id: Date.now().toString(),
      fecha: nuevaEntrada.fecha,
      tecnico: currentTecnico,
      notas: nuevaEntrada.notas,
      tipo: nuevaEntrada.tipo,
    }

    const nuevoHistorial = [...historial, nuevaEntradaCompleta]
    guardarHistorial(nuevoHistorial)

    // Resetear formulario
    setNuevaEntrada({
      fecha: new Date().toISOString().split("T")[0],
      notas: "",
      tipo: "inspeccion",
    })

    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {historial.length > 0 ? (
        <div className="space-y-4">
          {historial.map((entrada) => (
            <div key={entrada.id} className="p-3 border rounded-md bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{new Date(entrada.fecha).toLocaleDateString("es-ES")}</span>
                  <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-slate-200">
                    {entrada.tipo === "inspeccion" ? "Inspección" : "Reemplazo"}
                  </span>
                </div>
                <span className="text-sm text-slate-500">{entrada.tecnico}</span>
              </div>
              <p className="text-sm">{entrada.notas}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">No hay registros de inspección o reemplazo</div>
      )}

      {isLoggedIn ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Registro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Registro</DialogTitle>
              <DialogDescription>
                Agregue un nuevo registro de inspección o reemplazo para este fusible.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={nuevaEntrada.fecha}
                  onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, fecha: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Registro</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tipo"
                      checked={nuevaEntrada.tipo === "inspeccion"}
                      onChange={() => setNuevaEntrada({ ...nuevaEntrada, tipo: "inspeccion" })}
                    />
                    <span>Inspección</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tipo"
                      checked={nuevaEntrada.tipo === "reemplazo"}
                      onChange={() => setNuevaEntrada({ ...nuevaEntrada, tipo: "reemplazo" })}
                    />
                    <span>Reemplazo</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  placeholder="Ingrese detalles sobre la inspección o reemplazo"
                  value={nuevaEntrada.notas}
                  onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, notas: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={agregarEntrada}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-sm text-slate-500 mb-2">Inicie sesión para agregar registros de inspección o reemplazo</p>
          <Link href="/">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

