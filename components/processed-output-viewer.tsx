"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ProcessedOutputViewer({ inputImageUrl }: { inputImageUrl: string | null }) {
  const [activeTab, setActiveTab] = useState("angles")

  if (!inputImageUrl) return null

  // Generate different views based on the input image
  const generateViews = () => {
    // In a real implementation, these would be actual processed outputs
    // For now, we'll create modified versions of the input image
    return {
      // Front view is the original image
      front: inputImageUrl,

      // Side views - we'll use the same image but add text to simulate different views
      left: "/placeholder.svg?height=400&width=400&text=LEFT+VIEW",
      right: "/placeholder.svg?height=400&width=400&text=RIGHT+VIEW",
      top: "/placeholder.svg?height=400&width=400&text=TOP+VIEW",
      bottom: "/placeholder.svg?height=400&width=400&text=BOTTOM+VIEW",
      back: "/placeholder.svg?height=400&width=400&text=BACK+VIEW",

      // 3D model view
      model: inputImageUrl,

      // Animation frames - array of images for animation
      frames: Array.from({ length: 8 }, (_, i) => `/placeholder.svg?height=400&width=400&text=FRAME+${i + 1}`),
    }
  }

  const views = generateViews()

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <Tabs defaultValue="angles" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="angles">Multiple Angles</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
            <TabsTrigger value="3d-model">3D Model</TabsTrigger>
          </TabsList>

          {/* Multiple Angles View */}
          <TabsContent value="angles" className="mt-0">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Multiple Angle Views</h3>
                <p className="text-slate-300">These are the processed views of your image from different angles</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ViewCard title="Front View" imageUrl={views.front} />
                <ViewCard title="Left View" imageUrl={views.left} />
                <ViewCard title="Right View" imageUrl={views.right} />
                <ViewCard title="Top View" imageUrl={views.top} />
                <ViewCard title="Bottom View" imageUrl={views.bottom} />
                <ViewCard title="Back View" imageUrl={views.back} />
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download All Views
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Animation View */}
          <TabsContent value="animation" className="mt-0">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Animated Rotation</h3>
                <p className="text-slate-300">This is an animated rotation of your processed 3D model</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                  <AnimatedFrames frames={views.frames} />
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Animation Details</h4>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>
                          <span className="text-slate-400">Frames:</span> 8
                        </li>
                        <li>
                          <span className="text-slate-400">Resolution:</span> 400 x 400 px
                        </li>
                        <li>
                          <span className="text-slate-400">Rotation:</span> 360 degrees
                        </li>
                        <li>
                          <span className="text-slate-400">Processing:</span> Edge detection, depth mapping
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Download Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download GIF
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download MP4
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 3D Model View */}
          <TabsContent value="3d-model" className="mt-0">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Interactive 3D Model</h3>
                <p className="text-slate-300">This is an interactive 3D model generated from your image</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                  <Interactive3DModel imageUrl={views.model} />
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Model Details</h4>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>
                          <span className="text-slate-400">Vertices:</span> 1,248
                        </li>
                        <li>
                          <span className="text-slate-400">Faces:</span> 2,492
                        </li>
                        <li>
                          <span className="text-slate-400">Texture Resolution:</span> 2048 x 2048 px
                        </li>
                        <li>
                          <span className="text-slate-400">Processing:</span> Photogrammetry, mesh optimization
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Interactive Controls</h4>
                    <p className="text-slate-300">You can interact with the 3D model:</p>
                    <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                      <li>Click and drag to rotate the model</li>
                      <li>Scroll to zoom in and out</li>
                      <li>Right-click and drag to pan</li>
                      <li>Double-click to reset the view</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Download Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download OBJ
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download GLB
                      </Button>
                    </div>
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

// Component for displaying a single view
function ViewCard({ title, imageUrl }: { title: string; imageUrl: string }) {
  return (
    <div className="relative group">
      <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 text-center py-1 px-2 rounded text-xs">
        {title}
      </div>
    </div>
  )
}

// Component for displaying animated frames
function AnimatedFrames({ frames }: { frames: string[] }) {
  const [currentFrame, setCurrentFrame] = useState(0)

  // Start animation
  useState(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length)
    }, 500)

    return () => clearInterval(interval)
  })

  return (
    <div className="relative w-full h-full">
      {frames.map((frame, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: currentFrame === index ? 1 : 0,
            zIndex: currentFrame === index ? 10 : 0,
          }}
        >
          <img src={frame || "/placeholder.svg"} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute bottom-2 right-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
        Frame {currentFrame + 1}/{frames.length}
      </div>
    </div>
  )
}

// Component for displaying interactive 3D model
function Interactive3DModel({ imageUrl }: { imageUrl: string }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

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

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="w-4/5 h-4/5 relative"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isDragging ? "none" : "transform 0.1s ease",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateZ(100px)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Back face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateZ(-100px) rotateY(180deg)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "hue-rotate(180deg)",
          }}
        ></div>

        {/* Left face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateX(-100px) rotateY(-90deg)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "hue-rotate(90deg)",
          }}
        ></div>

        {/* Right face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateX(100px) rotateY(90deg)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "hue-rotate(270deg)",
          }}
        ></div>

        {/* Top face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateY(-100px) rotateX(90deg)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(1.5)",
          }}
        ></div>

        {/* Bottom face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "translateY(100px) rotateX(-90deg)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.7)",
          }}
        ></div>
      </div>

      <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
        Rotation: X: {rotation.x.toFixed(0)}° Y: {rotation.y.toFixed(0)}°
      </div>
    </div>
  )
}
