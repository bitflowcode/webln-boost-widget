"use client"

import React, { useState, useEffect } from 'react'
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
  return `/api/robohash?seed=${encodeURIComponent(safeSeed)}&set=${encodeURIComponent(safeSet)}`
}

export default function RoboAvatar({ seed, set, size = 128, className = '' }: RoboAvatarProps) {
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const imageUrl = generateRobohashUrl(seed, set)

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
      {(!isClient || imageError) ? (
        <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-xl">
          BF
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={`Avatar generado ${seed || 'default'}`}
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