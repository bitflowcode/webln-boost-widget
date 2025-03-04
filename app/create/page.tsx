"use client"

import { useState } from 'react'
import WebLNBoostButton from '../components/webln-boost-button'

export default function CreateWidget() {
  const [config, setConfig] = useState({
    receiverType: 'lightning',
    receiver: '',
    amounts: '21,100,1000',
    labels: 'Café,Propina,Boost',
    theme: 'orange'
  })

  const generateWidgetCode = () => {
    // Codificar config en base64
    const encodedConfig = btoa(JSON.stringify(config))
    return `<iframe 
      src="https://www.bitflow.site/widget/${encodedConfig}"
      width="410" 
      height="410" 
      frameborder="0"
    ></iframe>`
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateWidgetCode())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Crea tu Widget de Donación</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-6">
            {/* Tipo de Receptor */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Método de Recepción
              </label>
              <select 
                value={config.receiverType}
                onChange={(e) => setConfig({...config, receiverType: e.target.value})}
                className="w-full p-3 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white"
              >
                <option value="lightning">Lightning Address</option>
                <option value="lnurl">LNURL</option>
                <option value="node">Node ID</option>
              </select>
            </div>

            {/* Dirección del Receptor */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {config.receiverType === 'lightning' ? 'Lightning Address' :
                 config.receiverType === 'lnurl' ? 'LNURL' : 'Node ID'}
              </label>
              <input
                type="text"
                value={config.receiver}
                onChange={(e) => setConfig({...config, receiver: e.target.value})}
                className="w-full p-3 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white"
                placeholder={
                  config.receiverType === 'lightning' ? 'tu@direccion.com' :
                  config.receiverType === 'lnurl' ? 'LNURL1...' : 'Node ID'
                }
              />
            </div>

            {/* Montos Sugeridos */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Montos Sugeridos (separados por coma)
              </label>
              <input
                type="text"
                value={config.amounts}
                onChange={(e) => setConfig({...config, amounts: e.target.value})}
                className="w-full p-3 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white"
                placeholder="21,100,1000"
              />
            </div>

            {/* Etiquetas de Montos */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Etiquetas de Montos (separadas por coma)
              </label>
              <input
                type="text"
                value={config.labels}
                onChange={(e) => setConfig({...config, labels: e.target.value})}
                className="w-full p-3 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white"
                placeholder="Café,Propina,Boost"
              />
            </div>

            {/* Tema */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Color del Tema
              </label>
              <select 
                value={config.theme}
                onChange={(e) => setConfig({...config, theme: e.target.value})}
                className="w-full p-3 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white"
              >
                <option value="orange">Naranja</option>
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
              </select>
            </div>
          </div>

          {/* Vista Previa y Código */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Vista Previa</h2>
              <div className="border border-gray-600 rounded-lg p-4">
                <WebLNBoostButton
                  defaultAmount={parseInt(config.amounts.split(',')[0])}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Código para tu Web</h2>
              <pre className="bg-[#2d2d2d] p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{generateWidgetCode()}</code>
              </pre>
              <button
                onClick={handleCopyCode}
                className="mt-4 bg-[#FF8C00] text-white px-6 py-2 rounded-lg hover:bg-[#FF8C00]/90 transition-colors"
              >
                Copiar Código
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 