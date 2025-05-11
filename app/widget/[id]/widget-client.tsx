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
    .padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')

  try {
    return atob(base64)
  } catch (error) {
    console.error('Error decodificando base64:', error)
    throw error
  }
}

// Función para decodificar URLs en base64 dentro del JSON
function decodeBase64Urls(jsonStr: string): string {
  return jsonStr.replace(/"([A-Za-z0-9_-]+={0,2})"/, (match, encoded) => {
    try {
      // Intentar decodificar todas las cadenas que parecen base64
      const decoded = base64urlDecode(encoded)
      // Verificar si es una URL válida
      try {
        new URL(decoded)
        return `"${decoded}"`
      } catch {
        return match
      }
    } catch {
      return match
    }
  })
}

export default function WidgetClient({ id }: WidgetClientProps) {
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Decodificar base64url
      const decodedBase64 = base64urlDecode(id)
      console.log('Config base64 decodificada:', decodedBase64)
      
      // Decodificar URLs en base64 dentro del JSON
      const decodedJson = decodeBase64Urls(decodedBase64)
      console.log('Config con URLs decodificadas:', decodedJson)
      
      // Parsear la configuración
      const decodedConfig = JSON.parse(decodedJson)
      console.log('Config final:', decodedConfig)
      
      // Validar la configuración
      if (!decodedConfig.receiverType || !decodedConfig.receiver) {
        throw new Error('Configuración del widget inválida')
      }
      
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
      />
    </div>
  )
} 