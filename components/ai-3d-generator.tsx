"use client"
import { useState, useRef } from "react"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Loader2, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AI360Viewer from "./ai-360-viewer"

export default function AI3DGenerator() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [generatedViews, setGeneratedViews] = useState<string[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setGeneratedViews(null)
    }
  }

  const handleGenerate = async () => {
    if (!previewUrl) {
      toast({
        title: "No image selected",
        description: "Please select an image to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingStage("Analyzing image structure")
    setProcessingProgress(0)
    setGeneratedViews(null)

    try {
      // Simulate AI processing with multiple stages
      await simulateProcessingStage("Analyzing image structure", 0, 20)
      await simulateProcessingStage("Detecting object boundaries", 20, 40)
      await simulateProcessingStage("Generating depth map", 40, 60)
      await simulateProcessingStage("Creating 3D mesh", 60, 80)
      await simulateProcessingStage("Rendering 360° views", 80, 100)

      // Generate simulated views
      const views = generateSimulatedViews(previewUrl)
      setGeneratedViews(views)

      toast({
        title: "360° Generation Complete!",
        description: "AI has generated views from all angles",
      })

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("ai-360-results")
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Error generating 3D views:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating the 360° views. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessingStage(null)
    }
  }

  // Simulate a processing stage with progress
  const simulateProcessingStage = async (stage: string, startProgress: number, endProgress: number) => {
    setProcessingStage(stage)

    const duration = 1000 // 1 second per stage
    const startTime = Date.now()

    return new Promise<void>((resolve) => {
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(startProgress + (elapsed / duration) * (endProgress - startProgress), endProgress)
        setProcessingProgress(progress)

        if (progress < endProgress) {
          requestAnimationFrame(updateProgress)
        } else {
          resolve()
        }
      }

      updateProgress()
    })
  }

  // Generate simulated views from different angles
  const generateSimulatedViews = (imageUrl: string): string[] => {
    // In a real implementation, this would use AI to generate actual different views
    // For this demo, we'll create 36 views (10 degrees apart) with visual indicators
    return Array.from({ length: 36 }, (_, i) => {
      const angle = i * 10
      // We'll use placeholder images with angle text to simulate the different views
      return `/placeholder.svg?height=400&width=400&text=${angle}°`
    })
  }

  const handleSampleImage = (imageUrl: string) => {
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "sample-image.jpg", { type: "image/jpeg" })
        setSelectedImage(file)
        setPreviewUrl(imageUrl)
        setGeneratedViews(null)
      })
      .catch((err) => {
        console.error("Error loading sample image:", err)
      })
  }

  return (
    <>
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">AI 360° View Generator</h2>
          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload a single front view image and our AI will generate a complete 360° view of your object
          </p>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-md">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="rounded-lg max-h-[300px] mx-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-slate-800/80"
                        onClick={() => {
                          setSelectedImage(null)
                          setPreviewUrl(null)
                          setGeneratedViews(null)
                        }}
                      >
                        Change
                      </Button>
                    </div>
                    <p className="text-slate-300">
                      {selectedImage?.name || "Sample Image"}
                      {selectedImage?.size ? ` (${Math.round(selectedImage.size / 1024)} KB)` : ""}
                    </p>
                  </div>
                ) : (
                  <div className="py-10 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium">Upload a front view image</h3>
                    <p className="text-slate-400">Our AI will generate views from all angles</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-center">Or use one of these sample images:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div
                    className="aspect-square bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500"
                    onClick={() => handleSampleImage("/sample-images/cube.jpg")}
                  >
                    <img src="/sample-images/cube.jpg" alt="Sample Cube" className="w-full h-full object-cover" />
                  </div>
                  <div
                    className="aspect-square bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500"
                    onClick={() => handleSampleImage("/placeholder.svg?height=400&width=400&text=Sphere")}
                  >
                    <img
                      src="/placeholder.svg?height=400&width=400&text=Sphere"
                      alt="Sample Sphere"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="aspect-square bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500"
                    onClick={() => handleSampleImage("/placeholder.svg?height=400&width=400&text=Pyramid")}
                  >
                    <img
                      src="/placeholder.svg?height=400&width=400&text=Pyramid"
                      alt="Sample Pyramid"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="aspect-square bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500"
                    onClick={() => handleSampleImage("/placeholder.svg?height=400&width=400&text=Cylinder")}
                  >
                    <img
                      src="/placeholder.svg?height=400&width=400&text=Cylinder"
                      alt="Sample Cylinder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="mt-6 text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleGenerate}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {processingStage || "Processing..."}
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate 360° Views with AI
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="mt-4">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${processingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">
                        {processingStage} ({processingProgress.toFixed(0)}%)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Generated 360° Results */}
      {generatedViews && (
        <section id="ai-360-results" className="py-20 px-4 md:px-6 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Generated 360° Views</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Our AI has analyzed your single front view image and generated a complete 360° view of your object.
                Here's what your object looks like from all angles:
              </p>
            </div>

            <AI360Viewer views={generatedViews} originalImage={previewUrl} />
          </div>
        </section>
      )}
    </>
  )
}
