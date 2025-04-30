import Hero from "@/components/hero"
import MultiAngleUploader from "@/components/multi-angle-uploader"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <Hero />
      <MultiAngleUploader />
    </main>
  )
}
