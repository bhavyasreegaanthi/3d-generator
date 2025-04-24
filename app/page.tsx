import Hero from "@/components/hero"
import ImageUploader from "@/components/image-uploader"
import ResultsGallery from "@/components/results-gallery"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <Hero />
      <ImageUploader />
      <ResultsGallery />
    </main>
  )
}

