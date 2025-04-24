"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export default function CodeShowcase() {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Code Showcase</h2>

        <p className="text-center text-slate-300 max-w-3xl mx-auto mb-12">
          Explore the Python code behind these visualizations. Learn how to create your own 3D plots and animations
          using Matplotlib and NumPy.
        </p>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="basic">Basic Plot</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-0">
            <CodeExample
              title="Basic 3D Surface Plot"
              description="Create a simple 3D surface plot using Matplotlib's plot_surface function."
              code={`import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Create a new figure and a 3D axis
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Create data points
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

# Create the surface plot
surf = ax.plot_surface(X, Y, Z, cmap='viridis', edgecolor='none')

# Add a color bar
fig.colorbar(surf, ax=ax, shrink=0.5, aspect=5)

# Set labels and title
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
ax.set_title('3D Surface Plot of sin(sqrt(x² + y²))')

# Show the plot
plt.show()

# Save the figure
plt.savefig('3d_surface_plot.png', dpi=300, bbox_inches='tight')`}
              explanation={[
                "We start by importing NumPy for numerical operations and Matplotlib for plotting.",
                "The 'projection='3d'' parameter creates a 3D axis.",
                "We create a grid of x and y values using np.meshgrid.",
                "The Z values are calculated using the sine of the distance from the origin.",
                "plot_surface() creates the 3D surface with the viridis colormap.",
                "We add labels, a title, and a colorbar to make the plot more informative.",
                "Finally, we display and save the plot as a high-resolution PNG file.",
              ]}
            />
          </TabsContent>

          <TabsContent value="advanced" className="mt-0">
            <CodeExample
              title="Advanced 3D Visualization"
              description="Create a more complex 3D visualization with custom colormaps and multiple plot elements."
              code={`import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D

# Create a new figure with a custom size
fig = plt.figure(figsize=(12, 10))
ax = fig.add_subplot(111, projection='3d')

# Create a more complex function
def complex_function(x, y):
    return np.sin(x) * np.cos(y) * np.exp(-np.sqrt(x**2 + y**2) / 5)

# Create data points with higher resolution
x = np.linspace(-10, 10, 100)
y = np.linspace(-10, 10, 100)
X, Y = np.meshgrid(x, y)
Z = complex_function(X, Y)

# Create the surface plot with a custom colormap
surf = ax.plot_surface(
    X, Y, Z, 
    cmap=cm.plasma,
    linewidth=0,
    antialiased=True,
    alpha=0.8
)

# Add contour lines on the bottom of the plot
ax.contour(
    X, Y, Z,
    zdir='z',
    offset=Z.min() - 0.5,
    cmap=cm.plasma,
    linestyles="solid",
    linewidths=2
)

# Add scatter points at local maxima
from scipy.signal import find_peaks
max_indices = []
for i in range(Z.shape[0]):
    peaks, _ = find_peaks(Z[i, :])
    for j in peaks:
        max_indices.append((i, j))

for i, j in max_indices:
    ax.scatter(X[i, j], Y[i, j], Z[i, j], color='white', s=50, edgecolor='black')

# Customize the view
ax.view_init(elev=35, azim=45)
ax.dist = 11

# Set labels and title with custom fonts
ax.set_xlabel('X axis', fontsize=12, labelpad=10)
ax.set_ylabel('Y axis', fontsize=12, labelpad=10)
ax.set_zlabel('Z axis', fontsize=12, labelpad=10)
ax.set_title('Advanced 3D Visualization', fontsize=16, pad=20)

# Add a color bar with custom settings
cbar = fig.colorbar(surf, ax=ax, shrink=0.7, aspect=10, pad=0.1)
cbar.set_label('Function Value', fontsize=12, rotation=270, labelpad=20)

# Adjust the plot limits
ax.set_xlim(-10, 10)
ax.set_ylim(-10, 10)
ax.set_zlim(Z.min() - 0.5, Z.max() + 0.5)

# Add a grid
ax.grid(True, linestyle='--', alpha=0.6)

# Save the figure with high resolution
plt.savefig('advanced_3d_plot.png', dpi=300, bbox_inches='tight')

# Show the plot
plt.tight_layout()
plt.show()`}
              explanation={[
                "We define a more complex function that combines sine, cosine, and an exponential decay.",
                "We use a higher resolution grid (100x100) for smoother visualization.",
                "The plot_surface() function creates the main 3D surface with the plasma colormap and transparency.",
                "We add contour lines at the bottom of the plot for additional perspective.",
                "Using scipy.signal.find_peaks, we identify local maxima and mark them with white scatter points.",
                "We customize the viewing angle with view_init() and dist parameters.",
                "The colorbar, labels, and title are styled with custom fonts and positioning.",
                "Finally, we add a grid and save the high-resolution output.",
              ]}
            />
          </TabsContent>

          <TabsContent value="animation" className="mt-0">
            <CodeExample
              title="Creating 3D Animations"
              description="Learn how to create animated 3D visualizations using Matplotlib's animation module."
              code={`import numpy as np
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
    
    # Changing parameters over time
    frequency = 0.5 + i * 0.1
    amplitude = 1.0 + 0.5 * np.sin(i * 0.1)
    
    # Calculate Z values with changing parameters
    Z = amplitude * np.sin(frequency * np.sqrt(X**2 + Y**2))
    
    # Create the surface plot
    surf = ax.plot_surface(X, Y, Z, cmap='viridis', edgecolor='none')
    
    # Set consistent axis limits
    ax.set_xlim(-5, 5)
    ax.set_ylim(-5, 5)
    ax.set_zlim(-2, 2)
    
    # Add labels and title with current parameters
    ax.set_xlabel('X axis')
    ax.set_ylabel('Y axis')
    ax.set_zlabel('Z axis')
    ax.set_title(f'Animated 3D Surface (f={frequency:.1f}, a={amplitude:.1f})')
    
    # Rotate view for each frame
    ax.view_init(elev=30, azim=i)
    
    return [surf]

# Create animation
frames = 100
ani = FuncAnimation(fig, animate, frames=frames, interval=50, blit=True)

# Save the animation as a GIF
from matplotlib.animation import PillowWriter
writer = PillowWriter(fps=20)
ani.save('3d_animation.gif', writer=writer)

# To display in a Jupyter notebook
# from IPython.display import HTML
# HTML(ani.to_jshtml())

# For regular Python scripts, use plt.show() to display the animation
plt.show()`}
              explanation={[
                "We create a figure with a 3D axis just like in static plots.",
                "The key to animation is the animate() function that updates the plot for each frame.",
                "Inside this function, we clear the previous frame and redraw the surface with new parameters.",
                "We use changing frequency and amplitude parameters based on the frame number.",
                "The view_init() method rotates the view for each frame to create a more dynamic animation.",
                "FuncAnimation() creates the animation by repeatedly calling our animate function.",
                "We save the animation as a GIF using the PillowWriter.",
                "For Jupyter notebooks, you can display the animation using HTML and to_jshtml().",
                "For regular Python scripts, plt.show() will display the animation in a window.",
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function CodeExample({ title, description, code, explanation }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <pre className="language-python p-4 overflow-auto max-h-[600px] text-sm">
              <code>{code}</code>
            </pre>
            <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-slate-300 mb-6">{description}</p>
        </div>

        <div>
          <h4 className="text-xl font-medium mb-4">Code Explanation</h4>
          <ol className="space-y-2 list-decimal list-inside text-slate-300">
            {explanation.map((item, index) => (
              <li key={index} className="pl-2">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

