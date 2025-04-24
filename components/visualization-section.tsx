"use client"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function VisualizationSection() {
  const [amplitude, setAmplitude] = useState(0.3)
  const [frequency, setFrequency] = useState(3)
  const [showGrid, setShowGrid] = useState(true)
  const [colorMap, setColorMap] = useState("rainbow")

  return (
    <section id="visualization" className="py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Interactive 3D Visualization</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800 rounded-xl overflow-hidden h-[500px]">
            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Environment preset="night" />
              <WavyFunction amplitude={amplitude} frequency={frequency} showGrid={showGrid} colorMap={colorMap} />
              <OrbitControls />
              {showGrid && <gridHelper args={[10, 10, "#444", "#222"]} />}
            </Canvas>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-4">Visualization Controls</h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="amplitude">Amplitude: {amplitude.toFixed(2)}</Label>
                    </div>
                    <Slider
                      id="amplitude"
                      min={0.1}
                      max={1}
                      step={0.01}
                      value={[amplitude]}
                      onValueChange={(value) => setAmplitude(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="frequency">Frequency: {frequency.toFixed(1)}</Label>
                    </div>
                    <Slider
                      id="frequency"
                      min={0.5}
                      max={10}
                      step={0.1}
                      value={[frequency]}
                      onValueChange={(value) => setFrequency(value[0])}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid">Show Grid</Label>
                    <Switch id="grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colormap">Color Map</Label>
                    <Select value={colorMap} onValueChange={setColorMap}>
                      <SelectTrigger id="colormap" className="w-full">
                        <SelectValue placeholder="Select a color map" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rainbow">Rainbow</SelectItem>
                        <SelectItem value="viridis">Viridis</SelectItem>
                        <SelectItem value="plasma">Plasma</SelectItem>
                        <SelectItem value="magma">Magma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download Visualization
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium mb-2">About This Visualization</h3>
                <p className="text-slate-300">
                  This 3D visualization demonstrates a wave function where the height (y-value) is determined by the
                  distance from the origin using the formula:
                </p>
                <div className="bg-slate-900 p-3 rounded-md my-2 text-center">
                  <code className="text-purple-400">y = amplitude * sin(frequency * sqrt(x² + z²))</code>
                </div>
                <p className="text-slate-300">
                  Adjust the controls to see how different parameters affect the visualization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function WavyFunction({ amplitude, frequency, showGrid, colorMap }) {
  // Color mapping functions
  const getColor = (x, z, y) => {
    const value = (y / amplitude + 1) / 2 // Normalize to 0-1

    switch (colorMap) {
      case "viridis":
        return `hsl(${280 - value * 280}, 70%, ${20 + value * 60}%)`
      case "plasma":
        return `hsl(${300 - value * 260}, 85%, ${20 + value * 60}%)`
      case "magma":
        return `hsl(${340 - value * 300}, 80%, ${10 + value * 70}%)`
      case "rainbow":
      default:
        return `hsl(${value * 360}, 70%, 60%)`
    }
  }

  return (
    <mesh>
      {Array.from({ length: 20 }).map((_, i) =>
        Array.from({ length: 20 }).map((_, j) => {
          const x = (i - 10) * 0.2
          const z = (j - 10) * 0.2
          const y = amplitude * Math.sin(frequency * Math.sqrt(x * x + z * z))

          return (
            <mesh key={`${i}-${j}`} position={[x, y, z]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color={getColor(x, z, y)} emissive={getColor(x, z, y)} emissiveIntensity={0.3} />
            </mesh>
          )
        }),
      )}
    </mesh>
  )
}

