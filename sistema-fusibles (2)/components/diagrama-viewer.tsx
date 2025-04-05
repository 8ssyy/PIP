"use client"

import { useState, useRef, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { fusiblesData } from "@/data/fusibles"

export default function DiagramaViewer({
  highlightedFusibleId = null,
}: {
  highlightedFusibleId?: string | null
}) {
  const router = useRouter()
  const [currentDiagrama, setCurrentDiagrama] = useState("principal")
  const svgRef = useRef<SVGSVGElement>(null)

  // Efecto para resaltar el fusible seleccionado
  useEffect(() => {
    if (highlightedFusibleId && svgRef.current) {
      const fusibleElement = svgRef.current.getElementById(`fusible-${highlightedFusibleId}`)
      if (fusibleElement) {
        fusibleElement.classList.add("highlight-fusible")
        // Scroll to the element
        fusibleElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [highlightedFusibleId, currentDiagrama])

  const handleFusibleClick = (fusibleId: string) => {
    router.push(`/fusibles/${fusibleId}`)
  }

  return (
    <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-white">
      <TransformWrapper initialScale={1} minScale={0.5} maxScale={3} centerOnInit>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 left-2 z-10 flex gap-2 bg-white/80 p-2 rounded-md">
              <Button variant="outline" size="icon" onClick={() => zoomIn()}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => zoomOut()}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => resetTransform()}>
                <Home className="h-4 w-4" />
              </Button>
            </div>

            <TransformComponent wrapperClass="w-full h-full">
              <svg ref={svgRef} width="1000" height="800" viewBox="0 0 1000 800" className="w-full h-full">
                {/* Ejemplo de diagrama eléctrico simplificado */}
                {/* Línea principal */}
                <line x1="100" y1="100" x2="900" y2="100" stroke="black" strokeWidth="4" />

                {/* Ramificaciones */}
                <line x1="300" y1="100" x2="300" y2="300" stroke="black" strokeWidth="3" />
                <line x1="500" y1="100" x2="500" y2="300" stroke="black" strokeWidth="3" />
                <line x1="700" y1="100" x2="700" y2="300" stroke="black" strokeWidth="3" />

                {/* Fusibles (ejemplos) */}
                {fusiblesData.map((fusible) => (
                  <g
                    key={fusible.id}
                    id={`fusible-${fusible.id}`}
                    onClick={() => handleFusibleClick(fusible.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <rect
                      x={fusible.posX - 15}
                      y={fusible.posY - 15}
                      width="30"
                      height="30"
                      fill={highlightedFusibleId === fusible.id ? "orange" : "red"}
                      stroke="black"
                    />
                    <text x={fusible.posX} y={fusible.posY + 5} textAnchor="middle" fill="white" fontSize="12">
                      {fusible.codigo}
                    </text>
                  </g>
                ))}

                {/* Etiquetas */}
                <text x="100" y="80" fontSize="14">
                  Alimentación Principal
                </text>
                <text x="300" y="320" fontSize="14">
                  Rama A
                </text>
                <text x="500" y="320" fontSize="14">
                  Rama B
                </text>
                <text x="700" y="320" fontSize="14">
                  Rama C
                </text>
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

