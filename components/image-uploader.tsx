"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
      // For now, let's use a mock implementation instead of calling the API
      // This will allow the app to work without the Python backend
      await mockProcessImage(selectedImage)

      toast({
        title: "Processing complete!",
        description: "Your 3D rotating views are ready",
      })

      // Scroll to results section
      const resultsElement = document.getElementById("results-gallery")
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" })
      }
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

  // Update the mockProcessImage function to ensure it creates valid data and properly stores it
  const mockProcessImage = async (file: File) => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get a valid placeholder image URL
    const placeholderUrl = "/placeholder.svg?height=400&width=400"

    // Create a mock result object with the actual preview URL
    const mockResults = {
      gif: placeholderUrl,
      mp4: placeholderUrl,
      angles: Array.from({ length: 8 }, (_, i) => placeholderUrl),
      anglesZip: "#",
      model: {
        obj: "#",
        mtl: "#",
        texture: placeholderUrl,
      },
      originalImage: previewUrl || placeholderUrl,
    }

    // Log the results to help with debugging
    console.log("Generated mock results:", mockResults)

    // Store the mock results in localStorage
    try {
      localStorage.setItem("processingResults", JSON.stringify(mockResults))
      console.log("Successfully stored results in localStorage")
    } catch (error) {
      console.error("Failed to store results in localStorage:", error)
    }

    return mockResults
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

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
                    {selectedImage?.name} ({Math.round(selectedImage?.size / 1024)} KB)
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
                      Generate 3D Rotating Views
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

