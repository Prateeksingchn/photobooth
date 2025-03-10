import type { Metadata } from "next"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Next.js Photobooth - Create Amazing Photos",
  description: "A modern photobooth application built with Next.js 15 - Capture, customize, and share your moments",
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <main className="min-h-screen flex flex-col bg-background">
        <header className="border-b bg-background/80 backdrop-blur-sm py-4 sticky top-0 z-10">
          <div className="container flex items-center justify-between">
            <h1 className="text-2xl font-bold">Next.js Photobooth</h1>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex-1 container py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Capture Your Moments in Style
            </h2>
            <p className="text-xl text-muted-foreground">
              Create stunning photos with our modern photo booth application. 
              Easy to use, fun to share, and completely free.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/photobooth" 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Photo Booth
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">Easy to Use</h3>
                <p className="mt-2 text-muted-foreground">Simple interface for capturing perfect shots</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">Instant Preview</h3>
                <p className="mt-2 text-muted-foreground">See your photos immediately after capture</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">Share Instantly</h3>
                <p className="mt-2 text-muted-foreground">Download and share your photos easily</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <div className="container">Built with Next.js 15 and TailwindCSS</div>
        </footer>
      </main>
    </ThemeProvider>
  )
}
