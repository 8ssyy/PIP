import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DiagramaViewer from "@/components/diagrama-viewer"
import HistorialFusible from "@/components/historial-fusible"
import { ChevronLeft } from "lucide-react"
import { fusiblesData } from "@/data/fusibles"
import Navbar from "@/components/navbar"

export default function FusiblePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { highlight?: string }
}) {
  const fusible = fusiblesData.find((f) => f.id === params.id)
  const highlight = searchParams.highlight === "true"

  if (!fusible) {
    notFound()
  }

  // Verificar si la imagen es una URL externa (comienza con http o https)
  const isExternalImage = fusible.imagen.startsWith("http")

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <Link href="/diagramas">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Diagramas
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fusible {fusible.codigo}</CardTitle>
              <CardDescription>{fusible.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative mb-4 bg-slate-100 rounded-md overflow-hidden">
                {fusible.imagen ? (
                  // Usamos img estándar para todas las imágenes para evitar problemas con Next.js Image en Netlify
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fusible.imagen || "/placeholder.svg"}
                    alt={`Imagen del fusible ${fusible.codigo}`}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      // Si la imagen falla al cargar, mostrar un placeholder
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=300"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No hay imagen disponible</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Código:</span>
                  <span>{fusible.codigo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Ubicación:</span>
                  <span>{fusible.ubicacion}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Función:</span>
                  <span>{fusible.funcion}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Tipo:</span>
                  <span>{fusible.tipo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Amperaje:</span>
                  <span>{fusible.amperaje}A</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="diagrama">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="diagrama" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ubicación en Diagrama</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DiagramaViewer highlightedFusibleId={params.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historial" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Inspecciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HistorialFusible fusibleId={params.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  )
}

