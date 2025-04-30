"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DirectImageViewer from "./direct-image-viewer"

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  // Function to handle image upload and processing
  const handleUpload = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the DirectImageViewer component
      const viewerElement = document.getElementById("direct-viewer")
      if (viewerElement) {
        // Clear previous content
        viewerElement.innerHTML = ""

        // Create and render the DirectImageViewer component
        const viewer = document.createElement("div")
        viewerElement.appendChild(viewer)

        // Use React to render the component
        const React = await import("react")
        const ReactDOM = await import("react-dom/client")
        const root = ReactDOM.createRoot(viewer)
        root.render(React.createElement(DirectImageViewer, { imageUrl: previewUrl }))
      }

      toast({
        title: "Processing complete!",
        description: "Your image is now being displayed in 3D rotation below",
      })

      // Scroll to the viewer section
      viewerElement?.scrollIntoView({ behavior: "smooth" })
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

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  // Function to handle sample image selection
  const handleSampleImage = (imageUrl: string) => {
    setPreviewUrl(imageUrl)

    // Create a mock file object
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "sample-image.jpg", { type: "image/jpeg" })
        setSelectedImage(file)
      })
      .catch((err) => {
        console.error("Error loading sample image:", err)
      })
  }

  // Load a default sample image on component mount
  useEffect(() => {
    handleSampleImage("/sample-images/cube.jpg")
  }, [])

  return (
    <section id="image-uploader" className="py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Upload Your Image</h2>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div
              className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
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
                  <p className="text-sm text-slate-400 mt-2">
                    Supported formats: JPEG, PNG, GIF, BMP, WEBP
                    <br />
                    Maximum file size: 5MB
                  </p>
                </div>
              )}
            </div>

            {!previewUrl && (
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
            )}

            {previewUrl && (
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleUpload}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Generate 3D Rotation
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
