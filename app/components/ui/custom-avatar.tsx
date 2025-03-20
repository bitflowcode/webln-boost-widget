import { useState } from 'react'
import Image from 'next/image'

interface CustomAvatarProps {
  imageUrl: string
  size?: number
  className?: string
}

export default function CustomAvatar({ imageUrl, size = 128, className = '' }: CustomAvatarProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={`w-full h-full bg-[#3B81A2] rounded-full flex items-center justify-center ${className}`}>
        <div className="text-white font-bold text-xl">
          BF
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-square ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageUrl}
        alt="Avatar personalizado"
        fill
        className="rounded-full object-cover"
        unoptimized
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
} 