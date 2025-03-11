"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import type { FilterType } from "@/components/photo-booth"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CameraIcon, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface CameraProps {
  onCapture: (photoData: string) => void
  filter: FilterType
  isCapturing: boolean
  setIsCapturing: (isCapturing: boolean) => void
  photoCount: number
  cameraActive: boolean
  soundEnabled: boolean
  isRetaking: boolean
  manualCapture?: boolean
}

export function Camera({
  onCapture,
  filter,
  isCapturing,
  setIsCapturing,
  photoCount,
  cameraActive,
  soundEnabled,
  isRetaking,
  manualCapture = false,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { toast } = useToast()
  const [isReady, setIsReady] = useState(true)

  // Initialize camera
  useEffect(() => {
    async function setupCamera() {
      if (!cameraActive) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }
        return
      }

      setIsLoading(true)

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          setStream(mediaStream)
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupCamera()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraActive, toast])

  // Add capture cooldown
  const captureWithCooldown = useCallback(async () => {
    if (!isReady || !videoRef.current || !canvasRef.current) return

    setIsReady(false)
    await capturePhoto()
    
    // Add cooldown between captures
    setTimeout(() => {
      setIsReady(true)
    }, 1500) // 1.5 second cooldown
  }, [isReady])

  // Improved photo capture sequence
  useEffect(() => {
    if (!isCapturing || !cameraActive) return

    let timeoutId: NodeJS.Timeout

    const captureSequence = async () => {
      if (photoCount >= 4 && !isRetaking) {
        setIsCapturing(false)
        return
      }

      setCountdown(3)

      // Countdown timer
      for (let i = 3; i > 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCountdown(i - 1)
      }

      await captureWithCooldown()

      // Continue sequence if not in manual mode
      if (!manualCapture && photoCount < 3) {
        timeoutId = setTimeout(captureSequence, 2000)
      } else {
        setIsCapturing(false)
      }
    }

    captureSequence()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isCapturing, photoCount, cameraActive, manualCapture, isRetaking])

  // Keyboard shortcut for capturing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isCapturing && cameraActive) {
        e.preventDefault()
        setIsCapturing(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCapturing, setIsCapturing, cameraActive])

  const capturePhoto = useCallback(() => {
    if (!isReady || !videoRef.current || !canvasRef.current || !cameraActive) return

    setIsReady(false) // Prevent multiple captures

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video aspect ratio
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Apply filter
    applyFilter(context, canvas, filter)

    // Show processing animation
    setIsProcessing(true)

    // Capture sound and flash effect
    if (soundEnabled) {
      const captureSound = new Audio("/camera-shutter.mp3")
      captureSound.play().catch(console.error)
    }

    // Flash effect
    const flashElement = document.createElement("div")
    flashElement.className = "fixed inset-0 bg-white opacity-80 z-50"
    document.body.appendChild(flashElement)

    setTimeout(() => {
      document.body.removeChild(flashElement)
      setIsProcessing(false)

      const photoData = canvas.toDataURL("image/jpeg", 1.0)
      onCapture(photoData)

      // Reset ready state after a delay
      setTimeout(() => {
        setIsReady(true)
      }, 1000) // 1-second cooldown between captures
    }, 150)
  }, [cameraActive, filter, onCapture, soundEnabled])

  // Handle manual capture
  const handleManualCapture = () => {
    if (!isCapturing && manualCapture) {
      capturePhoto()
    }
  }

  const applyFilter = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, filter: FilterType) => {
    const width = canvas.width
    const height = canvas.height
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data

    switch (filter) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
        break
      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
        }
        break
      case "invert":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]
          data[i + 1] = 255 - data[i + 1]
          data[i + 2] = 255 - data[i + 2]
        }
        break
      case "blur":
        context.filter = "blur(5px)"
        context.drawImage(canvas, 0, 0)
        context.filter = "none"
        return
      case "vintage":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          data[i] = Math.min(255, r * 0.9 + g * 0.05 + b * 0.05)
          data[i + 1] = Math.min(255, r * 0.1 + g * 0.8 + b * 0.1)
          data[i + 2] = Math.min(255, r * 0.1 + g * 0.1 + b * 0.7)
        }
        break
      case "noir":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          const contrast = 1.5
          const newVal = (avg - 128) * contrast + 128
          data[i] = newVal
          data[i + 1] = newVal
          data[i + 2] = newVal
        }
        break
      case "blueprint":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 0
          data[i + 1] = 0
          data[i + 2] = Math.min(255, data[i + 2] * 1.5)
        }
        break
      case "popart":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Divide into quadrants for pop art effect
          const x = (i / 4) % width
          const y = Math.floor(i / 4 / width)

          if (x < width / 2 && y < height / 2) {
            // Top left - red emphasis
            data[i] = Math.min(255, r * 1.5)
            data[i + 1] = g * 0.5
            data[i + 2] = b * 0.5
          } else if (x >= width / 2 && y < height / 2) {
            // Top right - blue emphasis
            data[i] = r * 0.5
            data[i + 1] = g * 0.5
            data[i + 2] = Math.min(255, b * 1.5)
          } else if (x < width / 2 && y >= height / 2) {
            // Bottom left - green emphasis
            data[i] = r * 0.5
            data[i + 1] = Math.min(255, g * 1.5)
            data[i + 2] = b * 0.5
          } else {
            // Bottom right - yellow emphasis
            data[i] = Math.min(255, r * 1.2)
            data[i + 1] = Math.min(255, g * 1.2)
            data[i + 2] = b * 0.5
          }
        }
        break
      case "normal":
      default:
        return
    }

    context.putImageData(imageData, 0, 0)
  }

  return (
    <div className="relative">
      <Card className={`overflow-hidden aspect-video relative ${filter !== "normal" ? `filter-${filter}` : ""}`}>
        <AnimatePresence mode="wait">
          {!cameraActive ? (
            <motion.div
              key="camera-off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm"
            >
              <div className="text-center p-6 rounded-lg">
                <CameraIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Camera is turned off</h3>
                <p className="mt-2 text-sm text-muted-foreground">Enable the camera to take photos</p>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Initializing camera...</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${getVideoFilterClass(filter)}`}
        />

        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"
            >
              <div className="text-center">
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="text-7xl font-bold"
                >
                  {countdown}
                </motion.div>
                <div className="mt-4 w-32 mx-auto">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 text-white"
            >
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Processing photo...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!stream && cameraActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <CameraIcon className="h-12 w-12 mx-auto" />
              <p className="mt-2">Camera not available</p>
            </div>
          </div>
        )}
      </Card>

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />

      {manualCapture && (
        <Button
          onClick={handleManualCapture}
          disabled={!isReady || isProcessing}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white"
        >
          <CameraIcon className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

function getVideoFilterClass(filter: FilterType): string {
  switch (filter) {
    case "grayscale":
      return "grayscale"
    case "sepia":
      return "sepia"
    case "invert":
      return "invert"
    case "blur":
      return "blur-sm"
    case "vintage":
      return "vintage"
    case "noir":
      return "noir"
    case "blueprint":
      return "blueprint"
    case "popart":
      return "popart"
    default:
      return ""
  }
}
