"use client"

import { useState } from "react"
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
          {/* Аватар пользователя */}
          <div className="w-12 h-12 relative rounded-full bg-yellow-500 flex items-center justify-center overflow-hidden border-2 border-yellow-600">
            <span className="text-2xl">😎</span>
          </div>
        </div>
        <div>
          <h2
            className="text-[10px] sm:text-sm text-yellow-400 font-bold cursor-pointer hover:underline"
            onClick={handleNameClick}
          >
            Сергей
          </h2>
          <div className="text-[8px] sm:text-[10px] text-gray-300 mt-1">
            <span className="text-green-400">Product Master</span>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-2 sm:border-4 border-gray-700 text-white max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 text-sm sm:text-xl font-semibold">Биография</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-4 sm:py-8">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              {/* Фото по ссылке */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-xs aspect-square relative overflow-hidden rounded-lg border-2 sm:border-4 border-gray-700 shadow-lg">
                  <img
                    src="/images/profile.jpg"
                    alt="Сергей"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Если изображение не загрузилось, заменяем на placeholder
                      const target = e.target as HTMLImageElement
                      target.onerror = null // Предотвращаем бесконечный цикл
                      target.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                </div>
                <div className="mt-2 sm:mt-4 bg-gray-800 p-2 sm:p-3 w-full max-w-xs rounded-lg border-2 border-gray-700 shadow-md">
                  <h3 className="text-green-400 text-[10px] sm:text-sm mb-1 sm:mb-2 font-semibold">Характеристики:</h3>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[8px] sm:text-xs">
                    <div>Продуктовость:</div>
                    <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "90%" }}></div>
                    </div>
                    <div>Коммуникация:</div>
                    <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "85%" }}></div>
                    </div>
                    <div>Аналитика:</div>
                    <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "80%" }}></div>
                    </div>
                    <div>Стратегия:</div>
                    <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Текст биографии */}
              <div className="md:col-span-2 prose prose-invert max-w-none leading-relaxed text-[10px] sm:text-sm">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-yellow-400 text-sm sm:text-xl mb-2 sm:mb-4 font-semibold" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-green-400 text-xs sm:text-lg mb-1 sm:mb-3 font-semibold" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-blue-400 text-[10px] sm:text-base mb-1 sm:mb-2 font-semibold" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="mb-2 sm:mb-4" {...props} />,
                    ul: ({ node, ...props }) => (
                      <ul className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 list-disc pl-4" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="text-green-300 font-semibold" {...props} />,
                    em: ({ node, ...props }) => <em className="text-purple-300 italic" {...props} />,
                  }}
                >
                  {biography}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

