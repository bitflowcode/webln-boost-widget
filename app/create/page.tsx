"use client"

import { useState, useEffect } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'
import RoboAvatar from '@/app/components/ui/robo-avatar'

const RECIPIENT_ADDRESS = "bitflowz@getalby.com"

type ReceiverType = 'lightning' | 'lnurl' | 'node'
type AvatarSet = 'set1' | 'set2' | 'set3' | 'set4' | 'set5'

interface WidgetConfig {
  receiverType: ReceiverType
  receiver: string
  amounts: string
  labels: string
  theme: string
  // Nuevos campos para avatar
  useCustomImage: boolean
  image?: string
  avatarSeed?: string
  avatarSet?: AvatarSet
}

export default function CreatePage() {
  const [config, setConfig] = useState<WidgetConfig>({
    receiverType: 'lightning',
    receiver: RECIPIENT_ADDRESS,
    amounts: '21,100,1000',
    labels: 'Café,Propina,Boost',
    theme: 'orange',
    useCustomImage: false,
    avatarSeed: Math.random().toString(36).substring(7),
    avatarSet: 'set1'
  })

  const generateNewAvatar = () => {
    setConfig(prev => ({
      ...prev,
      avatarSeed: Math.random().toString(36).substring(7)
    }))
  }

  const handleConfigChange = (field: keyof WidgetConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getConfigString = () => {
    const exportConfig = {
      ...config,
      amounts: config.amounts.split(',').map(Number),
      labels: config.labels.split(',')
    }
    return JSON.stringify(exportConfig, null, 2)
  }

  const copyCode = () => {
    const exportConfig = {
      ...config,
      amounts: config.amounts.split(',').map(Number),
      labels: config.labels.split(',')
    }
    const code = `<script src="https://bitflow.site/widget.js"></script>
<div id="bitflow-widget" data-config='${JSON.stringify(exportConfig)}'></div>`
    navigator.clipboard.writeText(code)
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Crea tu Widget de Donación</h1>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Método de Recepción */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Método de Recepción
            </label>
            <select 
              className="w-full p-2 border rounded-md"
              value={config.receiverType}
              onChange={(e) => handleConfigChange('receiverType', e.target.value as ReceiverType)}
            >
              <option value="lightning">Lightning Address</option>
              <option value="lnurl">LNURL</option>
              <option value="node">Node ID</option>
            </select>
          </div>

          {/* Lightning Address */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Lightning Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="tu@direccion.com"
              value={config.receiver}
              onChange={(e) => handleConfigChange('receiver', e.target.value)}
            />
          </div>

          {/* Montos Sugeridos */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Montos Sugeridos (separados por coma)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="21,100,1000"
              value={config.amounts}
              onChange={(e) => handleConfigChange('amounts', e.target.value)}
            />
          </div>

          {/* Etiquetas de Montos */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Etiquetas de Montos (separadas por coma)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Café,Propina,Boost"
              value={config.labels}
              onChange={(e) => handleConfigChange('labels', e.target.value)}
            />
          </div>

          {/* Color del Tema */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Color del Tema
            </label>
            <select 
              className="w-full p-2 border rounded-md"
              value={config.theme}
              onChange={(e) => handleConfigChange('theme', e.target.value)}
            >
              <option value="orange">Naranja</option>
              <option value="blue">Azul</option>
              <option value="green">Verde</option>
            </select>
          </div>

          {/* Avatar del Widget */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Avatar del Widget</h3>
            
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="useCustomImage"
                checked={config.useCustomImage}
                onChange={(e) => handleConfigChange('useCustomImage', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="useCustomImage">
                Usar imagen personalizada en lugar de avatar
              </label>
            </div>

            <div className="pl-8 space-y-4">
              {/* URL de Imagen Personalizada */}
              {config.useCustomImage && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL de la Imagen
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="https://ejemplo.com/tu-imagen.png"
                    value={config.image || ''}
                    onChange={(e) => handleConfigChange('image', e.target.value)}
                  />
                </div>
              )}

              {/* O usar Avatar Generado */}
              {!config.useCustomImage && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      O usar Avatar Generado
                    </label>
                    <button
                      type="button"
                      onClick={generateNewAvatar}
                      className="px-4 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Generar Nuevo Avatar
                    </button>
                  </div>
                  
                  <select 
                    className="w-full p-2 border rounded-md mb-2"
                    value={config.avatarSet}
                    onChange={(e) => handleConfigChange('avatarSet', e.target.value as AvatarSet)}
                  >
                    <option value="set1">Robots</option>
                    <option value="set2">Monstruos</option>
                    <option value="set3">Cabezas</option>
                    <option value="set4">Gatos</option>
                    <option value="set5">Humanos</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Vista Previa</h2>
            <div className="flex justify-center">
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
          </div>

          {/* Código para tu Web */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Código para tu Web</h2>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {`<script src="https://bitflow.site/widget.js"></script>
<div id="bitflow-widget" data-config='${JSON.stringify({
  ...config,
  amounts: config.amounts.split(',').map(Number),
  labels: config.labels.split(',')
})}'></div>`}
                </code>
              </pre>
              <button
                type="button"
                onClick={copyCode}
                className="absolute top-2 right-2 px-3 py-1 text-sm bg-white rounded shadow hover:bg-gray-50"
              >
                Copiar
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}