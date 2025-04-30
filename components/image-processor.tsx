"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProcessedOutputViewer from "./processed-output-viewer"

export default function ImageProcessor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOutputs, setShowOutputs] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setShowOutputs(false) // Hide outputs when new image is selected
    }
  }

  const handleProcess = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setShowOutputs(false)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show outputs after processing
      setShowOutputs(true)

      toast({
        title: "Processing complete!",
        description: "Your 3D outputs are ready to view",
      })

      // Scroll to outputs
      setTimeout(() => {
        const outputsElement = document.getElementById("processed-outputs")
        if (outputsElement) {
          outputsElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Error processing image:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSampleImage = (imageUrl: string) => {
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "sample-image.jpg", { type: "image/jpeg" })
        setSelectedImage(file)
        setPreviewUrl(imageUrl)
        setShowOutputs(false) // Hide outputs when new sample is selected
      })
      .catch((err) => {
        console.error("Error loading sample image:", err)
      })
  }

  return (
    <>
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Upload Your Image</h2>

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
                          setShowOutputs(false)
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
                    <h3 className="text-xl font-medium">Drag and drop your image here</h3>
                    <p className="text-slate-400">or</p>
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
                    onClick={handleProcess}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Image...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Process Image to 3D
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Processed Outputs Section */}
      {showOutputs && (
        <section id="processed-outputs" className="py-20 px-4 md:px-6 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your Processed 3D Outputs</h2>
            <ProcessedOutputViewer inputImageUrl={previewUrl} />
          </div>
        </section>
      )}
    </>
  )
}
