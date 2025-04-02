"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Linkedin, Mail, Send, MessageCircle } from "lucide-react"
import { socialLinks } from "@/config/social-links"

export default function Contact() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ type: "system" | "user" | "response"; content: string }[]>([
    { type: "system", content: "Инициализация системы связи..." },
    { type: "system", content: "Система готова к приему сообщений." },
    { type: "system", content: "Введите ваше сообщение или выберите команду:" },
    { type: "system", content: "/help - показать доступные команды" },
    { type: "system", content: "/contact - показать контактную информацию" },
    { type: "system", content: "/about - информация о продуктовом менеджере" },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: input }])

    // Process command or message
    processInput(input)

    // Clear input
    setInput("")
  }

  const processInput = (text: string) => {
    setIsTyping(true)

    setTimeout(() => {
      let response

      if (text.startsWith("/")) {
        // Handle commands
        switch (text.toLowerCase()) {
          case "/help":
            response = {
              type: "response" as const,
              content: `Доступные команды:
/help - показать эту справку
/contact - показать контактную информацию
/about - информация о продуктовом менеджере
/clear - очистить терминал`,
            }
            break

          case "/contact":
            response = {
              type: "response" as const,
              content: `Email: gdejivetmoya@gmail.com
LinkedIn: https://ru.linkedin.com/in/sergey-sinyakov-2775644b
Tg-site: @nashquick`,
            }
            break

          case "/about":
            response = {
              type: "response" as const,
              content: `Продуктовый менеджер с 10+ летним опытом работы в сфере технологий.
Специализация: b2b, кибербезопасность, финтех.
Ключевые навыки: управление продуктом, аналитика, стратегическое планирование.`,
            }
            break

          case "/clear":
            setMessages([
              { type: "system", content: "Терминал очищен." },
              { type: "system", content: "Введите /help для просмотра доступных команд." },
            ])
            setIsTyping(false)
            return

          default:
            response = {
              type: "response" as const,
              content: `Неизвестная команда: ${text}. Введите /help для просмотра доступных команд.`,
            }
        }
      } else {
        // Handle regular message
        response = {
          type: "response" as const,
          content: "Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.",
        }
      }

      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-900 border-4 border-gray-700 rounded-lg max-w-4xl mx-auto overflow-hidden">
        {/* Terminal header */}
        <div className="bg-gray-800 p-2 flex items-center border-b border-gray-700">
          <div className="flex space-x-2 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs text-center flex-1">terminal@pm-hero ~ /contact</div>
        </div>

        {/* Terminal content */}
        <div className="h-80 overflow-y-auto p-4 font-mono text-green-400 text-sm">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.type === "system"
                  ? "text-gray-400"
                  : message.type === "user"
                    ? "text-blue-400"
                    : "text-green-400"
              }`}
            >
              {message.type === "system" ? "SYSTEM" : message.type === "user" ? "YOU" : "PM-HERO"}
              {">"}{" "}
              {message.content.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className="text-gray-400">
              PM-HERO{">"} <span className="animate-pulse">_</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-700 flex">
          <span className="text-green-400 mr-2">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение или команду..."
            className="flex-1 bg-gray-800 border-gray-700 text-green-400 focus-visible:ring-green-500"
          />
          <Button onClick={handleSend} className="ml-2 bg-green-700 hover:bg-green-600" disabled={isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Social links */}
        <div className="p-4 border-t border-gray-700 flex justify-center space-x-6">
          {socialLinks.map((link) => {
            // Динамически определяем иконку на основе строкового значения
            const IconComponent =
              link.icon === "Mail"
                ? Mail
                : link.icon === "MessageCircle"
                  ? MessageCircle
                  : link.icon === "Linkedin"
                    ? Linkedin
                    : Mail

            return (
              <a
                key={link.id}
                href={link.url}
                className="text-gray-400 hover:text-white transition-colors"
                title={link.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconComponent className="h-6 w-6" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

