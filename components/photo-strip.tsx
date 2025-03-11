"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Pencil, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PhotoStripProps {
  photos: string[]
  onDownload: (template: string) => void
  onReset: () => void
  onRetake: (index: number) => void
}

export function PhotoStrip({ photos, onDownload, onReset, onRetake }: PhotoStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic")
  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const templates = [
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
    { id: "vintage", name: "Vintage" },
    { id: "polaroid", name: "Polaroid" },
  ]

  useEffect(() => {
    // Render the photo strip preview
    if (containerRef.current && photos.length > 0) {
      setIsRendering(true)

      setTimeout(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Clear previous content
        container.innerHTML = ""

        // Create the photo strip preview
        const stripContainer = document.createElement("div")
        stripContainer.className = `bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto ${getTemplateClass(selectedTemplate)}`

        // Add title
        const title = document.createElement("h3")
        title.className = "text-center font-bold text-xl mb-2"
        title.textContent = "PHOTOBOOTH MEMORIES"
        stripContainer.appendChild(title)

        // Add date
        const date = document.createElement("p")
        date.className = "text-center text-sm text-gray-500 mb-4"
        date.textContent = new Date().toLocaleDateString()
        stripContainer.appendChild(date)

        // Add photos
        const photoGrid = document.createElement("div")
        photoGrid.className = getPhotoGridClass(selectedTemplate)

        photos.forEach((photo, index) => {
          if (index < 4) {
            const photoContainer = document.createElement("div")
            photoContainer.className = "relative"

            const photoElement = document.createElement("img")
            photoElement.src = photo
            photoElement.className = getPhotoClass(selectedTemplate)
            photoElement.alt = `Photo ${index + 1}`

            photoContainer.appendChild(photoElement)
            photoGrid.appendChild(photoContainer)
          }
        })

        stripContainer.appendChild(photoGrid)
        container.appendChild(stripContainer)
        setIsRendering(false)
      }, 300)
    }
  }, [photos, selectedTemplate])

  const getTemplateClass = (template: string): string => {
    switch (template) {
      case "modern":
        return "bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      case "vintage":
        return "bg-amber-50 border border-amber-200 p-5"
      case "polaroid":
        return "bg-white border-8 border-white shadow-xl"
      case "classic":
      default:
        return ""
    }
  }

  const getPhotoGridClass = (template: string): string => {
    switch (template) {
      case "modern":
        return "grid grid-cols-2 gap-3"
      case "vintage":
        return "space-y-4"
      case "polaroid":
        return "grid grid-cols-2 gap-4"
      case "classic":
      default:
        return "space-y-2"
    }
  }

  const getPhotoClass = (template: string): string => {
    switch (template) {
      case "modern":
        return "w-full h-auto rounded-lg border border-gray-200 shadow-sm"
      case "vintage":
        return "w-full h-auto rounded border-2 border-amber-100 shadow-sm sepia-[0.2]"
      case "polaroid":
        return "w-full h-auto border-b-[20px] border-white shadow-sm"
      case "classic":
      default:
        return "w-full h-auto rounded border border-gray-200"
    }
  }

  const handleDownload = () => {
    onDownload(selectedTemplate)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Photo Strip</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onReset} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Strip
          </Button>
          <Button onClick={handleDownload} disabled={photos.length < 4 || isDownloading}>
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Strip
              </>
            )}
          </Button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No Photos Yet</h3>
          <p className="text-muted-foreground mt-2">Take some photos to create your photo strip!</p>
        </div>
      ) : photos.length < 4 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">Photo Strip Incomplete</h3>
          <p className="text-muted-foreground mt-2">
            Take {4 - photos.length} more photo{4 - photos.length > 1 ? "s" : ""} to complete your strip!
          </p>
          <div className="flex overflow-x-auto gap-2 p-4 justify-center">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  className="h-24 object-cover rounded-md border"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRetake(index)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {Array.from({ length: 4 - photos.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="h-24 w-32 bg-muted rounded-md border flex items-center justify-center"
              >
                <span className="text-muted-foreground">Empty</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs defaultValue="classic" value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <TabsList className="grid grid-cols-4 mb-4">
              {templates.map((template) => (
                <TabsTrigger key={template.id} value={template.id}>
                  {template.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence>
              {isRendering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Developing photos...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              ref={containerRef}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Photo strip preview will be rendered here */}
            </motion.div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  className="aspect-[4/3] object-cover rounded-md border"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRetake(index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

