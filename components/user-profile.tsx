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
          {/* Смайл в очках вместо пиксельной иконки */}
          <div className="w-12 h-12 relative pixel-corners bg-yellow-500 flex items-center justify-center overflow-hidden border-2 border-yellow-600">
            <span className="text-2xl">😎</span>
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
        <DialogContent className="bg-gray-900 border-4 border-gray-700 text-white max-w-5xl max-h-[85vh] overflow-y-auto pixel-corners">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 text-xl font-['Press_Start_2P',monospace]">Биография</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Фото по ссылке */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-xs aspect-square relative pixel-corners overflow-hidden border-4 border-gray-700">
                  <Image src="https://clck.ru/3KSaGT" alt="Сергей" fill className="object-cover" />
                </div>
                <div className="mt-4 bg-gray-800 p-3 w-full max-w-xs pixel-corners border-2 border-gray-700">
                  <h3 className="text-green-400 text-sm mb-2 font-['Press_Start_2P',monospace]">Характеристики:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Продуктовость:</div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "90%" }}></div>
                    </div>
                    <div>Коммуникация:</div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "85%" }}></div>
                    </div>
                    <div>Аналитика:</div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "80%" }}></div>
                    </div>
                    <div>Стратегия:</div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Текст биографии */}
              <div className="md:col-span-2 prose prose-invert max-w-none font-['Press_Start_2P',monospace] leading-relaxed text-sm">
                <ReactMarkdown>{biography}</ReactMarkdown>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

