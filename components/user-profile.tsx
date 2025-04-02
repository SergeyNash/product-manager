"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"

export function UserProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [biography, setBiography] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleNameClick = async () => {
    setIsDialogOpen(true)

    if (!biography) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/biography")
        if (response.ok) {
          const data = await response.json()
          setBiography(data.content)
        } else {
          console.error("Ошибка при загрузке биографии:", response.statusText)
        }
      } catch (error) {
        console.error("Ошибка при загрузке биографии:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="flex items-center w-full">
        <div className="mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Сергей"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-sm text-yellow-400 font-bold cursor-pointer hover:underline" onClick={handleNameClick}>
            Сергей
          </h2>
          <div className="text-[10px] text-gray-300 mt-1">
            <span className="text-green-400">Product Master</span>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-4 border-gray-700 text-white max-w-3xl max-h-[80vh] overflow-y-auto pixel-corners">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 text-xl font-['Press_Start_2P',monospace]">Биография</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none font-['Press_Start_2P',monospace] leading-relaxed text-sm">
              <ReactMarkdown>{biography}</ReactMarkdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

