"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playerDirection, setPlayerDirection] = useState("up") // Изменено с "right" на "up"

  // Game state
  const gameState = useRef({
    player: { x: 50, y: 350, width: 30, height: 30, speed: 20 }, // Увеличена скорость с 8 до 20
    hearts: [] as { x: number; y: number; width: number; height: number; speed: number }[],
    bugs: [] as { x: number; y: number; width: number; height: number; speed: number }[],
    lastHeartTime: 0,
    lastBugTime: 0,
    animationFrame: 0,
    gameActive: false,
  })

  const startGame = () => {
    if (gameState.current.gameActive) return

    // Reset game state
    gameState.current = {
      player: { x: 50, y: 350, width: 30, height: 30, speed: 20 }, // Увеличена скорость с 8 до 20
      hearts: [],
      bugs: [],
      lastHeartTime: 0,
      lastBugTime: 0,
      animationFrame: 0,
      gameActive: true,
    }

    setScore(0)
    setGameStarted(true)
    setGameOver(false)
    setPlayerDirection("up") // Изменено с "right" на "up"

    // Start game loop
    requestAnimationFrame(gameLoop)
  }

  const gameLoop = (timestamp: number) => {
    if (!gameState.current.gameActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#111827"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines (for pixel effect)
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Spawn hearts
    if (timestamp - gameState.current.lastHeartTime > 1000) {
      gameState.current.hearts.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 24,
        height: 24,
        speed: 2 + Math.random() * 2,
      })
      gameState.current.lastHeartTime = timestamp
    }

    // Spawn bugs
    if (timestamp - gameState.current.lastBugTime > 800) {
      gameState.current.bugs.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 24,
        height: 24,
        speed: 3 + Math.random() * 3,
      })
      gameState.current.lastBugTime = timestamp
    }

    // Update and draw player (Pac-Man style)
    const player = gameState.current.player
    ctx.fillStyle = "#fbbf24" // Желтый цвет
    ctx.beginPath()
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#000" // Черный цвет для глаза

    // Рисуем рот в зависимости от направления
    ctx.beginPath()
    const mouthAngle = Math.PI / 4 // Угол открытия рта
    let startAngle, endAngle

    switch (playerDirection) {
      case "right":
        startAngle = -mouthAngle
        endAngle = mouthAngle
        break
      case "left":
        startAngle = Math.PI - mouthAngle
        endAngle = Math.PI + mouthAngle
        break
      case "up":
        startAngle = Math.PI * 1.5 - mouthAngle
        endAngle = Math.PI * 1.5 + mouthAngle
        break
      case "down":
        startAngle = Math.PI * 0.5 - mouthAngle
        endAngle = Math.PI * 0.5 + mouthAngle
        break
      default:
        startAngle = -mouthAngle
        endAngle = mouthAngle
    }

    ctx.beginPath()
    ctx.moveTo(player.x + player.width / 2, player.y + player.height / 2)
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = "#111827" // Цвет фона для рта
    ctx.fill()

    // Update and draw hearts
    gameState.current.hearts.forEach((heart, index) => {
      heart.y += heart.speed

      // Draw heart
      const heartX = heart.x + heart.width / 2
      const heartY = heart.y + heart.height / 2
      const heartSize = heart.width / 2

      ctx.fillStyle = "#ec4899" // Розовый цвет для сердца

      // Рисуем сердце
      ctx.beginPath()
      ctx.moveTo(heartX, heartY + heartSize * 0.3)
      ctx.bezierCurveTo(heartX, heartY, heartX - heartSize, heartY - heartSize, heartX - heartSize, heartY)
      ctx.bezierCurveTo(
        heartX - heartSize,
        heartY + heartSize * 0.8,
        heartX,
        heartY + heartSize * 1.5,
        heartX,
        heartY + heartSize * 1.5,
      )
      ctx.bezierCurveTo(
        heartX,
        heartY + heartSize * 1.5,
        heartX + heartSize,
        heartY + heartSize * 0.8,
        heartX + heartSize,
        heartY,
      )
      ctx.bezierCurveTo(heartX + heartSize, heartY - heartSize, heartX, heartY, heartX, heartY + heartSize * 0.3)
      ctx.closePath()
      ctx.fill()

      // Check collision with player
      if (
        heart.x < gameState.current.player.x + gameState.current.player.width &&
        heart.x + heart.width > gameState.current.player.x &&
        heart.y < gameState.current.player.y + gameState.current.player.height &&
        heart.y + heart.height > gameState.current.player.y
      ) {
        // Collect heart
        gameState.current.hearts.splice(index, 1)
        setScore((prevScore) => prevScore + 10)
      }

      // Remove if off screen
      if (heart.y > canvas.height) {
        gameState.current.hearts.splice(index, 1)
      }
    })

    // Update and draw bugs
    gameState.current.bugs.forEach((bug, index) => {
      bug.y += bug.speed

      // Draw bug (черный жук)
      const bugX = bug.x + bug.width / 2
      const bugY = bug.y + bug.height / 2
      const bugSize = bug.width / 2

      // Тело жука
      ctx.fillStyle = "#000000" // Черный цвет для жука
      ctx.beginPath()
      ctx.ellipse(bugX, bugY, bugSize, bugSize * 0.7, 0, 0, Math.PI * 2)
      ctx.fill()

      // Голова
      ctx.beginPath()
      ctx.arc(bugX - bugSize * 0.5, bugY, bugSize * 0.4, 0, Math.PI * 2)
      ctx.fill()

      // Глаза
      ctx.fillStyle = "#ff0000" // Красные глаза
      ctx.beginPath()
      ctx.arc(bugX - bugSize * 0.7, bugY - bugSize * 0.2, bugSize * 0.1, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bugX - bugSize * 0.7, bugY + bugSize * 0.2, bugSize * 0.1, 0, Math.PI * 2)
      ctx.fill()

      // Лапки
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      // Верхние лапки
      ctx.beginPath()
      ctx.moveTo(bugX - bugSize * 0.3, bugY - bugSize * 0.5)
      ctx.lineTo(bugX, bugY - bugSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(bugX + bugSize * 0.3, bugY - bugSize * 0.5)
      ctx.lineTo(bugX + bugSize * 0.8, bugY - bugSize)
      ctx.stroke()
      // Нижние лапки
      ctx.beginPath()
      ctx.moveTo(bugX - bugSize * 0.3, bugY + bugSize * 0.5)
      ctx.lineTo(bugX, bugY + bugSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(bugX + bugSize * 0.3, bugY + bugSize * 0.5)
      ctx.lineTo(bugX + bugSize * 0.8, bugY + bugSize)
      ctx.stroke()

      // Check collision with player
      if (
        bug.x < gameState.current.player.x + gameState.current.player.width &&
        bug.x + bug.width > gameState.current.player.x &&
        bug.y < gameState.current.player.y + gameState.current.player.height &&
        bug.y + bug.height > gameState.current.player.y
      ) {
        // Game over on bug collision
        gameState.current.gameActive = false
        setGameOver(true)

        // Update high score
        if (score > highScore) {
          setHighScore(score)
        }

        return
      }

      // Remove if off screen
      if (bug.y > canvas.height) {
        gameState.current.bugs.splice(index, 1)
      }
    })

    // Draw score
    ctx.fillStyle = "#ffffff"
    ctx.font = '16px "Press Start 2P", monospace'
    ctx.fillText(`Score: ${score}`, 20, 30)

    // Continue game loop
    gameState.current.animationFrame = requestAnimationFrame(gameLoop)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.current.gameActive) return

      const canvas = canvasRef.current
      if (!canvas) return

      switch (e.key) {
        case "ArrowLeft":
          gameState.current.player.x = Math.max(0, gameState.current.player.x - gameState.current.player.speed)
          setPlayerDirection("left")
          break
        case "ArrowRight":
          gameState.current.player.x = Math.min(
            canvas.width - gameState.current.player.width,
            gameState.current.player.x + gameState.current.player.speed,
          )
          setPlayerDirection("right")
          break
        case "ArrowUp":
          gameState.current.player.y = Math.max(0, gameState.current.player.y - gameState.current.player.speed)
          setPlayerDirection("up")
          break
        case "ArrowDown":
          gameState.current.player.y = Math.min(
            canvas.height - gameState.current.player.height,
            gameState.current.player.y + gameState.current.player.speed,
          )
          setPlayerDirection("down")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(gameState.current.animationFrame)
      gameState.current.gameActive = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P',monospace] flex flex-col items-center justify-center p-4">
      <h1 className="text-xl text-yellow-400 mb-6">Продуктовый герой</h1>

      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="border-4 border-gray-700" />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h2 className="text-lg mb-4">Продуктовый герой</h2>
            <p className="text-xs text-center mb-6 max-w-xs">
              Собирайте сердца пользователей и избегайте багов на пути к успешному релизу!
            </p>
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              Начать игру
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h2 className="text-lg mb-2">Игра окончена!</h2>
            <p className="text-sm mb-1">Счет: {score}</p>
            <p className="text-sm mb-4">Рекорд: {highScore}</p>
            <div className="flex gap-4">
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Играть снова
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  На главную
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-center max-w-md">
        <p className="mb-2">Управление: используйте стрелки для перемещения во всех направлениях.</p>
        <p>Цель: собирайте сердца пользователей и избегайте багов-жуков на пути к успешному релизу!</p>
      </div>
    </div>
  )
}

