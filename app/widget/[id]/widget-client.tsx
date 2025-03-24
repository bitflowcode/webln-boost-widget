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

export default function WidgetClient({ id }: WidgetClientProps) {
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Decodificar el base64 y luego decodificar los caracteres especiales
      const decodedBase64 = atob(id)
      const decodedString = decodeURIComponent(escape(decodedBase64))
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