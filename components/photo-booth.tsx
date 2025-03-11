"use client"

import { useState, useEffect } from "react"
import { Camera } from "@/components/camera"
import { PhotoStrip } from "@/components/photo-strip"
import { FilterSelector } from "@/components/filter-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CameraOff, CameraIcon, CameraIcon as CameraLucide, Image, Trash2, Download, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Confetti } from "@/components/confetti"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export type FilterType =
  | "normal"
  | "grayscale"
  | "sepia"
  | "invert"
  | "blur"
  | "vintage"
  | "noir"
  | "blueprint"
  | "popart"

export default function PhotoBooth() {
  const [photos, setPhotos] = useState<string[]>([])
  const [currentFilter, setCurrentFilter] = useState<FilterType>("normal")
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(true)
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("camera")
  const [cameraActive, setCameraActive] = useState<boolean>(true)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [photoToRetake, setPhotoToRetake] = useState<number | null>(null)
  const [downloadFormat, setDownloadFormat] = useState<"jpeg" | "png">("jpeg")
  const [downloadQuality, setDownloadQuality] = useState<number>(0.9)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [manualCapture, setManualCapture] = useState(false)

  // Enhanced camera initialization
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false)
      setCameraActive(false)
      toast({
        title: "Camera not supported",
        description: "Your browser doesn't support camera access.",
        variant: "destructive",
      })
      return
    }

    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setIsCameraSupported(true)
        setIsCameraInitialized(true)
      })
      .catch(() => {
        setIsCameraSupported(false)
        setCameraActive(false)
        toast({
          title: "Camera access denied",
          description: "Please enable camera access to use the photo booth.",
          variant: "destructive",
        })
      })
  }, [toast])

  // Load photos from local storage
  useEffect(() => {
    const savedPhotos = localStorage.getItem("photobooth-photos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }
  }, [])

  // Save photos to local storage when updated
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem("photobooth-photos", JSON.stringify(photos))
    }
  }, [photos])

  // Save sound preference
  useEffect(() => {
    localStorage.setItem("photobooth-sound", soundEnabled.toString())
  }, [soundEnabled])

  const handleCapture = (photoData: string) => {
    if (photoToRetake !== null) {
      // Replace specific photo
      const newPhotos = [...photos]
      newPhotos[photoToRetake] = photoData
      setPhotos(newPhotos)
      setPhotoToRetake(null)
    } else {
      // Add new photo
      setPhotos((prev) => [...prev, photoData])
    }

    // If we have 4 photos, show confetti and switch to the strip tab
    if (photos.length === 3 && photoToRetake === null) {
      setTimeout(() => {
        setShowConfetti(true)
        setActiveTab("strip")
        toast({
          title: "Photo strip complete!",
          description: "All 4 photos captured. View your photo strip!",
        })
      }, 500)
    }
  }

  const startPhotoSequence = () => {
    if (photos.length >= 4 && photoToRetake === null) {
      // Reset if we already have 4 photos and not retaking
      setPhotos([])
    }

    setIsCapturing(true)
    toast({
      title: "Get ready!",
      description: "Taking photos in sequence...",
    })
  }

  const resetPhotos = () => {
    setPhotos([])
    setActiveTab("camera")
    setPhotoToRetake(null)
    toast({
      title: "Photos cleared",
      description: "Your photo strip has been reset.",
    })
  }

  const handleRetakePhoto = (index: number) => {
    setPhotoToRetake(index)
    setActiveTab("camera")
    toast({
      title: "Retaking photo",
      description: `Retaking photo ${index + 1}. Get ready!`,
    })
  }

  const toggleCamera = () => {
    setCameraActive(!cameraActive)
    if (!cameraActive) {
      toast({
        title: "Camera activated",
        description: "Camera is now turned on.",
      })
    } else {
      toast({
        title: "Camera deactivated",
        description: "Camera is now turned off.",
      })
    }
  }

  // Enhanced download function with better error handling
  const downloadPhotoStrip = async (template: string = 'classic') => {
    if (photos.length < 4) {
      toast({
        title: "Need more photos",
        description: `Take ${4 - photos.length} more photos to complete your strip.`,
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas context not available")

      // Adjust dimensions based on template
      let canvasWidth = 1200
      let canvasHeight = 3000
      let photoSpacing = 100
      let marginX = 100

      switch (template) {
        case 'modern':
          canvasWidth = 2000
          canvasHeight = 2000
          photoSpacing = 40
          marginX = 40
          break
        case 'polaroid':
          canvasWidth = 1600
          canvasHeight = 2400
          photoSpacing = 60
          marginX = 150
          break
        case 'vintage':
          // Sepia effect and aged paper texture
          canvasWidth = 1400
          canvasHeight = 2800
          photoSpacing = 80
          marginX = 120
          break
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Apply template-specific background
      switch (template) {
        case 'modern':
          // Modern gradient background
          const modernGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
          modernGradient.addColorStop(0, '#f8fafc')
          modernGradient.addColorStop(1, '#e2e8f0')
          ctx.fillStyle = modernGradient
          break
        case 'polaroid':
          // Pure white background
          ctx.fillStyle = '#ffffff'
          break
        case 'vintage':
          // Aged paper texture
          ctx.fillStyle = '#f5e6d3'
          break
        default:
          // Classic white background
          ctx.fillStyle = '#ffffff'
      }
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Add template-specific header
      ctx.textAlign = 'center'
      if (template === 'vintage') {
        ctx.font = 'bold 72px "Playfair Display", serif'
        ctx.fillStyle = '#8b4513'
      } else if (template === 'modern') {
        ctx.font = 'bold 64px system-ui'
        ctx.fillStyle = '#1e293b'
      } else {
        ctx.font = 'bold 60px system-ui'
        ctx.fillStyle = '#0f172a'
      }
      ctx.fillText('SNAPBOOTH', canvasWidth / 2, 100)

      // Date styling
      const now = new Date()
      if (template === 'vintage') {
        ctx.font = '400 28px "Playfair Display", serif'
        ctx.fillStyle = '#8b4513'
      } else {
        ctx.font = '400 24px system-ui'
        ctx.fillStyle = '#64748b'
      }
      ctx.fillText(now.toLocaleDateString(), canvasWidth / 2, 140)

      // Load and draw photos with template-specific styling
      await Promise.all(photos.map(async (photoSrc, i) => {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img')
          img.onload = () => {
            const aspectRatio = img.width / img.height
            let photoWidth, photoHeight, x, y

            switch (template) {
              case 'modern':
                // 2x2 grid layout
                photoWidth = (canvasWidth - (marginX * 3)) / 2
                photoHeight = photoWidth / aspectRatio
                x = marginX + (i % 2) * (photoWidth + marginX)
                y = 200 + Math.floor(i / 2) * (photoHeight + photoSpacing)
                break
              case 'polaroid':
                // Polaroid style with thick borders
                photoWidth = canvasWidth - (marginX * 2)
                photoHeight = photoWidth / aspectRatio
                x = marginX
                y = 200 + (i * (photoHeight + photoSpacing + 80)) // Extra space for polaroid border
                // Draw polaroid frame
                ctx.fillStyle = '#ffffff'
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
                ctx.shadowBlur = 20
                ctx.shadowOffsetY = 10
                ctx.fillRect(x - 40, y - 40, photoWidth + 80, photoHeight + 120)
                ctx.shadowColor = 'transparent'
                break
              case 'vintage':
                // Vintage style with sepia effect
                photoWidth = canvasWidth - (marginX * 2)
                photoHeight = photoWidth / aspectRatio
                x = marginX
                y = 200 + (i * (photoHeight + photoSpacing))
                // Apply sepia effect
                ctx.filter = 'sepia(0.5)'
                break
              default:
                // Classic vertical layout
                photoWidth = canvasWidth - (marginX * 2)
                photoHeight = photoWidth / aspectRatio
                x = marginX
                y = 200 + (i * (photoHeight + photoSpacing))
            }

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight)
            ctx.filter = 'none' // Reset filter

            // Add template-specific decorations
            if (template === 'polaroid') {
              // Add polaroid caption area
              ctx.fillStyle = '#64748b'
              ctx.font = '400 24px "Permanent Marker", cursive'
              ctx.fillText(`Photo ${i + 1}`, x + photoWidth / 2, y + photoHeight + 60)
            }

            resolve(null)
          }
          img.onerror = reject
          img.src = photoSrc
        })
      }))

      // Convert to high-quality JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 1.0)
      
      // Create download link
      const link = document.createElement('a')
      const timestamp = now.toISOString().split('T')[0]
      link.download = `snapbooth-${template}-${timestamp}.jpg`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download successful!",
        description: "Your photo strip has been saved.",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: "There was an error creating your photo strip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Enhanced delete functionality
  const handleDelete = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
    localStorage.setItem("photobooth-photos", JSON.stringify(newPhotos))
    
    toast({
      title: "Photo deleted",
      description: "The selected photo has been removed.",
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="camera" className="relative">
                <div className="flex items-center gap-2">
                  <CameraIcon className="h-4 w-4" />
                  <span>Camera</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="strip" className="relative">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Photos ({photos.length}/4)</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Switch
                id="sound-mode"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
              <Button
                variant={cameraActive ? "outline" : "destructive"}
                size="icon"
                onClick={toggleCamera}
                className="transition-all duration-200"
              >
                {cameraActive ? (
                  <CameraIcon className="h-4 w-4" />
                ) : (
                  <CameraOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="camera" className="mt-0">
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Camera section */}
                      <div className="lg:col-span-8">
                        <div className="relative aspect-video">
                          <Camera
                            onCapture={handleCapture}
                            filter={currentFilter}
                            isCapturing={isCapturing}
                            setIsCapturing={setIsCapturing}
                            photoCount={photos.length}
                            cameraActive={cameraActive}
                            soundEnabled={soundEnabled}
                            isRetaking={photoToRetake !== null}
                            manualCapture={manualCapture}
                          />
                        </div>
                      </div>

                      {/* Controls section */}
                      <div className="lg:col-span-4 p-6 bg-gray-50 dark:bg-gray-900/50">
                        <div className="space-y-6">
                          {/* Filter and controls */}
                          <div className="space-y-4">
                            <FilterSelector currentFilter={currentFilter} onChange={setCurrentFilter} />
                            
                            <div className="flex flex-col gap-4">
                              {/* Camera controls */}
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Camera Controls</Label>
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="sound-toggle" className="text-sm">Sound</Label>
                                          <Switch
                                            id="sound-toggle"
                                            checked={soundEnabled}
                                            onCheckedChange={setSoundEnabled}
                                            className="data-[state=checked]:bg-blue-600"
                                          />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {soundEnabled ? 'Disable' : 'Enable'} sound effects
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="manual-capture" className="text-sm">Manual Capture</Label>
                                          <Switch
                                            id="manual-capture"
                                            checked={manualCapture}
                                            onCheckedChange={setManualCapture}
                                          />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {manualCapture ? 'Auto' : 'Manual'} capture mode
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <Button
                                    onClick={startPhotoSequence}
                                    disabled={isCapturing || !cameraActive}
                                    className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                                  >
                                    {isCapturing ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Capturing...
                                      </>
                                    ) : (
                                      <>
                                        <CameraIcon className="h-4 w-4 mr-2" />
                                        {photoToRetake !== null ? "Retake Photo" : 
                                         photos.length < 4 ? "Take Photos" : "New Strip"}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Capture mode */}
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Capture Mode</Label>
                                <Switch
                                  id="manual-capture"
                                  checked={manualCapture}
                                  onCheckedChange={setManualCapture}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Preview section */}
                          {photos.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Preview ({photos.length}/4)</h3>
                                {photos.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetPhotos}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[...Array(4)].map((_, index) => (
                                  <div key={index} className="relative aspect-[4/3] group">
                                    {photos[index] ? (
                                      <>
                                        <img
                                          src={photos[index]}
                                          alt={`Photo ${index + 1}`}
                                          className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-800"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRetakePhoto(index)}
                                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                                          >
                                            <CameraIcon className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(index)}
                                            className="h-8 w-8 text-red-400 hover:text-red-400 hover:bg-red-400/20"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full rounded-md border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                        <span className="text-sm text-gray-400 dark:text-gray-600">
                                          Photo {index + 1}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="strip" className="mt-0">
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-6">
                    <PhotoStrip
                      photos={photos}
                      onDownload={downloadPhotoStrip}
                      onReset={resetPhotos}
                      onRetake={handleRetakePhoto}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}
