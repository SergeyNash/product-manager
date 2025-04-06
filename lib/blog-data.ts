import fs from "fs"
import path from "path"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  content: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "data", "blog-posts")

    // Проверяем существование директории
    if (!fs.existsSync(postsDirectory)) {
      console.log("Директория blog-posts не найдена, возвращаем пустой массив")
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)

    const posts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        // Получаем ID из имени файла
        const id = fileName.replace(/\.md$/, "")

        // Читаем содержимое файла
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")

        // Извлекаем заголовок из содержимого (первый заголовок H1)
        const titleMatch = fileContents.match(/^# (.+)$/m)
        const title = titleMatch ? titleMatch[1] : id

        // Извлекаем первый абзац как excerpt
        const excerptMatch = fileContents.match(/^(?:# .+\n+)?(?:## .+\n+)?(.+?)(?=\n\n|\n###|\n##|$)/s)
        const excerpt = excerptMatch ? excerptMatch[1].trim() : ""

        // Получаем дату из метаданных или используем дату модификации файла
        const stats = fs.statSync(fullPath)
        const date = stats.mtime.toISOString()

        return {
          id,
          title,
          excerpt,
          content: fileContents,
          date,
        }
      })
      // Сортируем по дате (новые сначала)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch (error) {
    console.error("Ошибка при чтении файлов блога:", error)
    return []
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const postsDirectory = path.join(process.cwd(), "data", "blog-posts")
    const fullPath = path.join(postsDirectory, `${id}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Извлекаем заголовок из содержимого (первый заголовок H1)
    const titleMatch = fileContents.match(/^# (.+)$/m)
    const title = titleMatch ? titleMatch[1] : id

    // Извлекаем первый абзац как excerpt
    const excerptMatch = fileContents.match(/^(?:# .+\n+)?(?:## .+\n+)?(.+?)(?=\n\n|\n###|\n##|$)/s)
    const excerpt = excerptMatch ? excerptMatch[1].trim() : ""

    // Получаем дату из метаданных или используем дату модификации файла
    const stats = fs.statSync(fullPath)
    const date = stats.mtime.toISOString()

    return {
      id,
      title,
      excerpt,
      content: fileContents,
      date,
    }
  } catch (error) {
    console.error(`Ошибка при чтении статьи ${id}:`, error)
    return null
  }
}

