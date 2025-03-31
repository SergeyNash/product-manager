import Image from "next/image"

export function UserProfile() {
  return (
    <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg border-2 border-gray-700 z-40 flex items-center">
      <div className="mr-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500">
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Сергей"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg text-yellow-400 font-bold">Сергей</h2>
        <div className="text-xs text-gray-300 mt-1">
          <span className="text-green-400">Product Master</span>
          <span className="mx-1">|</span>
          <span>Мои продукты — лидеры рынка</span>
        </div>
      </div>
    </div>
  )
}

