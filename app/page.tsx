"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MapLocation } from "@/components/map-location"
import { SkillInventory } from "@/components/skill-inventory"
import { Achievements } from "@/components/achievements"
import Contact from "@/components/contact"
import { GameCharacter } from "@/components/game-character"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CareerLocation } from "@/lib/career-data"
import { UserProfile } from "@/components/user-profile"
import { BiographyPanel } from "@/components/biography-panel"
import { Download } from "lucide-react"

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
    name: "Цифровая энергетика",
    x: 70,
    y: 60,
    description: "Управление продуктом в динамичной среде с постоянно меняющимися требованиями рынка.",
    achievements: ["Увеличение удержания пользователей на 35%", "Запуск 3 успешных фич"],
    years: "2021-настоящее время",
  },
  // Добавляем новую локацию - Библиотека
  {
    id: "library",
    name: "Библиотека",
    x: 20,
    y: 25,
    description: "Коллекция статей и заметок о продуктовом менеджменте, технологиях и управлении.",
    achievements: ["Делюсь опытом и знаниями", "Записываю важные мысли и идеи"],
    years: "2020-настоящее время",
  },
]

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("main")
  const router = useRouter()
  const [locations, setLocations] = useState<CareerLocation[]>(defaultLocations)

  // Добавьте состояние для загрузки статей блога
  const [isLoadingBlog, setIsLoadingBlog] = useState(false)
  const [blogError, setBlogError] = useState<string | null>(null)

  // Character position state
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 })

  // Ref для отслеживания ближайшей локации
  const nearestLocationRef = useRef<string | null>(null)

  // Ref для отслеживания нажатых клавиш
  const keysPressed = useRef<Set<string>>(new Set())

  // Загрузка данных о локациях
  useEffect(() => {
    async function fetchData() {
      try {
        // Загрузка локаций
        const locationsResponse = await fetch("/api/career-locations")
        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json()
          // Добавляем библиотеку к полученным локациям
          if (Array.isArray(locationsData) && locationsData.length > 0) {
            // Найдем, есть ли уже библиотека в полученных данных
            const hasLibrary = locationsData.some((loc) => loc.id === "library")

            if (!hasLibrary) {
              // Если библиотеки нет, добавляем ее к полученным локациям
              const libraryLocation = defaultLocations.find((loc) => loc.id === "library")
              if (libraryLocation) {
                setLocations([...locationsData, libraryLocation])
              } else {
                setLocations(locationsData)
              }
            } else {
              setLocations(locationsData)
            }
          } else {
            console.log("Получены некорректные данные о локациях, используем данные по умолчанию")
            setLocations(defaultLocations)
          }
        } else {
          console.error("Ошибка при загрузке данных о локациях:", locationsResponse.statusText)
          setLocations(defaultLocations)
        }

        // Проверка наличия статей
        try {
          setIsLoadingBlog(true)
          setBlogError(null)

          const blogResponse = await fetch("/api/blog-posts")
          if (!blogResponse.ok) {
            console.error("Ошибка при загрузке данных о статьях блога:", blogResponse.statusText)
            setBlogError(`Ошибка при загрузке данных о статьях блога: ${blogResponse.statusText}`)
          }
        } catch (blogError) {
          console.error("Ошибка при загрузке данных о статьях блога:", blogError)
          setBlogError("Ошибка при загрузке данных о статьях блога")
        } finally {
          setIsLoadingBlog(false)
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
        setLocations(defaultLocations)
      }
    }

    fetchData()
  }, [])

  // Обработка нажатий клавиш для перемещения персонажа
  useEffect(() => {
    if (activeSection !== "main") return

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code)

      // Пробел для входа в локацию
      if (e.code === "Space" && nearestLocationRef.current) {
        if (nearestLocationRef.current === "library") {
          // Если это библиотека, перенаправляем в блог
          router.push("/blog")
        } else {
          // Это другая локация
          const location = locations.find((loc) => loc.id === nearestLocationRef.current)
          if (location) {
            handleLocationClick(location.id, location.x, location.y)
          }
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
  }, [activeSection, characterPosition, locations, router])

  // Определение ближайшей локации
  useEffect(() => {
    if (activeSection !== "main") return

    // Находим ближайшую локацию
    let minDistance = Number.POSITIVE_INFINITY
    let nearestLocation = null

    // Проверяем все локации
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
    // Если нажали на библиотеку, перенаправляем в блог
    if (locationId === "library") {
      router.push("/blog")
      return
    }

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

  const handleDownloadResume = () => {
    window.open("/data/resume.pdf", "_blank")
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P',monospace] overflow-hidden">
      {/* Верхняя панель с информацией */}
      <div className="fixed top-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-start px-2 sm:px-4 pt-2 sm:pt-4 z-40 gap-2">
        {/* Профиль пользователя */}
        <div className="bg-gray-900 bg-opacity-80 p-2 rounded-lg border-2 border-gray-700 w-full sm:w-1/2 flex items-center">
          <UserProfile />
        </div>

        {/* Информация о карте */}
        <div className="bg-gray-900 bg-opacity-80 p-2 rounded-lg border-2 border-gray-700 w-full sm:w-1/2 flex flex-col justify-center">
          <h1 className="text-xs sm:text-sm text-yellow-400 mb-1">Карта профессионального пути</h1>
          <div className="flex items-center text-[10px] sm:text-xs text-gray-400">
            <div className="px-1 border border-gray-600 rounded text-[8px] sm:text-[10px]">Space</div>
            <span className="ml-1">- вход в локацию</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-gray-700 p-1 sm:p-2 z-40">
        <div className="flex justify-around max-w-3xl mx-auto">
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 ${activeSection === "main" ? "bg-blue-600" : "bg-gray-800"} rounded text-[8px] sm:text-xs`}
            onClick={() => handleSectionChange("main")}
          >
            Главная
          </button>
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 ${activeSection === "skills" ? "bg-green-600" : "bg-gray-800"} rounded text-[8px] sm:text-xs`}
            onClick={() => handleSectionChange("skills")}
          >
            Навыки
          </button>
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 ${activeSection === "achievements" ? "bg-yellow-600" : "bg-gray-800"} rounded text-[8px] sm:text-xs`}
            onClick={() => handleSectionChange("achievements")}
          >
            Достижения
          </button>
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 ${activeSection === "contact" ? "bg-red-600" : "bg-gray-800"} rounded text-[8px] sm:text-xs`}
            onClick={() => handleSectionChange("contact")}
          >
            Контакты
          </button>
          <button
            onClick={() => router.push("/blog")}
            className="px-2 sm:px-3 py-1 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded text-[8px] sm:text-xs"
            title="Блог"
          >
            Блог
          </button>
          <button
            onClick={handleDownloadResume}
            className="px-2 sm:px-3 py-1 sm:py-2 bg-green-600 hover:bg-green-700 rounded"
            title="Скачать резюме"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-32 sm:pt-28 pb-16 sm:pb-20">
        {/* Main Section (Split View) */}
        {activeSection === "main" && (
          <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] md:h-[80vh]">
            {/* Биография (верхняя колонка на мобильных, левая на десктопах) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
              <BiographyPanel />
            </div>

            {/* Карта пути (нижняя колонка на мобильных, правая на десктопах) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
              {/* Фон карты с текстурой */}
              <div className="absolute inset-0 bg-gray-800">
                {/* Сетка для пиксельного эффекта */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
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
                  <linearGradient id="pathGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4c1d95" />
                    <stop offset="100%" stopColor="#9333ea" />
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
                {/* Путь от Стартап-леса к Библиотеке */}
                <path
                  d={`M ${20}% ${70}% C ${15}% ${50}%, ${15}% ${40}%, ${20}% ${25}%`}
                  fill="none"
                  stroke="url(#pathGradient3)"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  filter="url(#glow)"
                />
                {/* Декоративные точки на пути */}
                <circle cx="30%" cy="55%" r="3" fill="#4c1d95" />
                <circle cx="55%" cy="48%" r="3" fill="#065f46" />
                <circle cx="17%" cy="50%" r="3" fill="#7e22ce" />
                {/* Стрелки направления на путях */}
                <polygon points="30,55 33,52 33,58" fill="#4c1d95" transform="rotate(45, 30, 55)" />
                <polygon points="55,48 58,45 58,51" fill="#065f46" transform="rotate(30, 55, 48)" />
                <polygon points="17,50 20,47 20,53" fill="#7e22ce" transform="rotate(-45, 17, 50)" />
                {/* Дополнительные декоративные элементы на путях */}
                <circle cx="25%" cy="60%" r="2" fill="#4c1d95" opacity="0.6" />
                <circle cx="35%" cy="45%" r="2" fill="#4c1d95" opacity="0.6" />
                <circle cx="45%" cy="43%" r="2" fill="#065f46" opacity="0.6" />
                <circle cx="60%" cy="55%" r="2" fill="#065f46" opacity="0.6" />
                <circle cx="18%" cy="35%" r="2" fill="#7e22ce" opacity="0.6" />
                {/* Мерцающие точки на путях */}
                <circle cx="28%" cy="57%" r="1.5" fill="white" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="50%" cy="45%" r="1.5" fill="white" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="17%" cy="40%" r="1.5" fill="white" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Декоративные элементы карты */}
              <div className="absolute top-[15%] left-[30%] text-4xl opacity-30 transform rotate-12">🧭</div>
              <div className="absolute bottom-[25%] right-[20%] text-4xl opacity-30">🏔️</div>
              <div className="absolute top-[60%] left-[60%] text-3xl opacity-20">🌊</div>

              {/* Индикатор ближайшей локации - только для десктопов */}
              {nearestLocationRef.current && (
                <div className="fixed hidden sm:flex bottom-24 left-3/4 transform -translate-x-1/2 bg-gray-900 bg-opacity-80 px-3 py-2 rounded-lg border border-yellow-500 z-30 text-xs text-yellow-400 items-center">
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

              {/* Сообщение об ошибке загрузки блога */}
              {blogError && (
                <div className="absolute top-1/4 right-1/4 bg-red-900 bg-opacity-80 p-2 rounded-lg border-2 border-red-700 text-[8px] sm:text-xs max-w-[200px] z-20">
                  <p>{blogError}</p>
                </div>
              )}

              {/* Индикатор загрузки блога */}
              {isLoadingBlog && (
                <div className="absolute top-1/4 right-1/4 bg-gray-900 bg-opacity-80 p-2 rounded-lg border-2 border-gray-700 text-[8px] sm:text-xs z-20">
                  <p>Загрузка статей блога...</p>
                </div>
              )}
            </div>
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
          <DialogContent className="bg-gray-900 border-2 sm:border-4 border-gray-700 p-2 sm:p-4 rounded-lg max-w-4xl w-[95vw] mx-auto max-h-[80vh] overflow-hidden pixel-corners">
            <div className="flex justify-between items-start mb-2">
              <DialogTitle className="text-sm sm:text-lg text-yellow-400 font-['Press_Start_2P',monospace]">
                {locations.find((loc) => loc.id === currentLocation)?.name}
              </DialogTitle>
              <span className="text-[8px] sm:text-xs text-gray-400 font-['Press_Start_2P',monospace]">
                {locations.find((loc) => loc.id === currentLocation)?.years}
              </span>
            </div>

            <div className="overflow-y-auto pr-1 sm:pr-2" style={{ maxHeight: "calc(80vh - 120px)" }}>
              <p className="mb-2 sm:mb-4 text-[8px] sm:text-xs font-['Press_Start_2P',monospace] leading-relaxed">
                {locations.find((loc) => loc.id === currentLocation)?.description}
              </p>

              <div className="mb-2 sm:mb-4 border-2 border-gray-700 p-2 sm:p-3 bg-gray-800 pixel-corners">
                <h3 className="text-green-400 text-[8px] sm:text-xs mb-2 sm:mb-3 font-['Press_Start_2P',monospace]">
                  Достижения:
                </h3>
                <ul className="list-none pl-0 text-[8px] sm:text-xs space-y-1 sm:space-y-2">
                  {locations
                    .find((loc) => loc.id === currentLocation)
                    ?.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-1 sm:mr-2">✓</span>
                        <span className="font-['Press_Start_2P',monospace] leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <Button
              onClick={() => setCurrentLocation(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-[8px] sm:text-xs py-1 sm:py-2 font-['Press_Start_2P',monospace] pixel-corners mt-2"
            >
              Закрыть
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

