"use client"

import { useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'
import { FC } from 'react'

interface WidgetConfig {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: string
  labels: string
  theme: string
}

interface WidgetClientProps {
  id: string
}

const WidgetClient: FC<WidgetClientProps> = ({ id }) => {
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      // Decodificar la configuración desde el ID
      const decodedConfig = JSON.parse(atob(id))
      setConfig(decodedConfig)
    } catch (err) {
      console.error('Error al decodificar la configuración:', err)
      setError('Configuración de widget inválida')
    }
  }, [id])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  // Convertir los montos de string a array de números
  const amounts = config.amounts.split(',').map(Number)
  const labels = config.labels.split(',')

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={config.receiverType}
        receiver={config.receiver}
        amounts={amounts}
        labels={labels}
        theme={config.theme}
      />
    </div>
  )
}

export default WidgetClient 