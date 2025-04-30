// Helper functions to process images and generate 3D views

// Function to create a canvas element with the image
const createImageCanvas = async (imageUrl: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Create canvas with the same dimensions as the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw image on canvas
      ctx.drawImage(img, 0, 0)

      resolve(canvas)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = imageUrl
  })
}

// Function to generate a rotating GIF from an image
const generateGif = async (canvas: HTMLCanvasElement): Promise<string> => {
  // In a real implementation, we would use a library like gif.js
  // For now, we'll create a simple animation using canvas
  const frames: string[] = []
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  // Generate 36 frames (10 degrees rotation each)
  for (let i = 0; i < 36; i++) {
    const frameCanvas = document.createElement("canvas")
    frameCanvas.width = canvas.width
    frameCanvas.height = canvas.height
    const frameCtx = frameCanvas.getContext("2d")

    if (!frameCtx) {
      throw new Error("Could not get frame canvas context")
    }

    // Clear the canvas
    frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height)

    // Save the context state
    frameCtx.save()

    // Translate to center, rotate, and translate back
    frameCtx.translate(frameCanvas.width / 2, frameCanvas.height / 2)
    frameCtx.rotate((i * 10 * Math.PI) / 180)
    frameCtx.translate(-frameCanvas.width / 2, -frameCanvas.height / 2)

    // Draw the image
    frameCtx.drawImage(canvas, 0, 0)

    // Restore the context state
    frameCtx.restore()

    // Add frame to array
    frames.push(frameCanvas.toDataURL("image/jpeg", 0.8))
  }

  // In a real implementation, we would convert these frames to a GIF
  // For now, we'll just return the first frame
  return frames[0]
}

// Function to generate multiple angles of the image
const generateMultiAngleViews = async (canvas: HTMLCanvasElement): Promise<string[]> => {
  const angles: string[] = []
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  // Generate 8 angles (45 degrees apart)
  for (let i = 0; i < 8; i++) {
    const angleCanvas = document.createElement("canvas")
    angleCanvas.width = canvas.width
    angleCanvas.height = canvas.height
    const angleCtx = angleCanvas.getContext("2d")

    if (!angleCtx) {
      throw new Error("Could not get angle canvas context")
    }

    // Clear the canvas
    angleCtx.clearRect(0, 0, angleCanvas.width, angleCanvas.height)

    // Save the context state
    angleCtx.save()

    // Translate to center, rotate, and translate back
    angleCtx.translate(angleCanvas.width / 2, angleCanvas.height / 2)
    angleCtx.rotate((i * 45 * Math.PI) / 180)
    angleCtx.translate(-angleCanvas.width / 2, -angleCanvas.height / 2)

    // Draw the image
    angleCtx.drawImage(canvas, 0, 0)

    // Restore the context state
    angleCtx.restore()

    // Add angle to array
    angles.push(angleCanvas.toDataURL("image/jpeg", 0.8))
  }

  return angles
}

// Main function to generate all 3D rotating views
export const generateRotatingViews = async (file: File, previewUrl: string) => {
  try {
    // Create canvas with the image
    const canvas = await createImageCanvas(previewUrl)

    // Generate GIF
    const gif = await generateGif(canvas)

    // Generate multi-angle views
    const angles = await generateMultiAngleViews(canvas)

    // Return results
    return {
      gif,
      mp4: gif, // In a real implementation, we would generate an MP4 as well
      angles,
      anglesZip: "#", // In a real implementation, we would create a ZIP file
      model: {
        obj: "#",
        mtl: "#",
        texture: previewUrl,
      },
      originalImage: previewUrl,
    }
  } catch (error) {
    console.error("Error generating rotating views:", error)
    throw error
  }
}

// Function to download a data URL as a file
export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to download multiple files as a ZIP
export const downloadFilesAsZip = (files: { data: string; name: string }[]) => {
  // In a real implementation, we would use a library like JSZip
  // For now, we'll just download the first file
  if (files.length > 0) {
    downloadDataUrl(files[0].data, files[0].name)
  }
}
