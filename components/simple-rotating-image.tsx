"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

export default function SimpleRotatingImage({ imageUrl }: { imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)
  const isMounted = useRef(true)

  console.log("SimpleRotatingImage rendering with imageUrl:", imageUrl)

  // Use a simple 2D rotation approach instead of 3D
  useEffect(() => {
    console.log("SimpleRotatingImage effect running")
    // Set mounted state
    isMounted.current = true

    // Reset states
    setIsLoading(true)
    setError(null)
    setRotation(0)

    // Clean up any previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Simulate loading delay
    const loadingTimer = setTimeout(() => {
      if (isMounted.current) {
        console.log("Loading complete, starting animation")
        setIsLoading(false)
        startRotationAnimation()
      }
    }, 1000)

    // Clean up function
    return () => {
      // Mark component as unmounted
      isMounted.current = false

      // Clear timeout
      clearTimeout(loadingTimer)

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [imageUrl])

  const startRotationAnimation = () => {
    console.log("Starting rotation animation")
    // Animation function using requestAnimationFrame
    const animate = () => {
      if (!isMounted.current) return

      setRotation((prev) => (prev + 2) % 360) // Faster rotation (2 degrees per frame)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()
  }

  // Simple 2D rotation using CSS transform with more obvious visual elements
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Rotating container */}
          <div
            className="w-4/5 h-4/5 flex items-center justify-center"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.05s linear",
            }}
          >
            {/* Colored squares in a grid pattern with more contrast */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-64 h-64 border-4 border-white rounded-lg">
              <div className="bg-purple-500 rounded-tl-lg flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="bg-blue-500 rounded-tr-lg flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="bg-green-500 rounded-bl-lg flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="bg-amber-500 rounded-br-lg flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>

              {/* Image overlay with reduced opacity for better visibility of rotation */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                  opacity: 0.7,
                }}
              ></div>
            </div>
          </div>

          {/* Rotation indicator */}
          <div className="absolute bottom-4 right-4 bg-slate-800/80 text-xs px-2 py-1 rounded">
            {`Rotation: ${rotation.toFixed(0)}°`}
          </div>

          {/* Error message if needed */}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 text-center p-2 bg-slate-800/80 rounded-lg">
              <p className="text-amber-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
