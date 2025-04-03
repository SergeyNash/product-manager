// Конфигурация социальных ссылок
export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
}

export const socialLinks: SocialLink[] = [
  {
    id: "email",
    name: "Email",
    url: "mailto:gdejivetmoya@gmail.com",
    icon: "Mail",
  },
  {
    id: "telegram",
    name: "Telegram",
    url: "https://t.me/nashquick",
    icon: "MessageCircle",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://ru.linkedin.com/in/sergey-sinyakov-2775644b",
    icon: "Linkedin",
  },
]

