"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { Loader2 } from "lucide-react"

interface BlogPostDialogProps {
  postId: string | null
  onClose: () => void
}

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
}

export function BlogPostDialog({ postId, onClose }: BlogPostDialogProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/blog/${postId}`)

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()
        setPost(data)
      } catch (err) {
        console.error("Ошибка при загрузке статьи:", err)
        setError("Не удалось загрузить статью. Пожалуйста, попробуйте позже.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  // Форматирование даты
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <Dialog open={!!postId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-2 sm:border-4 border-gray-700 p-2 sm:p-4 rounded-lg max-w-4xl w-[95vw] mx-auto max-h-[80vh] overflow-hidden pixel-corners">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="mt-2 text-sm text-gray-400">Загрузка статьи...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </div>
        ) : post ? (
          <>
            <div className="flex justify-between items-start mb-2">
              <DialogTitle className="text-sm sm:text-lg text-purple-400 font-['Press_Start_2P',monospace]">
                {post.title}
              </DialogTitle>
              <span className="text-[8px] sm:text-xs text-gray-400 font-['Press_Start_2P',monospace]">
                {formatDate(post.date)}
              </span>
            </div>

            <div className="overflow-y-auto pr-1 sm:pr-2" style={{ maxHeight: "calc(80vh - 120px)" }}>
              <div className="prose prose-invert max-w-none font-['Press_Start_2P',monospace] leading-relaxed text-[7px] xs:text-[9px] sm:text-xs">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-purple-400 text-xs sm:text-lg mb-2 sm:mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-green-400 text-[10px] sm:text-base mb-1 sm:mb-3" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-blue-400 text-[8px] sm:text-sm mb-1 sm:mb-2" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className="text-yellow-400 text-[7px] sm:text-xs mb-1 sm:mb-2" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="mb-2 sm:mb-4" {...props} />,
                    ul: ({ node, ...props }) => (
                      <ul className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 list-disc pl-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 list-decimal pl-4" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-[8px] sm:text-xs py-1 sm:py-2 font-['Press_Start_2P',monospace] pixel-corners mt-2"
            >
              Закрыть
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Статья не найдена</p>
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

