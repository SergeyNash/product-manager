"use client"

import { useState } from "react"

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
}

export function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const achievements: Achievement[] = [
    {
      id: "mvp-master",
      name: "Повелитель MVP",
      icon: "🚀",
      description:
        "Успешно запустил 5 минимально жизнеспособных продуктов, которые превратились в полноценные решения.",
      rarity: "epic",
      unlocked: true,
    },
    {
      id: "deadline-savior",
      name: "Спаситель дедлайнов",
      icon: "⏰",
      description: "Завершил 10 проектов точно в срок, несмотря на все препятствия и изменения требований.",
      rarity: "rare",
      unlocked: true,
    },
    {
      id: "communication-wizard",
      name: "Маг коммуникации",
      icon: "🔮",
      description: "Наладил эффективное взаимодействие ме��ду 5 разными отделами, говорящими на разных «языках».",
      rarity: "legendary",
      unlocked: true,
    },
    {
      id: "user-whisperer",
      name: "Заклинатель пользователей",
      icon: "👂",
      description:
        "Собрал и проанализировал отзывы от 1000+ пользователей, превратив их в конкретные улучшения продукта.",
      rarity: "epic",
      unlocked: true,
    },
    {
      id: "metric-hunter",
      name: "Охотник за метриками",
      icon: "📊",
      description: "Увеличил ключевые показатели эффективности на 40% за счет тщательного анализа данных.",
      rarity: "rare",
      unlocked: true,
    },
    {
      id: "feature-architect",
      name: "Архитектор функций",
      icon: "🏗️",
      description: "Спроектировал и реализовал 3 инновационные функции, которые стали отличительной чертой продукта.",
      rarity: "epic",
      unlocked: true,
    },
    {
      id: "bug-slayer",
      name: "Истребитель багов",
      icon: "🐞",
      description: "Выявил и устранил 100+ критических ошибок до того, как они достигли пользователей.",
      rarity: "common",
      unlocked: true,
    },
    {
      id: "market-navigator",
      name: "Навигатор рынка",
      icon: "🧭",
      description: "Успешно вывел продукт на 3 новых рынка, адаптировав его под локальные потребности.",
      rarity: "legendary",
      unlocked: false,
    },
    {
      id: "team-leader",
      name: "Лидер команды",
      icon: "👑",
      description: "Руководил командой из 10+ человек, обеспечивая высокую мотивацию и результативность.",
      rarity: "epic",
      unlocked: true,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-800"
      case "rare":
        return "border-blue-400 bg-blue-900"
      case "epic":
        return "border-purple-400 bg-purple-900"
      case "legendary":
        return "border-yellow-400 bg-yellow-900"
      default:
        return "border-gray-400 bg-gray-800"
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Обычный"
      case "rare":
        return "Редкий"
      case "epic":
        return "Эпический"
      case "legendary":
        return "Легендарный"
      default:
        return "Обычный"
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-gray-900 border-2 sm:border-4 border-gray-700 rounded-lg p-3 sm:p-6 max-w-4xl mx-auto">
        <h2 className="text-base sm:text-xl text-yellow-400 mb-3 sm:mb-6 text-center">Таблица достижений</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${getRarityColor(achievement.rarity)} ${!achievement.unlocked ? "opacity-50 grayscale" : ""}`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{achievement.icon}</span>
                <span className="text-[8px] sm:text-xs">{achievement.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement details */}
        {selectedAchievement && (
          <div className={`mt-4 sm:mt-8 border-2 rounded-lg p-2 sm:p-4 ${getRarityColor(selectedAchievement.rarity)}`}>
            <div className="flex items-center mb-2 sm:mb-4">
              <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">{selectedAchievement.icon}</span>
              <div>
                <h3 className="text-base sm:text-lg font-bold">{selectedAchievement.name}</h3>
                <span
                  className={`text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded ${
                    selectedAchievement.rarity === "legendary"
                      ? "bg-yellow-600"
                      : selectedAchievement.rarity === "epic"
                        ? "bg-purple-600"
                        : selectedAchievement.rarity === "rare"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                  }`}
                >
                  {getRarityText(selectedAchievement.rarity)}
                </span>
              </div>
            </div>

            <p className="text-[10px] sm:text-sm">{selectedAchievement.description}</p>

            {!selectedAchievement.unlocked && (
              <div className="mt-2 sm:mt-4 text-[10px] sm:text-sm text-gray-400 border-t border-gray-700 pt-1 sm:pt-2">
                Это достижение еще не разблокировано.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

