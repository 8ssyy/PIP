import DiagramaViewer from "@/components/diagrama-viewer"
import QrScanner from "@/components/qr-scanner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"

export default function DiagramasPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Sistema de Distribución Eléctrica</h1>

        <Tabs defaultValue="diagrama" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
            <TabsTrigger value="escanear">Escanear QR</TabsTrigger>
          </TabsList>

          <TabsContent value="diagrama" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Diagrama del Sistema</CardTitle>
                <CardDescription>Visualice el diagrama completo del sistema de distribución eléctrica</CardDescription>
              </CardHeader>
              <CardContent>
                <DiagramaViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escanear" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Escanear Código QR</CardTitle>
                <CardDescription>Escanee el código QR de un fusible para ver su información</CardDescription>
              </CardHeader>
              <CardContent>
                <QrScanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

