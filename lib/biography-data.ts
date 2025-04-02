import fs from "fs"
import path from "path"

export interface Biography {
  content: string
}

export async function getBiography(): Promise<Biography> {
  try {
    // Попытка прочитать файл
    const filePath = path.join(process.cwd(), "data", "biography.md")

    // Проверяем существование файла перед чтением
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      console.log("Файл biography.md не найден, используем данные по умолчанию")
      return {
        content:
          "# Сергей\n\nПродуктовый менеджер с опытом работы в технологической сфере.\n\nСпециализация: управление продуктом, аналитика, стратегическое планирование.",
      }
    }

    const content = fs.readFileSync(filePath, "utf8")
    return { content }
  } catch (error) {
    console.error("Ошибка при чтении файла biography.md:", error)
    // В случае ошибки возвращаем данные по умолчанию
    return {
      content:
        "# Сергей\n\nПродуктовый менеджер с опытом работы в технологической сфере.\n\nСпециализация: управление продуктом, аналитика, стратегическое планирование.",
    }
  }
}

