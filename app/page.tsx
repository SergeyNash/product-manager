"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MapLocation } from "@/components/map-location"
import { SkillInventory } from "@/components/skill-inventory"
import { Achievements } from "@/components/achievements"
import Contact from "@/components/contact"
import { GameCharacter } from "@/components/game-character"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import type { CareerLocation } from "@/lib/career-data"

// Предварительно загруженные данные о локациях (будут заменены на данные из API)
const defaultLocations: CareerLocation[] = [
  {
    id: "startup-forest",
    name: "Ингосстрах",
    x: 20,
    y: 70,
    description: "Ранние проекты с множеством технических сложностей и ограниченными ресурсами.",
    achievements: ["Запуск MVP", "Привлечение первых 100 пользователей"],
    years: "2018-2019",
  },
  {
    id: "corporate-castle",
    name: "Безопасная крепость",
    x: 40,
    y: 40,
    description: "Опыт работы в крупной компании с развитой командной структурой и сложными бизнес-процессами.",
    achievements: ["Управление командой из 5 человек", "Запуск продукта с 10,000+ пользователей"],
    years: "2019-2021",
  },
  {
    id: "product-ocean",
    name: "Продуктовый океан",
    x: 70,
    y: 60,
    description: "Управление продуктом в динамичной среде с постоянно меняющимися требованиями рынка.",
    achievements: ["Увеличение удержания пользователей на 35%", "Запуск 3 успешных фич"],
    years: "2021-настоящее время",
  },
  {
    id: "innovation-mountains",
    name: "Горы инноваций",
    x: 85,
    y: 25,
    description: "Исследование новых технологий и подходов к созданию продуктов.",
    achievements: ["Внедрение AI в продукт", "Создание инновационной системы аналитики"],
    years: "2022-2023",
  },
]

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("map")
  const router = useRouter()
  const [locations, setLocations] = useState<CareerLocation[]>(defaultLocations)

  // Character position state
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 })

  // Ref для отслеживания ближайшей локации
  const nearestLocationRef = useRef<string | null>(null)

  // Ref для отслеживания нажатых клавиш
  const keysPressed = useRef<Set<string>>(new Set())

  // Загрузка данных о локациях
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/career-locations")
        if (response.ok) {
          const data = await response.json()
          setLocations(data)
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных о локациях:", error)
      }
    }

    fetchLocations()
  }, [])

  // Обработка нажатий клавиш для перемещения персонажа
  useEffect(() => {
    if (activeSection !== "map") return

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code)

      // Пробел для входа в локацию
      if (e.code === "Space" && nearestLocationRef.current) {
        const location = locations.find((loc) => loc.id === nearestLocationRef.current)
        if (location) {
          handleLocationClick(location.id, location.x, location.y)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Анимация движения персонажа
    const moveInterval = setInterval(() => {
      if (keysPressed.current.size === 0) return

      let newX = characterPosition.x
      let newY = characterPosition.y
      const speed = 2 // Скорость перемещения

      if (keysPressed.current.has("ArrowUp")) {
        newY = Math.max(5, newY - speed)
      }
      if (keysPressed.current.has("ArrowDown")) {
        newY = Math.min(95, newY + speed)
      }
      if (keysPressed.current.has("ArrowLeft")) {
        newX = Math.max(5, newX - speed)
      }
      if (keysPressed.current.has("ArrowRight")) {
        newX = Math.min(95, newX + speed)
      }

      if (newX !== characterPosition.x || newY !== characterPosition.y) {
        setCharacterPosition({ x: newX, y: newY })
      }
    }, 50)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearInterval(moveInterval)
    }
  }, [activeSection, characterPosition, locations])

  // Определение ближайшей локации
  useEffect(() => {
    if (activeSection !== "map") return

    // Находим ближайшую локацию
    let minDistance = Number.POSITIVE_INFINITY
    let nearestLocation = null

    for (const location of locations) {
      const dx = location.x - characterPosition.x
      const dy = location.y - characterPosition.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        nearestLocation = location.id
      }
    }

    // Если персонаж находится достаточно близко к локации
    if (minDistance < 10) {
      nearestLocationRef.current = nearestLocation
    } else {
      nearestLocationRef.current = null
    }
  }, [activeSection, characterPosition, locations])

  const handleLocationClick = (locationId: string, x: number, y: number) => {
    // Animate character movement
    setCharacterPosition({ x, y })

    // Open location dialog
    setTimeout(() => {
      setCurrentLocation(locationId)
    }, 500)
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P',monospace] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-gray-700 p-2 z-40">
        <div className="flex justify-around max-w-3xl mx-auto">
          <button
            className={`px-3 py-2 ${activeSection === "map" ? "bg-blue-600" : "bg-gray-800"} rounded text-xs`}
            onClick={() => handleSectionChange("map")}
          >
            Карта пути
          </button>
          <button
            className={`px-3 py-2 ${activeSection === "skills" ? "bg-green-600" : "bg-gray-800"} rounded text-xs`}
            onClick={() => handleSectionChange("skills")}
          >
            Навыки
          </button>
          <button
            className={`px-3 py-2 ${activeSection === "achievements" ? "bg-yellow-600" : "bg-gray-800"} rounded text-xs`}
            onClick={() => handleSectionChange("achievements")}
          >
            Достижения
          </button>
          <button
            className={`px-3 py-2 ${activeSection === "contact" ? "bg-red-600" : "bg-gray-800"} rounded text-xs`}
            onClick={() => handleSectionChange("contact")}
          >
            Контакты
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-8 pb-20">
        {/* Map Section */}
        {activeSection === "map" && (
          <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Фон карты с текстурой */}
            <div className="absolute inset-0 bg-gray-900">
              {/* Сетка для пиксельного эффекта */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                  linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
                `,
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Декоративные элементы фона */}
              <div className="absolute top-[10%] left-[15%] w-16 h-16 bg-gray-800 rounded-lg opacity-30 transform rotate-12"></div>
              <div className="absolute bottom-[20%] right-[10%] w-20 h-20 bg-gray-800 rounded-lg opacity-20 transform -rotate-6"></div>
              <div className="absolute top-[30%] right-[25%] w-12 h-12 bg-gray-800 rounded-lg opacity-25 transform rotate-45"></div>

              {/* Дополнительные декоративные элементы */}
              <div className="absolute top-[20%] left-[40%] text-4xl opacity-20">🌟</div>
              <div className="absolute bottom-[40%] left-[80%] text-4xl opacity-15">🌴</div>
              <div className="absolute top-[70%] left-[50%] text-3xl opacity-20">🏞️</div>
              <div className="absolute top-[15%] right-[15%] text-3xl opacity-25">❄️</div>
              <div className="absolute bottom-[15%] left-[25%] text-3xl opacity-20">🌵</div>

              {/* Облака */}
              <div className="absolute top-[5%] left-[30%] w-24 h-8 bg-gray-700 rounded-full opacity-20"></div>
              <div className="absolute top-[8%] left-[28%] w-16 h-8 bg-gray-700 rounded-full opacity-20"></div>
              <div className="absolute top-[7%] left-[35%] w-20 h-10 bg-gray-700 rounded-full opacity-20"></div>

              <div className="absolute top-[12%] right-[20%] w-28 h-10 bg-gray-700 rounded-full opacity-15"></div>
              <div className="absolute top-[15%] right-[25%] w-20 h-8 bg-gray-700 rounded-full opacity-15"></div>

              {/* Горы на горизонте */}
              <div
                className="absolute top-[20%] left-[10%] w-0 h-0 opacity-30"
                style={{
                  borderLeft: "30px solid transparent",
                  borderRight: "30px solid transparent",
                  borderBottom: "60px solid #4B5563",
                }}
              ></div>
              <div
                className="absolute top-[18%] left-[15%] w-0 h-0 opacity-30"
                style={{
                  borderLeft: "40px solid transparent",
                  borderRight: "40px solid transparent",
                  borderBottom: "80px solid #374151",
                }}
              ></div>
              <div
                className="absolute top-[22%] left-[25%] w-0 h-0 opacity-25"
                style={{
                  borderLeft: "25px solid transparent",
                  borderRight: "25px solid transparent",
                  borderBottom: "50px solid #4B5563",
                }}
              ></div>

              {/* Дополнительные горы */}
              <div
                className="absolute top-[15%] right-[30%] w-0 h-0 opacity-20"
                style={{
                  borderLeft: "35px solid transparent",
                  borderRight: "35px solid transparent",
                  borderBottom: "70px solid #374151",
                }}
              ></div>
              <div
                className="absolute top-[17%] right-[35%] w-0 h-0 opacity-25"
                style={{
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderBottom: "40px solid #4B5563",
                }}
              ></div>

              {/* Озеро */}
              <div className="absolute top-[60%] right-[15%] w-32 h-20 bg-blue-900 rounded-full opacity-20"></div>

              {/* Река */}
              <div className="absolute top-[40%] left-[60%] w-40 h-4 bg-blue-900 opacity-15 transform rotate-45"></div>
              <div className="absolute top-[45%] left-[65%] w-30 h-4 bg-blue-900 opacity-15 transform rotate-45"></div>

              {/* Деревья */}
              <div
                className="absolute top-[50%] left-[10%] w-0 h-0 opacity-25"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "20px solid #065f46",
                }}
              ></div>
              <div
                className="absolute top-[52%] left-[12%] w-0 h-0 opacity-25"
                style={{
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "16px solid #065f46",
                }}
              ></div>
              <div
                className="absolute top-[48%] left-[14%] w-0 h-0 opacity-25"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: "24px solid #065f46",
                }}
              ></div>

              <div
                className="absolute top-[80%] right-[25%] w-0 h-0 opacity-20"
                style={{
                  borderLeft: "15px solid transparent",
                  borderRight: "15px solid transparent",
                  borderBottom: "30px solid #065f46",
                }}
              ></div>
              <div
                className="absolute top-[82%] right-[28%] w-0 h-0 opacity-20"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "20px solid #065f46",
                }}
              ></div>

              {/* Пиксельные облака */}
              <div className="absolute top-[10%] left-[50%] grid grid-cols-3 opacity-15">
                <div className="w-4 h-4 bg-gray-600"></div>
                <div className="w-4 h-4 bg-gray-600"></div>
                <div className="w-4 h-4 bg-gray-600"></div>
                <div className="w-4 h-4 bg-gray-600"></div>
                <div className="w-4 h-4 bg-gray-600"></div>
                <div className="w-4 h-4 bg-gray-600"></div>
              </div>

              <div className="absolute top-[15%] left-[70%] grid grid-cols-4 opacity-10">
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
              </div>

              {/* Пиксельные звезды */}
              <div className="absolute top-[5%] left-[20%] w-2 h-2 bg-yellow-200 opacity-30 animate-pulse"></div>
              <div
                className="absolute top-[8%] left-[40%] w-2 h-2 bg-yellow-200 opacity-30 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-[12%] left-[60%] w-2 h-2 bg-yellow-200 opacity-30 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-[7%] left-[80%] w-2 h-2 bg-yellow-200 opacity-30 animate-pulse"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute top-[15%] left-[90%] w-2 h-2 bg-yellow-200 opacity-30 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>

              {/* Пиксельные руины */}
              <div className="absolute top-[75%] left-[30%] flex opacity-20">
                <div className="w-3 h-8 bg-gray-500 mx-1"></div>
                <div className="w-3 h-6 bg-gray-500 mx-1"></div>
                <div className="w-3 h-10 bg-gray-500 mx-1"></div>
                <div className="w-3 h-5 bg-gray-500 mx-1"></div>
              </div>

              {/* Пиксельный замок вдалеке */}
              <div className="absolute top-[25%] right-[40%] flex flex-col items-center opacity-15">
                <div className="w-4 h-4 bg-gray-500"></div>
                <div className="w-12 h-8 bg-gray-500"></div>
                <div className="flex">
                  <div className="w-3 h-3 bg-gray-500"></div>
                  <div className="w-3 h-3 bg-gray-500"></div>
                  <div className="w-3 h-3 bg-gray-500"></div>
                  <div className="w-3 h-3 bg-gray-500"></div>
                </div>
              </div>

              {/* Пиксельный корабль на горизонте */}
              <div className="absolute top-[55%] right-[60%] opacity-20">
                <div className="w-16 h-4 bg-gray-700"></div>
                <div className="w-8 h-6 bg-gray-600 ml-4"></div>
              </div>
            </div>

            {/* Дорожки между локациями (SVG) */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Стилизованные дорожки */}
              <defs>
                <linearGradient id="pathGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
                <linearGradient id="pathGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
                <linearGradient id="pathGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Путь от Стартап-леса к Корпоративной крепости */}
              <path
                d={`M ${20}% ${70}% C ${25}% ${55}%, ${30}% ${45}%, ${40}% ${40}%`}
                fill="none"
                stroke="url(#pathGradient1)"
                strokeWidth="4"
                strokeDasharray="8 4"
                filter="url(#glow)"
              />
              {/* Путь от Корпоративной крепости к Продуктовому океану */}
              <path
                d={`M ${40}% ${40}% C ${50}% ${45}%, ${60}% ${50}%, ${70}% ${60}%`}
                fill="none"
                stroke="url(#pathGradient2)"
                strokeWidth="4"
                strokeDasharray="8 4"
                filter="url(#glow)"
              />
              {/* Путь от Продуктового океана к Горам инноваций */}
              <path
                d={`M ${70}% ${60}% C ${75}% ${50}%, ${80}% ${40}%, ${85}% ${25}%`}
                fill="none"
                stroke="url(#pathGradient5)"
                strokeWidth="4"
                strokeDasharray="8 4"
                filter="url(#glow)"
              />
              {/* Декоративные точки на пути */}
              <circle cx="30%" cy="55%" r="3" fill="#4c1d95" />
              <circle cx="55%" cy="48%" r="3" fill="#065f46" />
              <circle cx="78%" cy="42%" r="3" fill="#065f46" />
              {/* Стрелки направления на путях */}
              <polygon points="30,55 33,52 33,58" fill="#4c1d95" transform="rotate(45, 30, 55)" />
              <polygon points="55,48 58,45 58,51" fill="#065f46" transform="rotate(30, 55, 48)" />
              <polygon points="78,42 81,39 81,45" fill="#065f46" transform="rotate(-60, 78, 42)" />
              {/* Дополнительные декоративные элементы на путях */}
              <circle cx="25%" cy="60%" r="2" fill="#4c1d95" opacity="0.6" />
              <circle cx="35%" cy="45%" r="2" fill="#4c1d95" opacity="0.6" />
              <circle cx="45%" cy="43%" r="2" fill="#065f46" opacity="0.6" />
              <circle cx="60%" cy="55%" r="2" fill="#065f46" opacity="0.6" />
              <circle cx="73%" cy="55%" r="2" fill="#7e22ce" opacity="0.6" />
              <circle cx="80%" cy="35%" r="2" fill="#7e22ce" opacity="0.6" />
              {/* Мерцающие точки на путях */}
              <circle cx="28%" cy="57%" r="1.5" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50%" cy="45%" r="1.5" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="75%" cy="45%" r="1.5" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Декоративные элементы карты */}
            <div className="absolute top-[15%] left-[30%] text-4xl opacity-30 transform rotate-12">🧭</div>
            <div className="absolute bottom-[25%] right-[20%] text-4xl opacity-30">🏔️</div>
            <div className="absolute top-[60%] left-[60%] text-3xl opacity-20">🌊</div>

            <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg border-2 border-gray-700 z-30">
              <h1 className="text-xl text-yellow-400 mb-2">Карта профессионального пути</h1>
              <p className="text-xs text-gray-300">Кликните на локацию или используйте стрелки для перемещения</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
               </div>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-400">
                <div className="px-2 border border-gray-600 rounded">Space</div> - вход в локацию
              </div>
            </div>

            {/* Индикатор ближайшей локации */}
            {nearestLocationRef.current && (
              <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-80 px-3 py-2 rounded-lg border border-yellow-500 z-30 text-xs text-yellow-400 flex items-center">
                <span>Нажмите</span>
                <div className="mx-2 px-2 border border-gray-600 rounded">Space</div>
                <span>для входа в {locations.find((loc) => loc.id === nearestLocationRef.current)?.name}</span>
              </div>
            )}

            {/* Character */}
            <GameCharacter x={characterPosition.x} y={characterPosition.y} />

            {/* Map locations */}
            {locations.map((location) => (
              <MapLocation
                key={location.id}
                id={location.id}
                name={location.name}
                x={location.x}
                y={location.y}
                isNearby={nearestLocationRef.current === location.id}
                onClick={() => handleLocationClick(location.id, location.x, location.y)}
              />
            ))}
          </div>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && <SkillInventory />}

        {/* Achievements Section */}
        {activeSection === "achievements" && <Achievements />}

        {/* Contact Section */}
        {activeSection === "contact" && <Contact />}
      </main>

      {/* Location Dialog */}
      <Dialog open={!!currentLocation} onOpenChange={(open) => !open && setCurrentLocation(null)}>
        {currentLocation && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-900 border-4 border-gray-700 p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl text-yellow-400">{locations.find((loc) => loc.id === currentLocation)?.name}</h2>
                <span className="text-sm text-gray-400">
                  {locations.find((loc) => loc.id === currentLocation)?.years}
                </span>
              </div>

              <p className="mb-4 text-sm">{locations.find((loc) => loc.id === currentLocation)?.description}</p>

              <div className="mb-4">
                <h3 className="text-green-400 text-sm mb-2">Достижения:</h3>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  {locations
                    .find((loc) => loc.id === currentLocation)
                    ?.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                </ul>
              </div>

              <Button
                onClick={() => setCurrentLocation(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs py-2"
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

