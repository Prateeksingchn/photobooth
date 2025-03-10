"use client"

import { useState, useEffect } from "react"
import { Camera } from "@/components/camera"
import { PhotoStrip } from "@/components/photo-strip"
import { FilterSelector } from "@/components/filter-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CameraOff, CameraIcon, CameraIcon as CameraLucide, Image, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Confetti } from "@/components/confetti"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Check if camera is supported
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false)
      toast({
        title: "Camera not supported",
        description: "Your browser doesn't support camera access.",
        variant: "destructive",
      })
    }

    // Load photos from local storage
    const savedPhotos = localStorage.getItem("photobooth-photos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }

    // Load sound preference
    const soundPref = localStorage.getItem("photobooth-sound")
    if (soundPref !== null) {
      setSoundEnabled(soundPref === "true")
    }
  }, [toast])

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

  const downloadPhotoStrip = () => {
    if (photos.length < 4) {
      toast({
        title: "Not enough photos",
        description: "Take 4 photos to create a photo strip.",
        variant: "destructive",
      })
      return
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Create a vertical strip with all 4 photos
    canvas.width = 800
    canvas.height = 1200

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add grain texture
    if (Math.random() > 0.5) {
      addGrainTexture(ctx, canvas.width, canvas.height)
    }

    // Add a title
    ctx.fillStyle = "black"
    ctx.font = "bold 40px Arial"
    ctx.textAlign = "center"
    ctx.fillText("PHOTOBOOTH MEMORIES", canvas.width / 2, 60)

    // Add date
    ctx.font = "30px Arial"
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 100)

    // Load and draw each photo
    const drawImages = async () => {
      for (let i = 0; i < 4; i++) {
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve) => {
          img.onload = () => {
            // Draw each photo with a small border
            ctx.strokeStyle = "#000"
            ctx.lineWidth = 5

            const y = 150 + i * 260
            ctx.strokeRect(100, y, 600, 225)
            ctx.drawImage(img, 100, y, 600, 225)
            resolve(null)
          }
          img.src = photos[i]
        })
      }

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/jpeg")
      const link = document.createElement("a")
      link.download = `photobooth-${Date.now()}.jpg`
      link.href = dataUrl
      link.click()

      toast({
        title: "Download started",
        description: "Your photo strip is being downloaded.",
      })
    }

    drawImages()
  }

  const addGrainTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 10 - 5
      data[i] = Math.min(255, Math.max(0, data[i] + noise))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
    }

    ctx.putImageData(imageData, 0, 0)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="camera" className="relative overflow-hidden">
              <div className="flex items-center">
                <CameraLucide className="mr-2 h-4 w-4" />
                Camera
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-primary"
                initial={{ width: 0 }}
                animate={{ width: activeTab === "camera" ? "100%" : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
            <TabsTrigger value="strip" className="relative overflow-hidden">
              <div className="flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Photo Strip ({photos.length}/4)
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-primary"
                initial={{ width: 0 }}
                animate={{ width: activeTab === "strip" ? "100%" : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch id="sound-mode" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    <Label htmlFor="sound-mode" className="sr-only">
                      Sound
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{soundEnabled ? "Disable" : "Enable"} sound effects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleCamera}
                    className={
                      !cameraActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
                    }
                  >
                    {cameraActive ? <CameraIcon className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{cameraActive ? "Stop" : "Start"} camera</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              <Card className="overflow-hidden border-2">
                <CardContent className="p-6">
                  {isCameraSupported ? (
                    <div className="space-y-4">
                      <Camera
                        onCapture={handleCapture}
                        filter={currentFilter}
                        isCapturing={isCapturing}
                        setIsCapturing={setIsCapturing}
                        photoCount={photos.length}
                        cameraActive={cameraActive}
                        soundEnabled={soundEnabled}
                        isRetaking={photoToRetake !== null}
                      />

                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <FilterSelector currentFilter={currentFilter} onChange={setCurrentFilter} />

                        <div className="flex-1 flex justify-end">
                          {isMobile ? (
                            <Button
                              onClick={startPhotoSequence}
                              disabled={isCapturing || !cameraActive}
                              size="lg"
                              className="w-full sm:w-auto"
                            >
                              {photoToRetake !== null
                                ? "Retake Photo"
                                : photos.length < 4
                                  ? "Take Photos"
                                  : "New Strip"}
                            </Button>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={startPhotoSequence}
                                    disabled={isCapturing || !cameraActive}
                                    size="lg"
                                    className="relative overflow-hidden"
                                  >
                                    <span className="relative z-10">
                                      {photoToRetake !== null
                                        ? "Retake Photo"
                                        : photos.length < 4
                                          ? "Take Photos"
                                          : "New Strip"}
                                    </span>
                                    <motion.div
                                      className="absolute inset-0 bg-primary/20"
                                      initial={{ x: "-100%" }}
                                      whileHover={{ x: 0 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Press Space to capture</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      {photos.length > 0 && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-medium mb-2">Preview ({photos.length}/4)</h3>
                          <div className="flex overflow-x-auto gap-2 pb-2 filmstrip">
                            {photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`Photo ${index + 1}`}
                                  className="h-24 object-cover rounded-md border border-border transition-all duration-200 group-hover:border-primary"
                                />
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRetakePhoto(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            {Array.from({ length: Math.max(0, 4 - photos.length) }).map((_, index) => (
                              <div
                                key={`empty-${index}`}
                                className="h-24 w-32 bg-muted/50 rounded-md border border-dashed border-muted-foreground/20 flex items-center justify-center"
                              >
                                <span className="text-muted-foreground text-xs">Empty</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CameraOff className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Camera Not Available</h3>
                      <p className="mt-2 text-muted-foreground">
                        Your browser doesn't support camera access or permission was denied.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strip" className="mt-0">
              <Card className="overflow-hidden border-2">
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

      {/* Floating action button for mobile */}
      {isMobile && activeTab === "camera" && (
        <motion.div
          className="fixed bottom-6 right-6 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={startPhotoSequence}
            disabled={isCapturing || !cameraActive}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <CameraIcon className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
