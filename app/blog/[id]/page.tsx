import BlogPostClientPage from "./BlogPostClientPage"

// Добавляем эту функцию для генерации статических путей
export function generateStaticParams() {
  return [{ id: "first-post" }, { id: "second-post" }, { id: "third-post" }, { id: "images-example" }]
}

export default function BlogPostPage() {
  return <BlogPostClientPage />
}

