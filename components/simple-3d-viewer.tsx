"use client"
import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

export default function Simple3DViewer({ imageUrl }) {
  const canvasRef = useRef()
  const [isLoaded, setIsLoaded] = useState(false)

  // Simple plane with the image as texture
  const ImagePlane = () => {
    const textureRef = useRef()

    useEffect(() => {
      // Create a new image element
      const img = new Image()
      img.crossOrigin = "Anonymous"

      // Set up load event
      img.onload = () => {
        if (textureRef.current) {
          textureRef.current.image = img
          textureRef.current.needsUpdate = true
          setIsLoaded(true)
        }
      }

      // Set the source
      img.src = imageUrl || "/placeholder.svg?height=800&width=800"

      return () => {
        img.onload = null
      }
    }, [imageUrl])

    return (
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial>
          <canvasTexture ref={textureRef} attach="map" />
        </meshStandardMaterial>
      </mesh>
    )
  }

  return (
    <div className="w-full h-full">
      <Canvas ref={canvasRef} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="sunset" />
        <ImagePlane />
        <OrbitControls autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  )
}
