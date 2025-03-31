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

export async function getCareerLocations(): Promise<CareerLocation[]> {
  const filePath = path.join(process.cwd(), "data", "career-locations.md")
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

  return locations
}

