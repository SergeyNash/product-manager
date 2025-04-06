"use client"

import { useState } from "react"

interface Skill {
  id: string
  name: string
  icon: string
  level: number
  description: string
}

export function SkillInventory() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const skills: Skill[] = [
    {
      id: "agile-sword",
      name: "Меч Agile",
      icon: "⚔️",
      level: 85,
      description:
        "Мастерство методологий Scrum и Kanban. Позволяет эффективно управлять спринтами и повышать производительность команды.",
    },
    {
      id: "data-shield",
      name: "Щит Data-Driven",
      icon: "🛡️",
      level: 75,
      description:
        "Защита от необоснованных решений с помощью аналитики и метрик. Позволяет принимать решения на основе данных.",
    },
    {
      id: "roadmap-book",
      name: "Книга Roadmap",
      icon: "📕",
      level: 90,
      description:
        "Древние знания стратегического планирования. Позволяет создавать четкие и реалистичные дорожные карты продукта.",
    },
    {
      id: "ux-wand",
      name: "Жезл UX",
      icon: "🪄",
      level: 70,
      description:
        "Магический артефакт для создания удобных интерфейсов. Позволяет понимать потребности пользователей и создавать интуитивно понятные продукты.",
    },
    {
      id: "communication-amulet",
      name: "Амулет Коммуникации",
      icon: "📿",
      level: 95,
      description:
        "Усиливает способность к эффективному общению с разными отделами. Незаменим для кросс-функционального взаимодействия.",
    },
    {
      id: "analytics-potion",
      name: "Зелье Аналитики",
      icon: "🧪",
      level: 80,
      description:
        "Позволяет видеть скрытые паттерны в данных. Повышает способность к анализу метрик и принятию решений.",
    },
  ]

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-gray-900 border-2 sm:border-4 border-gray-700 rounded-lg p-3 sm:p-6 max-w-4xl mx-auto">
        <h2 className="text-base sm:text-xl text-yellow-400 mb-3 sm:mb-6 text-center">Инвентарь навыков</h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-gray-800 border-2 border-gray-600 rounded-lg p-2 sm:p-3 cursor-pointer hover:border-yellow-400 transition-colors"
              onClick={() => handleSkillClick(skill)}
            >
              <div className="flex items-center mb-1 sm:mb-2">
                <span className="text-xl sm:text-2xl mr-1 sm:mr-2">{skill.icon}</span>
                <span className="text-[10px] sm:text-sm">{skill.name}</span>
              </div>

              {/* Skill level bar */}
              <div className="w-full h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <div className="text-right text-[8px] sm:text-xs mt-0.5 sm:mt-1 text-gray-400">{skill.level}/100</div>
            </div>
          ))}
        </div>

        {/* Skill details */}
        {selectedSkill && (
          <div className="mt-4 sm:mt-8 bg-gray-800 border-2 border-gray-600 rounded-lg p-2 sm:p-4">
            <div className="flex items-center mb-2 sm:mb-4">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{selectedSkill.icon}</span>
              <div>
                <h3 className="text-base sm:text-lg text-green-400">{selectedSkill.name}</h3>
                <div className="flex items-center mt-0.5 sm:mt-1">
                  <div className="w-24 sm:w-32 h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${selectedSkill.level}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] sm:text-xs ml-1 sm:ml-2 text-gray-400">
                    Ур. {Math.floor(selectedSkill.level / 10)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-sm text-gray-300">{selectedSkill.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

