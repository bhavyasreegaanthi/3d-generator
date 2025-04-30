"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Download, Play, Pause, RotateCw, RotateCcw } from "lucide-react"

export default function AI360Viewer({ views, originalImage }: { views: string[]; originalImage: string | null }) {
  const [activeTab, setActiveTab] = useState("interactive")
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)

  // Start/stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      startAnimation()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, playbackSpeed])

  // Animation function
  const startAnimation = () => {
    lastUpdateTimeRef.current = performance.now()

    const animate = (time: number) => {
      const elapsed = time - lastUpdateTimeRef.current

      // Update angle based on elapsed time and playback speed
      // Aim for roughly 30 degrees per second at speed 1
      if (elapsed > 1000 / (30 * playbackSpeed)) {
        setCurrentAngle((prev) => (prev + 1) % views.length)
        lastUpdateTimeRef.current = time
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Get the current view based on angle
  const getCurrentView = () => {
    return views[currentAngle] || views[0]
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <Tabs defaultValue="interactive" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="interactive">Interactive View</TabsTrigger>
            <TabsTrigger value="comparison">Before & After</TabsTrigger>
            <TabsTrigger value="all-angles">All Angles</TabsTrigger>
          </TabsList>

          {/* Interactive 360° View */}
          <TabsContent value="interactive" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative">
                <img
                  src={getCurrentView() || "/placeholder.svg"}
                  alt={`View at ${currentAngle * 10}°`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                  Angle: {currentAngle * 10}°
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Interactive 360° View</h3>
                  <p className="text-slate-300">
                    This is an AI-generated 360° view of your object. The AI has analyzed your single front view image
                    and predicted what your object would look like from all angles.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Rotation Controls</h4>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setCurrentAngle((prev) => (prev - 1 + views.length) % views.length)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setCurrentAngle((prev) => (prev + 1) % views.length)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Angle: {currentAngle * 10}°</span>
                      <span className="text-sm text-slate-400">Speed: {playbackSpeed.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[currentAngle]}
                      min={0}
                      max={views.length - 1}
                      step={1}
                      onValueChange={(value) => {
                        setCurrentAngle(value[0])
                        if (isPlaying) setIsPlaying(false)
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0°</span>
                      <span>90°</span>
                      <span>180°</span>
                      <span>270°</span>
                      <span>350°</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Playback Speed</span>
                    </div>
                    <Slider
                      value={[playbackSpeed]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => setPlaybackSpeed(value[0])}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
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
          </TabsContent>

          {/* Before & After Comparison */}
          <TabsContent value="comparison" className="mt-0">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Before & After Comparison</h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  See how our AI transformed your single front view image into a complete 360° model
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-medium text-center">Original Input Image</h4>
                  <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                    <img
                      src={originalImage || "/placeholder.svg"}
                      alt="Original Input"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center text-slate-400">
                    <p>Single front view provided by you</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-medium text-center">AI-Generated 360° View</h4>
                  <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative">
                    <img
                      src={getCurrentView() || "/placeholder.svg"}
                      alt={`View at ${currentAngle * 10}°`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                      Angle: {currentAngle * 10}°
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-slate-400">
                    <p>Complete 360° view generated by AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-lg">
                <h4 className="text-lg font-medium mb-4">How It Works</h4>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>Our AI analyzes the structure and features of your input image</li>
                  <li>It creates a 3D model by estimating depth and volume</li>
                  <li>The model is textured using details from your original image</li>
                  <li>Multiple views are rendered from different angles around the object</li>
                  <li>The result is a complete 360° visualization from a single image</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          {/* All Angles View */}
          <TabsContent value="all-angles" className="mt-0">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">All Generated Angles</h3>
                <p className="text-slate-300 max-w-2xl mx-auto">View all the different angles generated by our AI</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {views
                  .filter((_, i) => i % 3 === 0)
                  .map((view, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                        <img
                          src={view || "/placeholder.svg"}
                          alt={`View at ${index * 30}°`}
                          className="w-full h-full object-cover"
                          onClick={() => {
                            setCurrentAngle(index * 3)
                            setActiveTab("interactive")
                          }}
                        />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 text-center py-1 px-2 rounded text-xs">
                        {index * 30}°
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download All Angles (ZIP)
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
