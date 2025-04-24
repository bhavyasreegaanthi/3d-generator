"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function RotatingImageDisplay({ imageUrl }: { imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentAngle, setCurrentAngle] = useState(0)

  console.log("RotatingImageDisplay rendering with imageUrl:", imageUrl)

  useEffect(() => {
    console.log("RotatingImageDisplay effect running")
    // Simulate loading
    const timer = setTimeout(() => {
      console.log("Loading complete")
      setIsLoading(false)
    }, 1000)

    // Start rotation
    const interval = setInterval(() => {
      setCurrentAngle((prev) => {
        const newAngle = (prev + 45) % 360
        console.log("Rotating to angle:", newAngle)
        return newAngle
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  // Create an array of 8 angles (0, 45, 90, 135, 180, 225, 270, 315)
  const angles = Array.from({ length: 8 }, (_, i) => i * 45)

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
      {isLoading ? (
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Display the current angle */}
          {angles.map((angle) => (
            <div
              key={angle}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{
                opacity: angle === currentAngle ? 1 : 0,
                pointerEvents: angle === currentAngle ? "auto" : "none",
              }}
            >
              <div className="relative w-4/5 h-4/5 rounded-lg overflow-hidden border-4 border-white">
                {/* Colored background to make rotation more obvious */}
                <div className="absolute inset-0" style={{ backgroundColor: `hsl(${angle}, 70%, 50%)` }}></div>

                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${imageUrl || "/placeholder.svg?height=400&width=400"})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.8,
                  }}
                ></div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">{`${angle}°`}</div>
              </div>
            </div>
          ))}

          {/* Current angle indicator */}
          <div className="absolute top-4 right-4 bg-slate-800/80 text-sm px-3 py-2 rounded font-bold">
            {`Current: ${currentAngle}°`}
          </div>
        </div>
      )}
    </div>
  )
}

