"use client"

import { useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'

interface WidgetClientProps {
  id: string
}

interface WidgetConfig {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: string
  labels: string
  theme: string
  useCustomImage: boolean
  image?: string
  avatarSeed?: string
  avatarSet?: 'set1' | 'set2' | 'set3' | 'set4' | 'set5'
}

// Función para decodificar base64url sin padding
function base64urlDecode(str: string): string {
  // Convertir base64url a base64
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  try {
    // Intentar decodificar sin padding
    return atob(base64)
  } catch {
    // Si falla, intentar con padding
    const pad = 4 - (base64.length % 4)
    const paddedBase64 = pad === 4 ? base64 : base64 + '='.repeat(pad)
    return atob(paddedBase64)
  }
}

export default function WidgetClient({ id }: WidgetClientProps) {
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Decodificar base64url
      const decodedBase64 = base64urlDecode(id)
      // Decodificar la configuración
      const decodedString = decodeURIComponent(escape(decodedBase64))
        .replace(/"([A-Za-z0-9_-]+={0,2})"/, (match, encoded) => {
          try {
            // Intentar decodificar la URL codificada
            const decodedUrl = atob(encoded.padEnd(encoded.length + (4 - (encoded.length % 4)) % 4, '='))
            return `"${decodedUrl}"`
          } catch {
            // Si falla, devolver el match original
            return match
          }
        })
      const decodedConfig = JSON.parse(decodedString)
      setConfig(decodedConfig)
    } catch (err) {
      console.error('Error al decodificar:', err)
      setError('Error al decodificar la configuración del widget')
    }
  }, [id])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={config.receiverType}
        receiver={config.receiver}
        amounts={config.amounts.split(',').map(Number)}
        labels={config.labels.split(',')}
        theme={config.theme}
        image={config.useCustomImage ? config.image : undefined}
        avatarSeed={!config.useCustomImage ? config.avatarSeed : undefined}
        avatarSet={!config.useCustomImage ? config.avatarSet : undefined}
        hideWebLNGuide={true}
      />
    </div>
  )
} 