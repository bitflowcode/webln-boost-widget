import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface CustomAvatarProps {
  imageUrl: string
  size?: number
  className?: string
}

export default function CustomAvatar({ imageUrl, size = 128, className = '' }: CustomAvatarProps) {
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div 
      className={`relative rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ 
        width: size,
        height: size,
        backgroundColor: '#3B81A2',
        position: 'relative'
      }}
    >
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: '#3B81A2' }}
      />
      {(!isClient || imageError || !imageUrl) ? (
        <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-xl">
          BF
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt="Avatar personalizado"
          fill
          className="relative z-10 object-cover"
          unoptimized
          priority
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
} 