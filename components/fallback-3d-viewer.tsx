"use client"
import { useRef, useEffect } from "react"

export default function Fallback3DViewer({ imageUrl }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a new image element
    const img = new Image()
    img.crossOrigin = "Anonymous"

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
        drawWidth = canvas.width
        drawHeight = canvas.width / imgAspect
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        // Image is taller than canvas
        drawHeight = canvas.height
        drawWidth = canvas.height * imgAspect
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      }

      // Draw image centered on canvas
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

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
        requestAnimationFrame(animate)
      }

      // Start animation
      animate()
    }

    // Set the source
    img.src = imageUrl || "/placeholder.svg?height=800&width=800"

    // Cleanup
    return () => {
      img.onload = null
    }
  }, [imageUrl])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={400} height={400} className="rounded-lg" />
    </div>
  )
}

