import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import "./styles.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Блог продуктового менеджера",
  description: "Статьи о продуктовом менеджменте и опыте работы",
}

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={inter.className}>{children}</div>
}

