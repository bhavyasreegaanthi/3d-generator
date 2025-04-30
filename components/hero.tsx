"use client"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  return (
    <section className="h-screen relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>

      <div className="z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          3D Image Generator
        </h1>
        <p className="text-lg md:text-xl mb-8 text-slate-300">
          Upload images from multiple angles and get a 3D rotating view and model
        </p>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-purple-500 text-white hover:bg-purple-500/20"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }}
        >
          Get Started <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
