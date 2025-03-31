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

  // Game state
  const gameState = useRef({
    player: { x: 50, y: 350, width: 30, height: 30, speed: 5 },
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
      player: { x: 50, y: 350, width: 30, height: 30, speed: 5 },
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
        width: 20,
        height: 20,
        speed: 2 + Math.random() * 2,
      })
      gameState.current.lastHeartTime = timestamp
    }

    // Spawn bugs
    if (timestamp - gameState.current.lastBugTime > 800) {
      gameState.current.bugs.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 20,
        height: 20,
        speed: 3 + Math.random() * 3,
      })
      gameState.current.lastBugTime = timestamp
    }

    // Update and draw player
    ctx.fillStyle = "#fbbf24"
    ctx.fillRect(
      gameState.current.player.x,
      gameState.current.player.y,
      gameState.current.player.width,
      gameState.current.player.height,
    )

    // Update and draw hearts
    ctx.fillStyle = "#ec4899"
    gameState.current.hearts.forEach((heart, index) => {
      heart.y += heart.speed

      // Draw heart
      ctx.fillRect(heart.x, heart.y, heart.width, heart.height)

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
    ctx.fillStyle = "#ef4444"
    gameState.current.bugs.forEach((bug, index) => {
      bug.y += bug.speed

      // Draw bug
      ctx.fillRect(bug.x, bug.y, bug.width, bug.height)

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
          break
        case "ArrowRight":
          gameState.current.player.x = Math.min(
            canvas.width - gameState.current.player.width,
            gameState.current.player.x + gameState.current.player.speed,
          )
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
        <p className="mb-2">Управление: используйте стрелки влево и вправо для перемещения.</p>
        <p>Цель: собирайте сердца (розовые квадраты) и избегайте багов (красные квадраты).</p>
      </div>
    </div>
  )
}

