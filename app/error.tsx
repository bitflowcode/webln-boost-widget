'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
        <button
          onClick={() => reset()}
          className="bg-[#FF8C00] text-white px-4 py-2 rounded-full hover:bg-[#FF8C00]/90 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
} 