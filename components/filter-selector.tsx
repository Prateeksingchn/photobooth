"use client"

import type { FilterType } from "@/components/photo-booth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface FilterSelectorProps {
  currentFilter: FilterType
  onChange: (filter: FilterType) => void
}

export function FilterSelector({ currentFilter, onChange }: FilterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const filters: { value: FilterType; label: string; category: "basic" | "advanced" }[] = [
    { value: "normal", label: "Normal", category: "basic" },
    { value: "grayscale", label: "Grayscale", category: "basic" },
    { value: "sepia", label: "Sepia", category: "basic" },
    { value: "invert", label: "Invert", category: "basic" },
    { value: "blur", label: "Blur", category: "basic" },
    { value: "vintage", label: "Vintage", category: "advanced" },
    { value: "noir", label: "Film Noir", category: "advanced" },
    { value: "blueprint", label: "Blueprint", category: "advanced" },
    { value: "popart", label: "Pop Art", category: "advanced" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] relative overflow-hidden">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="absolute left-3">
            <Paintbrush className="h-4 w-4" />
          </motion.div>
          <span className="ml-6 capitalize">{currentFilter} Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        {filters
          .filter((f) => f.category === "basic")
          .map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => {
                onChange(filter.value)
                setIsOpen(false)
              }}
              className={`${currentFilter === filter.value ? "bg-muted" : ""} cursor-pointer`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 filter-preview filter-preview-${filter.value}`} />
              {filter.label}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-xs text-muted-foreground">Advanced Filters</div>

        {filters
          .filter((f) => f.category === "advanced")
          .map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => {
                onChange(filter.value)
                setIsOpen(false)
              }}
              className={`${currentFilter === filter.value ? "bg-muted" : ""} cursor-pointer`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 filter-preview filter-preview-${filter.value}`} />
              {filter.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

