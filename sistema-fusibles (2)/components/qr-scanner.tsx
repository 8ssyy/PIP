"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fusiblesData } from "@/data/fusibles"

export default function QrScannerComponent() {
  const [manualCode, setManualCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [html5QrCode, setHtml5QrCode] = useState<any>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Limpiar el escáner cuando el componente se desmonta
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err: any) => console.error(err))
      }
    }
  }, [html5QrCode])

  const processFusibleCode = (code: string) => {
    // Verificar si el código corresponde a un fusible existente
    const fusible = fusiblesData.find((f) => f.codigo === code)

    if (fusible) {
      router.push(`/fusibles/${fusible.id}?highlight=true`)
    } else {
      setError(`No se encontró ningún fusible con el código: ${code}`)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processFusibleCode(manualCode)
  }

  const startScanner = async () => {
    setIsScanning(true)
    setError(null)

    try {
      // Importar dinámicamente la biblioteca html5-qrcode
      const { Html5Qrcode } = await import("html5-qrcode")

      if (!scannerRef.current) return

      const scanner = new Html5Qrcode("qr-reader")
      setHtml5QrCode(scanner)

      const config = { fps: 10, qrbox: { width: 250, height: 250 } }

      await scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          // Éxito en el escaneo
          processFusibleCode(decodedText)
          stopScanner()
        },
        (errorMessage: string) => {
          // Ignoramos errores durante el escaneo, solo mostramos errores de inicio
          console.log(errorMessage)
        },
      )
    } catch (err: any) {
      setError(
        "No se pudo acceder a la cámara. Por favor, utilice la entrada manual o verifique los permisos de la cámara.",
      )
      setIsScanning(false)
      console.error(err)
    }
  }

  const stopScanner = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().catch((err: any) => console.error(err))
    }
    setIsScanning(false)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">Cámara</TabsTrigger>
          <TabsTrigger value="manual">Código Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-slate-100 p-4 h-[300px] flex items-center justify-center">
            <div id="qr-reader" ref={scannerRef} style={{ width: "100%", maxWidth: "500px" }}>
              {!isScanning ? (
                <div className="text-center">
                  <p className="mb-4">Escaneo de código QR</p>
                  <Button onClick={startScanner}>Iniciar Escaneo</Button>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={stopScanner} className="mt-2">
                    Cancelar Escaneo
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Apunte la cámara al código QR del fusible para escanearlo. Si tiene problemas, utilice la entrada manual.
          </p>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <form onSubmit={handleManualSubmit}>
            <div className="space-y-2">
              <Label htmlFor="manualCode">Código del Fusible</Label>
              <Input
                id="manualCode"
                placeholder="Ej: NH-001"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Buscar Fusible
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {error && <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">{error}</div>}
    </div>
  )
}

