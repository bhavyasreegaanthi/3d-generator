"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

export default function MultiAxisRotation({ imageUrl }: { imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [rotationZ, setRotationZ] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const animationRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  // Initialize the component
  useEffect(() => {
    console.log("MultiAxisRotation effect running")
    isMounted.current = true

    // Reset states
    setIsLoading(true)
    setRotationX(15) // Start with a slight tilt
    setRotationY(0)
    setRotationZ(0)

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
        if (autoRotate) startRotationAnimation()
      }
    }, 1000)

    // Clean up function
    return () => {
      isMounted.current = false
      clearTimeout(loadingTimer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [imageUrl, autoRotate])

  // Handle mouse/touch interaction
  useEffect(() => {
    if (!containerRef.current || isLoading) return

    let isDragging = false
    let previousX = 0
    let previousY = 0

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousX = e.clientX
      previousY = e.clientY
      setAutoRotate(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - previousX
      const deltaY = e.clientY - previousY

      setRotationY((prev) => prev + deltaX * 0.5)
      setRotationX((prev) => prev + deltaY * 0.5)

      previousX = e.clientX
      previousY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        previousX = e.touches[0].clientX
        previousY = e.touches[0].clientY
        setAutoRotate(false)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return

      const deltaX = e.touches[0].clientX - previousX
      const deltaY = e.touches[0].clientY - previousY

      setRotationY((prev) => prev + deltaX * 0.5)
      setRotationX((prev) => prev + deltaY * 0.5)

      previousX = e.touches[0].clientX
      previousY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      isDragging = false
    }

    const element = containerRef.current
    element.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      element.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isLoading])

  const startRotationAnimation = () => {
    console.log("Starting multi-axis rotation animation")
    let time = 0

    const animate = () => {
      if (!isMounted.current || !autoRotate) return

      time += 0.01

      // Create a more interesting rotation pattern
      setRotationY((prev) => prev + 0.5) // Continuous Y rotation
      setRotationX(15 + Math.sin(time) * 10) // Oscillating X rotation
      setRotationZ(Math.sin(time * 0.5) * 5) // Subtle Z rotation

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => {
      const newValue = !prev
      if (newValue) startRotationAnimation()
      return newValue
    })
  }

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      ) : (
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: "1000px" }}
        >
          {/* 3D rotating container */}
          <div
            className="w-4/5 h-4/5 flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
              transition: "transform 0.05s linear",
            }}
          >
            {/* Front face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateZ(32px)",
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#9333ea",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Front</div>
            </div>

            {/* Back face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateZ(-32px) rotateY(180deg)",
                backgroundColor: "#4f46e5",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Back</div>
            </div>

            {/* Left face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateX(-32px) rotateY(-90deg)",
                backgroundColor: "#0ea5e9",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Left</div>
            </div>

            {/* Right face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateX(32px) rotateY(90deg)",
                backgroundColor: "#10b981",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Right</div>
            </div>

            {/* Top face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateY(-32px) rotateX(90deg)",
                backgroundColor: "#f59e0b",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Top</div>
            </div>

            {/* Bottom face */}
            <div
              className="absolute w-64 h-64 border-2 border-white rounded-lg"
              style={{
                transform: "translateY(32px) rotateX(-90deg)",
                backgroundColor: "#ef4444",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Bottom</div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/70 text-white text-xs px-3 py-2 rounded">
              <div>X: {rotationX.toFixed(0)}°</div>
              <div>Y: {rotationY.toFixed(0)}°</div>
              <div>Z: {rotationZ.toFixed(0)}°</div>
            </div>

            <button
              className={`px-3 py-2 rounded text-xs ${autoRotate ? "bg-purple-600" : "bg-slate-700"}`}
              onClick={toggleAutoRotate}
            >
              {autoRotate ? "Auto-Rotate: ON" : "Auto-Rotate: OFF"}
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-0 right-0 text-center">
            <div className="bg-black/70 text-white text-xs px-3 py-2 rounded inline-block">
              Drag to rotate • Click button to toggle auto-rotation
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

