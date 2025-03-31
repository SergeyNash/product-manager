"use client"

import { useEffect, useState, useRef } from "react"

interface GameCharacterProps {
  x: number
  y: number
}

export function GameCharacter({ x, y }: GameCharacterProps) {
  const [direction, setDirection] = useState("down")
  const [frame, setFrame] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const prevPosition = useRef({ x, y })

  // Анимация движения
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Определение направления и состояния движения
  useEffect(() => {
    // Если позиция изменилась, персонаж движется
    if (prevPosition.current.x !== x || prevPosition.current.y !== y) {
      setIsMoving(true)

      // Определяем направление на основе изменения позиции
      const dx = x - prevPosition.current.x
      const dy = y - prevPosition.current.y

      if (Math.abs(dx) > Math.abs(dy)) {
        // Горизонтальное движение преобладает
        setDirection(dx > 0 ? "right" : "left")
      } else {
        // Вертикальное движение преобладает
        setDirection(dy > 0 ? "up" : "down")
      }

      // Через 500мс останавливаем движение (после завершения анимации перемещения)
      const timer = setTimeout(() => {
        setIsMoving(false)
        prevPosition.current = { x, y }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [x, y])

  // Следы от шагов
  const [footprints, setFootprints] = useState<{ x: number; y: number; direction: string; opacity: number }[]>([])

  // Добавление следов при движении
  useEffect(() => {
    if (isMoving && frame % 2 === 0) {
      setFootprints((prev) => [
        ...prev.slice(-5), // Сохраняем только последние 5 следов
        { x, y, direction, opacity: 0.8 },
      ])
    }

    // Уменьшаем непрозрачность следов со временем
    const fadeInterval = setInterval(() => {
      setFootprints((prev) => prev.map((fp) => ({ ...fp, opacity: fp.opacity - 0.1 })).filter((fp) => fp.opacity > 0))
    }, 500)

    return () => clearInterval(fadeInterval)
  }, [isMoving, frame, x, y, direction])

  return (
    <>
      {/* Следы от шагов */}
      {footprints.map((fp, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 rounded-full bg-yellow-500"
          style={{
            left: `${fp.x}%`,
            top: `${fp.y}%`,
            opacity: fp.opacity,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        />
      ))}

      <div
        className="absolute transition-all duration-500 z-30"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Тень под персонажем */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-black rounded-full opacity-30"></div>

        {/* Персонаж */}
        <div
          className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center 
                       border-2 border-yellow-600 overflow-hidden shadow-md
                       ${isMoving ? "animate-bounce" : ""}`}
          style={{ animationDuration: "0.5s" }}
        >
          <span
            className="text-2xl text-black font-bold"
            style={{
              transform: `rotate(${
                direction === "up"
                  ? "-90deg"
                  : direction === "down"
                    ? "90deg"
                    : direction === "left"
                      ? "180deg"
                      : "0deg"
              })`,
              display: "inline-block",
            }}
          >
            ᗧ
          </span>
        </div>

        {/* Эффект движения */}
        {isMoving && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs opacity-70">
            {direction === "up" || direction === "down" ? "⋯" : "⋯"}
          </div>
        )}

        {/* Индикатор активности (когда персонаж близко к локации) */}
        <div
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce"
          style={{ display: isMoving ? "none" : "block", animationDuration: "1s" }}
        >
          ⬇️
        </div>
      </div>
    </>
  )
}

