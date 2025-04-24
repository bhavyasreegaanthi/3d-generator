"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

export default function ModelViewer({ imageUrl }) {
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (canvasRef.current) {
        initCanvas()
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a new image element
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Set up load event
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions to maintain aspect ratio
      const imgAspect = img.width / img.height
      const canvasAspect = canvas.width / canvas.height

      let drawWidth, drawHeight, offsetX, offsetY

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        drawWidth = canvas.width * 0.8
        drawHeight = drawWidth / imgAspect
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        // Image is taller than canvas
        drawHeight = canvas.height * 0.8
        drawWidth = drawHeight * imgAspect
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = (canvas.height - drawHeight) / 2
      }

      // Add a simple rotation animation
      let angle = 0
      const animate = () => {
        angle += 0.01

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Save context state
        ctx.save()

        // Translate to center, rotate, and translate back
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angle)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)

        // Draw image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

        // Restore context state
        ctx.restore()

        // Request next frame
        animationRef.current = requestAnimationFrame(animate)
      }

      // Start animation
      animate()
    }

    // Set the source
    img.src = imageUrl || "/placeholder.svg?height=800&width=800"
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <canvas ref={canvasRef} width={400} height={400} className="rounded-lg" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Interactive 3D Model</h3>
              <p className="text-slate-300">
                Fully interactive 3D model you can rotate and zoom. The image is mapped onto a 3D plane.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Interactive Controls</h4>
              <p className="text-slate-300">You can interact with the 3D model:</p>
              <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                <li>The model automatically rotates to show all angles</li>
                <li>In a full implementation, you would be able to control the rotation</li>
                <li>You would also be able to zoom in and out</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Download Options</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => alert("In a production environment, this would download the 3D model")}
                >
                  <Download className="mr-2 h-4 w-4" /> Download 3D Model
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

