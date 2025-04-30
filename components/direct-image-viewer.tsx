"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function DirectImageViewer({ imageUrl }: { imageUrl: string | null }) {
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Start rotation animation when component mounts
  useEffect(() => {
    if (!imageUrl) return

    setIsLoading(true)

    // Simulate loading delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      startRotation()
    }, 1000)

    return () => {
      clearTimeout(loadingTimer)
      stopRotation()
    }
  }, [imageUrl])

  // Function to start rotation
  const startRotation = () => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 5) % 360)
    }, 100)

    // Store interval ID in window object for cleanup
    window.rotationInterval = interval
  }

  // Function to stop rotation
  const stopRotation = () => {
    if (window.rotationInterval) {
      clearInterval(window.rotationInterval)
    }
  }

  if (!imageUrl) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center py-20">
          <p className="text-slate-400">Please upload an image to see it in 3D rotation</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Image in 3D Rotation</h2>

        <div className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-slate-400 animate-spin" />
          ) : (
            <div
              className="w-4/5 h-4/5 relative"
              style={{
                transform: `rotateY(${rotation}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s linear",
              }}
            >
              {/* Front face - your image */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              {/* Back face - your image flipped */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: "rotateY(180deg)",
                }}
              ></div>

              {/* Rotation indicator */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1">
                Rotation: {rotation}°
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-slate-300 mb-4">
            This is your uploaded image rotating in 3D space. The image is being displayed exactly as you uploaded it.
          </p>
          <Button
            onClick={() => {
              if (window.rotationInterval) {
                stopRotation()
                window.rotationInterval = null
              } else {
                startRotation()
              }
            }}
          >
            {window.rotationInterval ? "Pause Rotation" : "Resume Rotation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
