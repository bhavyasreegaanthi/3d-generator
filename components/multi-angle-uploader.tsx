"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Loader2, X, Plus, RotateCw, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MultiAngleViewer from "./multi-angle-viewer"

// Define the structure for an image with its angle
interface AngleImage {
  id: string
  angle: number
  file: File
  url: string
}

// Define the structure for saved image data
interface SavedImageData {
  id: string
  angle: number
  dataUrl: string
  name: string
  type: string
}

export default function MultiAngleUploader() {
  const [images, setImages] = useState<AngleImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [outputGif, setOutputGif] = useState<string | null>(null)
  const [output3DModel, setOutput3DModel] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load saved images when component mounts
  useEffect(() => {
    loadSavedImages()
  }, [])

  // Save images to local storage
  const saveImagesToLocalStorage = async (imagesToSave: AngleImage[]) => {
    try {
      // Convert File objects to data URLs for storage
      const savedData: SavedImageData[] = await Promise.all(
        imagesToSave.map(async (img) => {
          // If we already have a data URL, use it directly
          if (img.url.startsWith("data:")) {
            return {
              id: img.id,
              angle: img.angle,
              dataUrl: img.url,
              name: img.file.name,
              type: img.file.type,
            }
          }

          // Otherwise, read the file and convert to data URL
          return new Promise<SavedImageData>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                id: img.id,
                angle: img.angle,
                dataUrl: reader.result as string,
                name: img.file.name,
                type: img.file.type,
              })
            }
            reader.readAsDataURL(img.file)
          })
        }),
      )

      // Save to local storage
      localStorage.setItem("savedImages", JSON.stringify(savedData))

      toast({
        title: "Images saved",
        description: `${savedData.length} images saved to browser storage`,
      })
    } catch (error) {
      console.error("Error saving images:", error)
      toast({
        title: "Error saving images",
        description: "There was a problem saving your images",
        variant: "destructive",
      })
    }
  }

  // Load saved images from local storage
  const loadSavedImages = async () => {
    try {
      const savedImagesJson = localStorage.getItem("savedImages")
      if (!savedImagesJson) return

      const savedData: SavedImageData[] = JSON.parse(savedImagesJson)

      // Convert data URLs back to File objects
      const loadedImages: AngleImage[] = await Promise.all(
        savedData.map(async (saved) => {
          // Convert data URL to Blob
          const response = await fetch(saved.dataUrl)
          const blob = await response.blob()

          // Create File from Blob
          const file = new File([blob], saved.name, { type: saved.type })

          return {
            id: saved.id,
            angle: saved.angle,
            file: file,
            url: saved.dataUrl,
          }
        }),
      )

      setImages(loadedImages)

      // If we have saved images, also load any saved outputs
      const savedOutputGif = localStorage.getItem("outputGif")
      const savedOutput3DModel = localStorage.getItem("output3DModel")

      if (savedOutputGif) setOutputGif(savedOutputGif)
      if (savedOutput3DModel) setOutput3DModel(savedOutput3DModel)

      toast({
        title: "Images loaded",
        description: `${loadedImages.length} images loaded from browser storage`,
      })
    } catch (error) {
      console.error("Error loading saved images:", error)
      toast({
        title: "Error loading images",
        description: "There was a problem loading your saved images",
        variant: "destructive",
      })
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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

      // Generate a unique ID for this image
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create a URL for the image
      const url = URL.createObjectURL(file)

      // Determine the angle based on the current number of images
      // Distribute angles evenly around 360 degrees
      const angle = images.length > 0 ? (images.length * (360 / (images.length + 1))) % 360 : 0

      // Add the new image to the list
      const updatedImages = [...images, { id, angle, file, url }]
      setImages(updatedImages)

      // Save the updated images to local storage
      saveImagesToLocalStorage(updatedImages)

      // Reset the file input
      if (e.target.value) e.target.value = ""
    }
  }

  // Handle angle change for an image
  const handleAngleChange = (id: string, angle: number) => {
    const updatedImages = images.map((img) => (img.id === id ? { ...img, angle: angle % 360 } : img))
    setImages(updatedImages)

    // Save the updated images to local storage
    saveImagesToLocalStorage(updatedImages)
  }

  // Remove an image
  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    setImages(updatedImages)

    // If we're removing all images, reset outputs
    if (updatedImages.length === 0) {
      setOutputGif(null)
      setOutput3DModel(null)
      localStorage.removeItem("outputGif")
      localStorage.removeItem("output3DModel")
    }

    // Save the updated images to local storage
    saveImagesToLocalStorage(updatedImages)
  }

  // Process the images to create outputs
  const handleProcessImages = async () => {
    if (images.length < 2) {
      toast({
        title: "Not enough images",
        description: "Please upload at least 2 images from different angles",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setOutputGif(null)
    setOutput3DModel(null)

    try {
      // Sort images by angle
      const sortedImages = [...images].sort((a, b) => a.angle - b.angle)

      // Simulate processing with progress updates
      await simulateProcessing(20, "Analyzing image angles...")
      await simulateProcessing(40, "Aligning images...")
      await simulateProcessing(60, "Generating 3D model...")
      await simulateProcessing(80, "Creating rotational GIF...")
      await simulateProcessing(100, "Finalizing outputs...")

      // Set the outputs (in a real implementation, these would be generated from the images)
      // For now, we'll use the first image as a placeholder
      const newOutputGif = sortedImages[0].url
      const newOutput3DModel = sortedImages[0].url

      setOutputGif(newOutputGif)
      setOutput3DModel(newOutput3DModel)

      // Save outputs to local storage
      localStorage.setItem("outputGif", newOutputGif)
      localStorage.setItem("output3DModel", newOutput3DModel)

      toast({
        title: "Processing complete!",
        description: "Your 3D outputs are ready to view and download",
      })

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("processing-results")
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Error processing images:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Simulate processing with a delay
  const simulateProcessing = async (targetProgress: number, message: string) => {
    const startProgress = processingProgress
    const duration = 1000 // 1 second
    const startTime = Date.now()

    toast({
      title: "Processing",
      description: message,
    })

    return new Promise<void>((resolve) => {
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(
          startProgress + (elapsed / duration) * (targetProgress - startProgress),
          targetProgress,
        )

        setProcessingProgress(progress)

        if (progress < targetProgress) {
          requestAnimationFrame(updateProgress)
        } else {
          resolve()
        }
      }

      updateProgress()
    })
  }

  // Add sample images
  const handleAddSampleImages = () => {
    // Clear existing images
    setImages([])
    setOutputGif(null)
    setOutput3DModel(null)
    localStorage.removeItem("outputGif")
    localStorage.removeItem("output3DModel")

    // Sample image URLs
    const sampleAngles = [0, 45, 90, 135, 180, 225, 270, 315]

    // Create sample images with different angles
    Promise.all(
      sampleAngles.map(async (angle) => {
        const response = await fetch(`/placeholder.svg?height=400&width=400&text=${angle}°`)
        const blob = await response.blob()
        const file = new File([blob], `sample-${angle}.jpg`, { type: "image/jpeg" })
        const url = URL.createObjectURL(file)
        const id = `sample-${angle}`

        return { id, angle, file, url }
      }),
    )
      .then((sampleImages) => {
        setImages(sampleImages)
        // Save the sample images to local storage
        saveImagesToLocalStorage(sampleImages)
      })
      .catch((error) => {
        console.error("Error creating sample images:", error)
      })
  }

  // Clear all saved data
  const handleClearSavedData = () => {
    localStorage.removeItem("savedImages")
    localStorage.removeItem("outputGif")
    localStorage.removeItem("output3DModel")
    setImages([])
    setOutputGif(null)
    setOutput3DModel(null)

    toast({
      title: "Data cleared",
      description: "All saved images and outputs have been cleared",
    })
  }

  return (
    <>
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Multi-Angle Image Uploader</h2>
          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload images of your object from different angles to generate a rotational GIF and 3D view
          </p>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Image upload area */}
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <div className="py-6 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium">Upload images from different angles</h3>
                    <p className="text-slate-400">For best results, upload at least 8 images (every 45°)</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Images
                      </Button>
                      <Button variant="secondary" onClick={handleAddSampleImages}>
                        <RotateCw className="mr-2 h-4 w-4" /> Load Sample Images
                      </Button>
                      {images.length > 0 && (
                        <Button variant="destructive" onClick={handleClearSavedData}>
                          <X className="mr-2 h-4 w-4" /> Clear All
                        </Button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Uploaded images display */}
                {images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Uploaded Images ({images.length})</h3>
                      <Button variant="outline" size="sm" onClick={() => saveImagesToLocalStorage(images)}>
                        <Save className="mr-2 h-4 w-4" /> Save Images
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative">
                          <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                            <img
                              src={img.url || "/placeholder.svg"}
                              alt={`Image at ${img.angle}°`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Angle indicator and controls */}
                          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 text-center py-1 px-2 rounded flex items-center justify-between">
                            <button
                              className="text-slate-300 hover:text-white"
                              onClick={() => handleAngleChange(img.id, img.angle - 15)}
                            >
                              -
                            </button>
                            <span className="text-xs">{img.angle}°</span>
                            <button
                              className="text-slate-300 hover:text-white"
                              onClick={() => handleAngleChange(img.id, img.angle + 15)}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            className="absolute top-2 right-2 bg-slate-900/80 rounded-full p-1 text-slate-300 hover:text-white"
                            onClick={() => handleRemoveImage(img.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process button */}
                {images.length >= 2 && (
                  <div className="mt-6 text-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleProcessImages}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing... ({processingProgress.toFixed(0)}%)
                        </>
                      ) : (
                        <>
                          <RotateCw className="mr-2 h-4 w-4" />
                          Generate 3D Outputs
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
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Processing Results */}
      {(outputGif || output3DModel) && (
        <section id="processing-results" className="py-20 px-4 md:px-6 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your 3D Outputs</h2>
            <MultiAngleViewer images={images} gifUrl={outputGif} modelUrl={output3DModel} />
          </div>
        </section>
      )}
    </>
  )
}
