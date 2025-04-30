"use client"
import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"

export default function AnimatedGifDisplay({ imageUrl }: { imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [frames, setFrames] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(true)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate frames from the image
  useEffect(() => {
    const generateFrames = async () => {
      try {
        setIsLoading(true)

        // Load the image
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          // Create frames
          const newFrames: string[] = []

          // Generate 36 frames (10 degrees rotation each)
          for (let i = 0; i < 36; i++) {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")

            if (!ctx) continue

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Save the context state
            ctx.save()

            // Translate to center, rotate, and translate back
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((i * 10 * Math.PI) / 180)
            ctx.translate(-canvas.width / 2, -canvas.height / 2)

            // Draw the image
            ctx.drawImage(img, 0, 0)

            // Restore the context state
            ctx.restore()

            // Add frame to array
            newFrames.push(canvas.toDataURL("image/jpeg", 0.8))
          }

          setFrames(newFrames)
          setIsLoading(false)

          // Start animation
          if (isPlaying) {
            startAnimation()
          }
        }

        img.onerror = () => {
          console.error("Failed to load image")
          setIsLoading(false)
        }

        img.src = imageUrl
      } catch (error) {
        console.error("Error generating frames:", error)
        setIsLoading(false)
      }
    }

    generateFrames()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [imageUrl])

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startAnimation()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, frames])

  const startAnimation = () => {
    let frameIndex = currentFrame
    let lastTime = 0

    const animate = (time: number) => {
      if (!isPlaying) return

      // Update frame every 100ms
      if (time - lastTime > 100) {
        frameIndex = (frameIndex + 1) % frames.length
        setCurrentFrame(frameIndex)
        lastTime = time
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Draw the current frame on canvas
  useEffect(() => {
    if (frames.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Load the current frame
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    img.src = frames[currentFrame]
  }, [currentFrame, frames])

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="max-w-full max-h-full"
            onClick={() => setIsPlaying(!isPlaying)}
          />

          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded">
            {isPlaying ? "Click to pause" : "Click to play"} | Frame: {currentFrame + 1}/{frames.length}
          </div>
        </div>
      )}
    </div>
  )
}
