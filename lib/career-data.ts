import fs from "fs"
import path from "path"

export interface LocationAchievement {
  text: string
}

export interface CareerLocation {
  id: string
  name: string
  x: number
  y: number
  description: string
  achievements: string[]
  years: string
}

// Предварительно загруженные данные о локациях
const defaultLocations: CareerLocation[] = [
  {
    id: "startup-forest",
    name: "Ингосстрах",
    x: 20,
    y: 70,
    description:
      "Реализация нового сайта в качестве CPO/PM. 5 продуктовых команд + 1 платформенная команда, работа по SAFe, в SCRUM.",
    achievements: [
      "Запуск нового сайта",
      "Реализация страховых продуктов общим MAU 70 тыс",
      "Увеличение конверсии в онбординг на 50%",
      "Увеличение конверсии в оплату на 15%",
    ],
    years: "2021-2023",
  },
  {
    id: "corporate-castle",
    name: "Безопасная крепость",
    x: 40,
    y: 40,
    description: "Управление двумя продуктами для безопасной разработки. 5+ команд - стратегия и тактика.",
    achievements: [
      "Пересборка продуктовой стратегии в сложнейшем домене",
      "Обновление и перезепуск облачного сканера уязвимостей",
      "Внедрение культуры принятия решений на основе данных",
    ],
    years: "2023-настоящее время",
  },
  {
    id: "product-ocean",
    name: "Цифровая энергетика",
    x: 70,
    y: 60,
    description:
      "Управление продуктом в динамичной среде с постоянно меняющимися требованиями рынка. Разработка продуктовой стратегии и дорожной карты. Глубокое погружение в аналитику и метрики продукта.",
    achievements: [
      "Увеличение удержания пользователей на 35%",
      "Запуск 3 успешных фич",
      "Разработка системы метрик продукта",
      "Создание процесса приоритизации задач",
    ],
    years: "2019-2021",
  },
  {
    id: "innovation-mountains",
    name: "Горы продуктовых задач",
    x: 85,
    y: 25,
    description:
      "Исследование новых технологий и подходов к созданию продуктов. Экспериментирование с инновационными решениями и методологиями. Работа на передовой технологических трендов.",
    achievements: [
      "Внедрение AI в продукт",
      "Проведение 5+ технологических исследований",
      "Разработка концепции продукта следующего поколения",
    ],
    years: "2023-настоящее время",
  },
]

export async function getCareerLocations(): Promise<CareerLocation[]> {
  try {
    // Попытка прочитать файл
    const filePath = path.join(process.cwd(), "data", "career-locations.md")

    // Проверяем существование файла перед чтением
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      console.log("Файл career-locations.md не найден, используем данные по умолчанию")
      return defaultLocations
    }

    const fileContent = fs.readFileSync(filePath, "utf8")

    // Разделяем файл на секции по локациям (разделитель "---")
    const locationSections = fileContent.split("---").filter((section) => section.trim() !== "")

    const locations: CareerLocation[] = []

    // Координаты для каждой локации
    const coordinates = {
      "startup-forest": { x: 20, y: 70 },
      "corporate-castle": { x: 40, y: 40 },
      "product-ocean": { x: 70, y: 60 },
      "innovation-mountains": { x: 85, y: 25 },
    }

    // Парсим каждую секцию
    for (const section of locationSections) {
      const lines = section.trim().split("\n")

      // Извлекаем название (первая строка с # )
      const nameMatch = lines[0].match(/^# (.+)$/)
      if (!nameMatch) continue
      const name = nameMatch[1]

      // Извлекаем id (вторая строка с ## )
      const idMatch = lines[1].match(/^## (.+)$/)
      if (!idMatch) continue
      const id = idMatch[1]

      // Извлекаем годы (третья строка с ### )
      const yearsMatch = lines[2].match(/^### (.+)$/)
      if (!yearsMatch) continue
      const years = yearsMatch[1]

      // Извлекаем описание (все строки до #### Достижения)
      const descriptionLines: string[] = []
      let i = 3
      while (i < lines.length && !lines[i].startsWith("#### Достижения")) {
        if (lines[i].trim() !== "") {
          descriptionLines.push(lines[i])
        }
        i++
      }
      const description = descriptionLines.join(" ").trim()

      // Извлекаем достижения (все строки после #### Достижения)
      const achievements: string[] = []
      i++ // Пропускаем строку с заголовком достижений
      while (i < lines.length) {
        const achievementMatch = lines[i].match(/^- (.+)$/)
        if (achievementMatch) {
          achievements.push(achievementMatch[1])
        }
        i++
      }

      // Добавляем локацию с координатами
      if (id in coordinates) {
        locations.push({
          id,
          name,
          description,
          achievements,
          years,
          ...coordinates[id as keyof typeof coordinates],
        })
      }
    }

    return locations.length > 0 ? locations : defaultLocations
  } catch (error) {
    console.error("Ошибка при чтении файла career-locations.md:", error)
    // В случае ошибки возвращаем данные по умолчанию
    return defaultLocations
  }
}

