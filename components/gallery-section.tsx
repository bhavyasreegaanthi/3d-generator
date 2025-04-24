"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Play, Pause } from "lucide-react"

export default function GallerySection() {
  return (
    <section className="py-20 px-4 md:px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Animation Gallery</h2>

        <Tabs defaultValue="wave" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="wave">Wave Function</TabsTrigger>
            <TabsTrigger value="spiral">Spiral Plot</TabsTrigger>
            <TabsTrigger value="lorenz">Lorenz Attractor</TabsTrigger>
          </TabsList>

          <TabsContent value="wave" className="mt-0">
            <AnimationCard
              title="Wave Function Animation"
              description="This animation shows how a wave function evolves over time, with changing frequency and amplitude parameters."
              imageUrl="/placeholder.svg?height=400&width=600"
              pythonCode={`import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D

# Create figure and 3D axis
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Create data points
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)

# Animation function
def animate(i):
    ax.clear()
    freq = 1.0 + 0.1 * i
    Z = np.sin(np.sqrt(X**2 + Y**2) * freq)
    surf = ax.plot_surface(X, Y, Z, cmap='viridis')
    ax.set_zlim(-1.5, 1.5)
    return surf,

# Create animation
ani = FuncAnimation(fig, animate, frames=50, interval=100)
ani.save('wave_animation.gif', writer='pillow', fps=10)
plt.close()`}
            />
          </TabsContent>

          <TabsContent value="spiral" className="mt-0">
            <AnimationCard
              title="3D Spiral Animation"
              description="A beautiful 3D spiral that rotates and changes colors, demonstrating parametric equations in 3D space."
              imageUrl="/placeholder.svg?height=400&width=600"
              pythonCode={`import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D

# Create figure and 3D axis
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Animation function
def animate(i):
    ax.clear()
    t = np.linspace(0, 20 + i/5, 1000)
    x = np.cos(t)
    y = np.sin(t)
    z = t/3
    
    # Color points according to their position
    colors = plt.cm.viridis(t/max(t))
    
    ax.scatter(x, y, z, c=colors, s=10)
    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    ax.set_zlim(0, 10)
    ax.view_init(elev=30, azim=i*4)
    
    return ax,

# Create animation
ani = FuncAnimation(fig, animate, frames=90, interval=50)
ani.save('spiral_animation.gif', writer='pillow', fps=15)
plt.close()`}
            />
          </TabsContent>

          <TabsContent value="lorenz" className="mt-0">
            <AnimationCard
              title="Lorenz Attractor"
              description="The famous Lorenz attractor, a set of chaotic solutions to the Lorenz system which is a system of ordinary differential equations."
              imageUrl="/placeholder.svg?height=400&width=600"
              pythonCode={`import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D
from scipy.integrate import solve_ivp

# Lorenz system parameters
sigma = 10
beta = 8/3
rho = 28

# Lorenz system equations
def lorenz_system(t, xyz):
    x, y, z = xyz
    dx_dt = sigma * (y - x)
    dy_dt = x * (rho - z) - y
    dz_dt = x * y - beta * z
    return [dx_dt, dy_dt, dz_dt]

# Initial conditions
initial = [0.1, 0.1, 0.1]
t_span = [0, 40]
t_eval = np.linspace(t_span[0], t_span[1], 4000)

# Solve the system
solution = solve_ivp(lorenz_system, t_span, initial, t_eval=t_eval)
x, y, z = solution.y

# Create figure and 3D axis
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Animation function
def animate(i):
    ax.clear()
    # Plot a segment of the solution
    segment_length = 500
    start_idx = i * 20
    end_idx = min(start_idx + segment_length, len(x))
    
    points = ax.scatter(
        x[start_idx:end_idx], 
        y[start_idx:end_idx], 
        z[start_idx:end_idx],
        c=np.arange(end_idx-start_idx),
        cmap='plasma',
        s=2
    )
    
    ax.set_xlim(-25, 25)
    ax.set_ylim(-35, 35)
    ax.set_zlim(0, 50)
    ax.view_init(elev=30, azim=i)
    
    return points,

# Create animation
ani = FuncAnimation(fig, animate, frames=180, interval=50)
ani.save('lorenz_animation.gif', writer='pillow', fps=30)
plt.close()`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function AnimationCard({ title, description, imageUrl, pythonCode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // Safe event handling
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Add animation control logic here when implemented
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            <img
              src={imageUrl || "/placeholder.svg?height=400&width=600"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button size="sm" variant="secondary" className="rounded-full h-10 w-10 p-0" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full h-10 w-10 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>

        <div>
          <Button variant="outline" onClick={() => setShowCode(!showCode)} className="mb-4">
            {showCode ? "Hide Python Code" : "Show Python Code"}
          </Button>

          {showCode && (
            <div className="bg-slate-900 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm text-purple-400">
                <code>{pythonCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

