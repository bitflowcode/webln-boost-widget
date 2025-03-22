"use client"

import { useState } from 'react'

export default function InfoTooltip() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/10 hover:bg-white/20"
        onClick={() => setIsVisible(!isVisible)}
      >
        <span>¿Pagos con un click?</span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#ffd900] text-[#ffd900]">ℹ</span>
      </button>
      
      {isVisible && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsVisible(false)}
          />
          <div 
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[320px] bg-white rounded-xl shadow-xl p-6 z-50"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </button>
            <h3 className="text-[#3B81A2] font-bold text-lg mb-3">Extensión WebLN</h3>
            <p className="text-gray-600 mb-4">
              Con una extensión WebLN como Alby en tu navegador, podrás hacer pagos instantáneos sin necesidad de escanear códigos QR o copiar facturas.
            </p>
            <a 
              href="https://getalby.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#FF8C00] text-white px-4 py-2 rounded-full font-medium hover:bg-[#FF8C00]/90 transition-colors"
            >
              Instalar Alby
            </a>
          </div>
        </>
      )}
    </div>
  )
} 