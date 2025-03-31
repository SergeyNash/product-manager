"use client"

import { useState } from "react"

interface MapLocationProps {
  id: string
  name: string
  x: number
  y: number
  isNearby?: boolean
  onClick: () => void
}

export function MapLocation({ id, name, x, y, isNearby = false, onClick }: MapLocationProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Определяем стили и иконки для разных локаций
  const getLocationStyles = () => {
    switch (id) {
      case "startup-forest":
        return {
          bgColor: "bg-green-800",
          borderColor: "border-green-500",
          shadowColor: "shadow-green-500/50",
          icon: "🌲",
          size: "w-14 h-14",
        }
      case "corporate-castle":
        return {
          bgColor: "bg-indigo-900",
          borderColor: "border-indigo-500",
          shadowColor: "shadow-indigo-500/50",
          icon: "🏰",
          size: "w-16 h-16",
        }
      case "product-ocean":
        return {
          bgColor: "bg-blue-800",
          borderColor: "border-blue-500",
          shadowColor: "shadow-blue-500/50",
          icon: "🌊",
          size: "w-14 h-14",
        }
      case "innovation-mountains":
        return {
          bgColor: "bg-purple-900",
          borderColor: "border-purple-500",
          shadowColor: "shadow-purple-500/50",
          icon: "🏔️",
          size: "w-15 h-15",
        }
      case "community-village":
        return {
          bgColor: "bg-amber-800",
          borderColor: "border-amber-500",
          shadowColor: "shadow-amber-500/50",
          icon: "🏘️",
          size: "w-14 h-14",
        }
      default:
        return {
          bgColor: "bg-gray-800",
          borderColor: "border-gray-500",
          shadowColor: "shadow-gray-500/50",
          icon: "📍",
          size: "w-12 h-12",
        }
    }
  }

  const styles = getLocationStyles()

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ${isHovered || isNearby ? "scale-110 z-50" : "scale-100 z-10"}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative">
        {/* Пульсирующий эффект под локацией */}
        <div
          className={`absolute inset-0 ${styles.bgColor} rounded-lg opacity-30 ${isNearby ? "animate-ping" : ""}`}
          style={{ animationDuration: "1.5s" }}
        ></div>

        {/* Локация */}
        <div
          className={`${styles.size} ${styles.bgColor} rounded-lg flex items-center justify-center 
                     border-2 ${isNearby ? "border-yellow-400 border-4" : styles.borderColor} shadow-lg ${styles.shadowColor} 
                     ${isHovered || isNearby ? "shadow-xl" : ""} relative z-20`}
        >
          <span className="text-2xl">{styles.icon}</span>

          {/* Маленькие декоративные элементы внутри локации */}
          {id === "startup-forest" && <div className="absolute bottom-1 right-1 text-xs">🌱</div>}
          {id === "corporate-castle" && <div className="absolute top-1 right-1 text-xs">👑</div>}
          {id === "product-ocean" && <div className="absolute top-1 left-1 text-xs">🚢</div>}
          {id === "innovation-mountains" && <div className="absolute bottom-1 left-1 text-xs">💡</div>}
          {id === "community-village" && <div className="absolute top-1 right-1 text-xs">👥</div>}
        </div>

        {/* Название локации */}
        {(isHovered || isNearby) && (
          <div
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-2 
                        rounded-lg text-xs whitespace-nowrap border border-gray-700 shadow-lg z-30"
          >
            <div className="font-bold text-center mb-1">{name}</div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>
        )}
      </div>
    </div>
  )
}

