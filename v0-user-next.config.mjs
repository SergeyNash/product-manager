/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Базовый путь для GitHub Pages - имя вашего репозитория
  // Например, если URL репозитория: https://username.github.io/product-manager-portfolio/
  // то basePath должен быть '/product-manager-portfolio'
  // Если вы используете пользовательский домен или публикуете в корне username.github.io,
  // оставьте basePath пустым или удалите эту строку
  basePath: process.env.NODE_ENV === 'production' ? '/product-manager-portfolio' : '',
  // Отключаем оптимизацию изображений, так как GitHub Pages не поддерживает серверные компоненты
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

