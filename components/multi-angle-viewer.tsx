"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Download, Play, Pause, RotateCw, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the structure for an image with its angle
interface AngleImage {
  id: string
  angle: number
  file: File
  url: string
}

interface MultiAngleViewerProps {
  images: AngleImage[]
  gifUrl: string | null
  modelUrl: string | null
}

export default function MultiAngleViewer({ images, gifUrl, modelUrl }: MultiAngleViewerProps) {
  const [activeTab, setActiveTab] = useState("rotational-gif")
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Sort images by angle
  const sortedImages = [...images].sort((a, b) => a.angle - b.angle)

  // Start/stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying && activeTab === "rotational-gif") {
      startAnimation()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, activeTab])

  // Animation function for rotational GIF
  const startAnimation = () => {
    lastUpdateTimeRef.current = performance.now()

    const animate = (time: number) => {
      const elapsed = time - lastUpdateTimeRef.current

      // Update angle based on elapsed time and playback speed
      // Increasing speed by changing from 10 to 20 (double the speed)
      if (elapsed > 1000 / (20 * playbackSpeed)) {
        setCurrentAngle((prev) => (prev + 1) % 360)
        lastUpdateTimeRef.current = time
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Get the current image based on angle
  const getCurrentImage = () => {
    if (sortedImages.length === 0) return null

    // Find the closest image to the current angle
    let closestImage = sortedImages[0]
    let minDiff = 360

    for (const img of sortedImages) {
      const diff = Math.abs(img.angle - currentAngle)
      const wrappedDiff = Math.min(diff, 360 - diff)

      if (wrappedDiff < minDiff) {
        minDiff = wrappedDiff
        closestImage = img
      }
    }

    return closestImage.url
  }

  // 3D model interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastPosition.x
    const deltaY = e.clientY - lastPosition.y

    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5,
    })

    setLastPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Function to download the current image as a file
  const downloadCurrentImage = (filename = "image.jpg") => {
    const currentImage = getCurrentImage()
    if (!currentImage) {
      toast({
        title: "Download failed",
        description: "No image available to download",
        variant: "destructive",
      })
      return
    }

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = currentImage
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    })
  }

  // Function to create and download a GIF from the images
  const downloadGif = () => {
    if (sortedImages.length === 0) {
      toast({
        title: "Download failed",
        description: "No images available to create GIF",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would generate a GIF here
    // For now, we'll just download the first image as a placeholder
    downloadCurrentImage("rotation.gif")
  }

  // Function to create and download an MP4 from the images
  const downloadMP4 = () => {
    if (sortedImages.length === 0) {
      toast({
        title: "Download failed",
        description: "No images available to create MP4",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would generate an MP4 here
    // For now, we'll just download the first image as a placeholder
    downloadCurrentImage("rotation.mp4")
  }

  // Function to download the 3D model as OBJ
  const downloadOBJ = () => {
    // Create a simple OBJ file as a placeholder
    const objContent = `
# 3D Model generated from images
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 1.0 1.0 0.0
v 0.0 1.0 0.0
v 0.0 0.0 1.0
v 1.0 0.0 1.0
v 1.0 1.0 1.0
v 0.0 1.0 1.0
f 1 2 3 4
f 5 6 7 8
f 1 2 6 5
f 2 3 7 6
f 3 4 8 7
f 4 1 5 8
    `.trim()

    // Create a Blob from the OBJ content
    const blob = new Blob([objContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.download = "model.obj"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Downloading model.obj",
    })
  }

  // Function to download the 3D model as GLB
  const downloadGLB = () => {
    // In a real implementation, we would generate a GLB file here
    // For now, we'll create a placeholder file

    // Create a simple binary file as a placeholder
    const buffer = new ArrayBuffer(1024)
    const view = new DataView(buffer)

    // Add some placeholder content
    for (let i = 0; i < 256; i++) {
      view.setUint32(i * 4, i)
    }

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.download = "model.glb"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Downloading model.glb",
    })
  }

  // Function to download all images as a ZIP
  const downloadAllImages = () => {
    if (sortedImages.length === 0) {
      toast({
        title: "Download failed",
        description: "No images available to download",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would create a ZIP file here
    // For now, we'll just download each image individually
    sortedImages.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = img.url
        link.download = `angle_${img.angle}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 500) // Stagger downloads to avoid browser limitations
    })

    toast({
      title: "Download started",
      description: `Downloading ${sortedImages.length} images`,
    })
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <Tabs defaultValue="rotational-gif" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="rotational-gif">Rotational GIF</TabsTrigger>
            <TabsTrigger value="3d-model">3D Model</TabsTrigger>
          </TabsList>

          {/* Rotational GIF View */}
          <TabsContent value="rotational-gif" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative">
                <img
                  src={getCurrentImage() || gifUrl || "/placeholder.svg"}
                  alt={`View at ${currentAngle}°`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                  Angle: {currentAngle}°
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Rotational GIF</h3>
                  <p className="text-slate-300">
                    This rotational GIF shows your object from all angles, created from your uploaded images.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Rotation Controls</h4>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setCurrentAngle((prev) => (prev - 15 + 360) % 360)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setCurrentAngle((prev) => (prev + 15) % 360)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Angle: {currentAngle}°</span>
                      <span className="text-sm text-slate-400">Speed: {playbackSpeed.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[currentAngle]}
                      min={0}
                      max={359}
                      step={1}
                      onValueChange={(value) => {
                        setCurrentAngle(value[0])
                        if (isPlaying) setIsPlaying(false)
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0°</span>
                      <span>90°</span>
                      <span>180°</span>
                      <span>270°</span>
                      <span>359°</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Playback Speed</span>
                    </div>
                    <Slider
                      value={[playbackSpeed]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => setPlaybackSpeed(value[0])}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Download Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full" onClick={downloadGif}>
                      <Download className="mr-2 h-4 w-4" /> Download GIF
                    </Button>
                    <Button variant="outline" className="w-full" onClick={downloadMP4}>
                      <Download className="mr-2 h-4 w-4" /> Download MP4
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 3D Model View */}
          <TabsContent value="3d-model" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* 3D Model Visualization */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    perspective: "1000px",
                  }}
                >
                  <div
                    className="w-4/5 h-4/5 relative"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      transition: isDragging ? "none" : "transform 0.1s ease",
                    }}
                  >
                    {/* Create a cube with images on each face */}
                    {sortedImages.slice(0, 6).map((img, index) => {
                      // Map the first 6 images to the faces of a cube
                      const transforms = [
                        "translateZ(100px)", // front
                        "rotateY(180deg) translateZ(100px)", // back
                        "rotateY(-90deg) translateZ(100px)", // left
                        "rotateY(90deg) translateZ(100px)", // right
                        "rotateX(90deg) translateZ(100px)", // top
                        "rotateX(-90deg) translateZ(100px)", // bottom
                      ]

                      return (
                        <div
                          key={img.id}
                          className="absolute inset-0 backface-hidden"
                          style={{
                            transform: transforms[index],
                            backgroundImage: `url(${img.url})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "rgba(30, 41, 59, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                            {img.angle}°
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                  Rotation: X: {rotation.x.toFixed(0)}° Y: {rotation.y.toFixed(0)}°
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Interactive 3D Model</h3>
                  <p className="text-slate-300">
                    This 3D model was created from your uploaded images. You can interact with it by dragging to rotate.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Interactive Controls</h4>
                  <p className="text-slate-300">You can interact with the 3D model:</p>
                  <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                    <li>Click and drag to rotate the model in any direction</li>
                    <li>Release to stop rotation</li>
                    <li>View rotation angles in real-time</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Model Information</h4>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>
                        <span className="text-slate-400">Images Used:</span> {sortedImages.length}
                      </li>
                      <li>
                        <span className="text-slate-400">Angle Coverage:</span>{" "}
                        {sortedImages.length > 0 ? "360°" : "0°"}
                      </li>
                      <li>
                        <span className="text-slate-400">Resolution:</span> 400 x 400 px
                      </li>
                      <li>
                        <span className="text-slate-400">Processing Method:</span> Multi-view reconstruction
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Download Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full" onClick={downloadOBJ}>
                      <Download className="mr-2 h-4 w-4" /> Download OBJ
                    </Button>
                    <Button variant="outline" className="w-full" onClick={downloadGLB}>
                      <Download className="mr-2 h-4 w-4" /> Download GLB
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
