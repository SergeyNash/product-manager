import type { MetadataRoute } from "next"

// Добавляем эту строку для поддержки статического экспорта
export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Продуктовый менеджер - Карта профессионального пути",
    short_name: "PM Hero",
    description: "Интерактивное портфолио продуктового менеджера в стиле пиксельной RPG игры",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

