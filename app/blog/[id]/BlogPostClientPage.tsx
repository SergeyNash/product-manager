"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
}

export default function BlogPostClientPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/blog/${params.id}`)

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

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

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
    <div className="min-h-screen bg-gray-800">
      {/* Сетка для пиксельного эффекта */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6 bg-gray-900 border-gray-700 text-white hover:bg-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на карту
        </Button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-300">Загрузка статьи...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push("/")} className="bg-gray-900 hover:bg-gray-700">
              Вернуться на главную
            </Button>
          </div>
        ) : post ? (
          <article className="prose prose-lg dark:prose-invert max-w-none bg-gray-900 p-6 sm:p-8 rounded-lg border-2 border-gray-700 shadow-lg">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">{post.title}</h1>
              <time className="text-sm text-gray-400">{formatDate(post.date)}</time>
            </header>

            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-white" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-3 mb-2 text-white" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-300" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1 text-gray-300" {...props} />,
                  img: ({ node, ...props }) => (
                    <img className="my-6 rounded-lg shadow-md max-w-full h-auto" loading="lazy" {...props} />
                  ),
                  a: ({ node, ...props }) => <a className="text-purple-400 hover:underline" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-700 pl-4 italic my-4 text-gray-400" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="bg-gray-800 rounded px-1 py-0.5 text-sm" {...props} />
                    ) : (
                      <pre className="bg-gray-800 rounded p-4 overflow-x-auto my-4" {...props} />
                    ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="text-center py-20 bg-gray-900 p-6 rounded-lg border-2 border-gray-700">
            <p className="text-gray-400 mb-4">Статья не найдена</p>
            <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
              Вернуться на главную
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

