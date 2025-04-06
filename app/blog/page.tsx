"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
}

// Добавляем эту строку для поддержки статического экспорта
export const dynamic = "force-static"

export default function BlogListPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Изменяем URL для запроса списка статей
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/blog-posts")

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error("Ошибка при загрузке статей:", err)
        setError("Не удалось загрузить статьи. Пожалуйста, попробуйте позже.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 bg-gray-900 p-4 rounded-lg border-2 border-gray-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Блог продуктового менеджера</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться на карту
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 rounded-lg border-2 border-gray-700">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-400">Загрузка статей...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-gray-900 rounded-lg border-2 border-gray-700">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
              Вернуться на главную
            </Button>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-gray-700"
              >
                <Link href={`/blog/${post.id}`} className="block">
                  <h2 className="text-xl font-bold mb-2 text-white hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>
                  <time className="text-sm text-gray-400 mb-3 block">{formatDate(post.date)}</time>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="text-purple-400 font-medium">Читать далее →</div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900 rounded-lg border-2 border-gray-700">
            <p className="text-gray-400 mb-4">Статьи не найдены</p>
            <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
              Вернуться на главную
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

