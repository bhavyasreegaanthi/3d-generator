"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Play, Pause, AlertCircle } from "lucide-react"
import MultiAxisRotation from "./multi-axis-rotation"

export default function ResultsGallery() {
  const [results, setResults] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get the results from localStorage
      const storedResults = localStorage.getItem("processingResults")
      console.log("Retrieved from localStorage:", storedResults)

      if (storedResults) {
        const parsedResults = JSON.parse(storedResults)
        console.log("Parsed results:", parsedResults)
        setResults(parsedResults)
      } else {
        console.log("No results found in localStorage, creating demo data")
        // Create demo data if nothing is in localStorage
        const demoResults = {
          gif: "/placeholder.svg?height=400&width=600",
          mp4: "/placeholder.svg?height=400&width=600",
          angles: Array.from({ length: 8 }, (_, i) => "/placeholder.svg?height=200&width=200"),
          anglesZip: "#",
          model: {
            obj: "#",
            mtl: "#",
            texture: "#",
          },
          originalImage: "/placeholder.svg?height=400&width=400",
        }
        setResults(demoResults)
      }
    } catch (error) {
      console.error("Error retrieving results:", error)
      setError("Failed to load results. Please try processing your image again.")
    }
  }, [])

  if (error) {
    return (
      <section id="results-gallery" className="py-20 px-4 md:px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your 3D Rotating Views</h2>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center py-20">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-medium text-lg">{error}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (!results) {
    return (
      <section id="results-gallery" className="py-20 px-4 md:px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your 3D Rotating Views</h2>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center py-20">
              <p className="text-slate-400">Upload an image to see your 3D rotating views here</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="results-gallery" className="py-20 px-4 md:px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your 3D Rotating Views</h2>

        <Tabs defaultValue="3d-model" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="gif">GIF Animation</TabsTrigger>
            <TabsTrigger value="multi-angle">Multi-Angle</TabsTrigger>
            <TabsTrigger value="3d-model">3D Model</TabsTrigger>
          </TabsList>

          <TabsContent value="gif" className="mt-0">
            <GifResult
              result={{
                title: "360° Rotation",
                description: "Complete 360-degree rotation around the vertical axis",
                imageUrl: results.gif,
                videoUrl: results.mp4,
              }}
            />
          </TabsContent>

          <TabsContent value="multi-angle" className="mt-0">
            <MultiAngleResult
              result={{
                title: "Multi-Angle Views",
                description: "8 different angles showing all sides of the object",
                images: results.angles,
                zipUrl: results.anglesZip,
              }}
            />
          </TabsContent>

          <TabsContent value="3d-model" className="mt-0">
            <ModelResult imageUrl={results.originalImage} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function GifResult({ result }) {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <div className="aspect-video bg-slate-900 flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={result.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={result.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-10 w-10 p-0"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
              <p className="text-slate-300">{result.description}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Download Options</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // In a real implementation, this would download the actual file
                    alert("In a production environment, this would download the GIF file")
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download GIF
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // In a real implementation, this would download the actual file
                    alert("In a production environment, this would download the MP4 file")
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download MP4
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Processing Details</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>
                    <span className="text-slate-400">Resolution:</span> 800 x 600 px
                  </li>
                  <li>
                    <span className="text-slate-400">Frames:</span> 60
                  </li>
                  <li>
                    <span className="text-slate-400">File Size:</span> 2.4 MB
                  </li>
                  <li>
                    <span className="text-slate-400">Processing Time:</span> 2 seconds
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MultiAngleResult({ result }) {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
            <p className="text-slate-300 mb-6">{result.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {result.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg?height=200&width=200"}
                    alt={`Angle ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => alert(`In a production environment, this would download image ${index + 1}`)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                  {`${45 * index}°`}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => alert("In a production environment, this would download all images as a ZIP file")}
            >
              <Download className="mr-2 h-4 w-4" /> Download All Images (ZIP)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ModelResult({ imageUrl }) {
  // Ensure we have a valid image URL
  const safeImageUrl = imageUrl || "/placeholder.svg?height=400&width=400"

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
            {/* Use the multi-axis rotation component */}
            <MultiAxisRotation imageUrl={safeImageUrl} />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Interactive 3D Model</h3>
              <p className="text-slate-300">
                Fully interactive 3D model you can rotate in all directions. The image is mapped onto a 3D cube.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Interactive Controls</h4>
              <p className="text-slate-300">You can interact with the 3D model:</p>
              <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                <li>Click and drag to rotate the model in any direction</li>
                <li>Toggle auto-rotation with the button</li>
                <li>View rotation angles in real-time</li>
                <li>See all six sides of the 3D cube</li>
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

