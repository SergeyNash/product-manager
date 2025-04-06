"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface BlogLocationProps {
  id: string
  title: string
  x: number
  y: number
  isNearby?: boolean
  onClick: () => void
}

export function BlogLocation({ id, title, x, y, isNearby = false, onClick }: BlogLocationProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    // Перенаправляем на страницу блога
    router.push(`/blog/${id}`)
  }

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
      onClick={handleClick}
    >
      <div className="relative">
        {/* Пульсирующий эффект под локацией */}
        <div
          className={`absolute inset-0 bg-purple-800 rounded-lg opacity-30 ${isNearby ? "animate-ping" : ""}`}
          style={{ animationDuration: "1.5s" }}
        ></div>

        {/* Локация */}
        <div
          className={`w-8 h-8 sm:w-12 sm:h-12 bg-purple-800 rounded-lg flex items-center justify-center 
                   border-2 ${isNearby ? "border-yellow-400 border-4" : "border-purple-500"} shadow-lg shadow-purple-500/50 
                   ${isHovered || isNearby ? "shadow-xl" : ""} relative z-20`}
        >
          <span className="text-lg sm:text-2xl">📝</span>
        </div>

        {/* Название локации */}
        {(isHovered || isNearby) && (
          <div
            className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 sm:px-3 sm:py-2 
                      rounded-lg text-[8px] sm:text-xs whitespace-nowrap border border-gray-700 shadow-lg z-30"
          >
            <div className="font-bold text-center mb-0.5 sm:mb-1">{title}</div>
            <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
        )}
      </div>
    </div>
  )
}

