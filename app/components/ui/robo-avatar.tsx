"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface RoboAvatarProps {
  seed?: string
  set?: string
  size?: number
  className?: string
}

function generateRobohashUrl(seed: string | undefined, set: string | undefined): string {
  const safeSeed = seed || 'default'
  const safeSet = set || 'set1'
  return `https://robohash.org/${encodeURIComponent(safeSeed)}?set=${safeSet}`
}

export default function RoboAvatar({ seed, set, size = 128, className = '' }: RoboAvatarProps) {
  const [isClient, setIsClient] = useState(false)
  const [avatarSeed, setAvatarSeed] = useState<string>('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const finalSeed = seed?.trim() || Math.random().toString(36).substring(2, 10)
    setAvatarSeed(finalSeed)
  }, [seed])

  const imageUrl = generateRobohashUrl(seed, set)

  if (!isClient || imageError) {
    return (
      <div className={`relative w-${size} h-${size} bg-[#3B81A2] rounded-full overflow-hidden flex items-center justify-center ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-[#3B81A2] text-white font-bold text-xl">
          BF
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-square ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageUrl}
        alt={`Avatar generado ${seed || 'default'}`}
        fill
        className="rounded-full object-cover"
        unoptimized
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}