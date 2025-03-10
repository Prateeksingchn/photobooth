import PhotoBooth from "@/components/photo-booth"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PhotoBoothPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <main className="min-h-screen flex flex-col bg-background">
        <header className="border-b bg-background/80 backdrop-blur-sm py-4 sticky top-0 z-10">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">PhotoBooth</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 container py-8">
          <PhotoBooth />
        </div>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <div className="container">Built with Next.js 15 and TailwindCSS</div>
        </footer>
      </main>
    </ThemeProvider>
  )
} 