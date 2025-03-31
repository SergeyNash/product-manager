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
    url: "mailto:contact@pm-hero.com",
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
    url: "https://www.ptsecurity.com/ru-ru/",
    icon: "Linkedin",
  },
]

