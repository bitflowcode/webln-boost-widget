"use client"

import { useState, useEffect } from "react"
import { requestProvider, type WebLNProvider } from "webln"
import { Button } from "@/app/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { WebLNGuide } from "./webln-guide"
import Image from "next/image"
import { bech32 } from 'bech32'
import RoboAvatar from "./ui/robo-avatar"
import CustomAvatar from "./ui/custom-avatar"


const RECIPIENT_ADDRESS = "bitflowz@getalby.com"

interface WebLNBoostButtonProps {
  receiverType?: 'lightning' | 'lnurl' | 'node'
  receiver?: string
  amounts?: number[]
  labels?: string[]
  theme?: string
  incrementSpeed?: number
  incrementValue?: number
  // Nuevos campos para avatar
  avatarSeed?: string
  avatarSet?: 'set1' | 'set2' | 'set3' | 'set4' | 'set5'
  image?: string // Para mantener soporte de imagen personalizada
}

type Step = "initial" | "amount" | "note" | "qr" | "processing"

interface LNURLPayResponse {
  callback: string
  maxSendable: number
  minSendable: number
  metadata: string
  tag: string
  pr?: string
  invoice?: string
}

interface LNURLInvoiceResponse {
  pr?: string
  invoice?: string
  status?: string
  reason?: string
}

// Función para decodificar LNURL
const decodeLNURL = (lnurl: string): string => {
  try {
    // Decodificar LNURL bech32
    const { words } = bech32.decode(lnurl, 1500)
    const url = Buffer.from(bech32.fromWords(words)).toString('utf8')
    return url
  } catch (error) {
    // URL directa
    return lnurl
  }
}

export default function WebLNBoostButton({
  receiverType = 'lightning',
  receiver = RECIPIENT_ADDRESS,
  amounts = [21, 100, 1000],
  labels = ['Café', 'Propina', 'Boost'],
  theme = 'orange',
  incrementSpeed = 50,
  incrementValue = 10,
  avatarSeed,
  avatarSet = 'set1',
  image
}: WebLNBoostButtonProps) {
  const [step, setStep] = useState<Step>("initial")
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState<string>("")
  const [webln, setWebln] = useState<WebLNProvider | null>(null)
  const [weblnError, setWeblnError] = useState<string>("")
  const [invoice, setInvoice] = useState<string>("")
  const [isHolding, setIsHolding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log('WebLNBoostButton props:', { 
      receiverType, 
      receiver, 
      amounts, 
      labels, 
      theme, 
      avatarSeed, 
      avatarSet, 
      image 
    });
    
    // Reset imageError when image url changes
    if (image) {
      setImageError(false);
    }
    
    // Log more detailed information about the avatar values
    console.log('Avatar debug info:', {
      hasAvatarSeed: Boolean(avatarSeed),
      avatarSeedValue: avatarSeed,
      avatarSetValue: avatarSet,
      hasImage: Boolean(image),
      imageValue: image
    });
    
  }, [receiverType, receiver, amounts, labels, theme, avatarSeed, avatarSet, image]);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      const mobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
      setIsMobile(mobile)
      if (mobile) {
        setWeblnError("") // No mostrar error de WebLN en móvil
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const initWebLN = async () => {
      try {
        // Solo intentar WebLN en desktop
        if (!isMobile) {
          const provider = await requestProvider()
          await provider.enable() // Intentar habilitar inmediatamente
          setWebln(provider)
          setWeblnError("")
        }
      } catch (err) {
        console.error("WebLN no está disponible:", err)
        setWebln(null)
        if (!isMobile) {
          setWeblnError("No se detectó una billetera compatible con WebLN")
        }
      }
    }
    initWebLN()
  }, [isMobile])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isHolding) {
      intervalId = setInterval(() => {
        setAmount(prev => prev + incrementValue)
      }, incrementSpeed)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isHolding, incrementValue, incrementSpeed])

  useEffect(() => {
    // Resetear el error de imagen cuando cambia la URL
    if (image) {
      setImageError(false);
      // Precargar la imagen para detectar errores temprano
      const img = new window.Image();
      img.src = image;
      img.onerror = () => {
        console.error('Error precargando imagen:', image);
        setImageError(true);
      };
    }
  }, [image]);

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAmountSelect = (selectedAmount: number) => {
    if (selectedAmount <= 0) return
    setAmount(selectedAmount)
  }

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value < 0) {
      setAmount(0)
    } else {
      setAmount(value)
    }
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value)
  }

  const resetToInitialState = () => {
    setAmount(0)
    setNote("")
    setStep("initial")
  }

  const generateInvoice = async () => {
    const msatsAmount = Math.round(amount * 1000)
    let response: Response
    
    try {
      if (receiverType === 'lnurl') {
        try {
          console.log('Procesando LNURL:', receiver)
          
          let decodedUrl: string
          
          if (receiver.toLowerCase().startsWith('lnurl')) {
            decodedUrl = decodeLNURL(receiver)
          } else {
            decodedUrl = receiver
          }
          
          console.log('URL decodificada o directa:', decodedUrl)
          
          const initialResponse = await fetch(decodedUrl)
          
          if (!initialResponse.ok) {
            console.error('Error en respuesta inicial:', initialResponse.status)
            throw new Error(`Error al obtener parámetros LNURL: ${initialResponse.status}`)
          }
          
          const lnurlPayParams = await initialResponse.json() as LNURLPayResponse
          console.log('Parámetros LNURL recibidos:', lnurlPayParams)
          
          if (!lnurlPayParams.tag || lnurlPayParams.tag !== 'payRequest') {
            console.error('Tag inválido:', lnurlPayParams.tag)
            throw new Error('El LNURL proporcionado no es un endpoint de pago válido')
          }
          
          console.log(`Verificando monto ${msatsAmount} entre ${lnurlPayParams.minSendable} y ${lnurlPayParams.maxSendable}`)
          if (msatsAmount < lnurlPayParams.minSendable || msatsAmount > lnurlPayParams.maxSendable) {
            throw new Error(`El monto debe estar entre ${lnurlPayParams.minSendable / 1000} y ${lnurlPayParams.maxSendable / 1000} sats`)
          }
          
          const callbackUrl = new URL(lnurlPayParams.callback)
          callbackUrl.searchParams.append('amount', msatsAmount.toString())
          
          let invoiceResponse: Response
          let invoiceData: LNURLInvoiceResponse
          
          try {
            if (note) {
              callbackUrl.searchParams.append('comment', note)
            }
            invoiceResponse = await fetch(callbackUrl.toString())
            invoiceData = await invoiceResponse.json()
            
            if (invoiceData.status === 'ERROR' && invoiceData.reason?.toLowerCase().includes('comment')) {
              console.log('El servicio no acepta comentarios, reintentando sin comentario')
              const retryUrl = new URL(lnurlPayParams.callback)
              retryUrl.searchParams.append('amount', msatsAmount.toString())
              invoiceResponse = await fetch(retryUrl.toString())
              invoiceData = await invoiceResponse.json()
            }
          } catch (error) {
            console.error('Error al obtener la factura:', error)
            throw new Error('Error al generar la factura LNURL')
          }
          
          if (!invoiceResponse.ok) {
            console.error('Error en respuesta de factura:', invoiceResponse.status)
            throw new Error(`Error al generar la factura LNURL: ${invoiceResponse.status}`)
          }
          
          console.log('Datos de factura recibidos:', invoiceData)
          
          if (invoiceData.pr) {
            console.log('Factura encontrada en pr')
            return invoiceData.pr
          } else if (invoiceData.invoice) {
            console.log('Factura encontrada en invoice')
            return invoiceData.invoice
          } else {
            console.error('No se encontró factura en la respuesta:', invoiceData)
            throw new Error('No se pudo obtener la factura del servicio LNURL')
          }
        } catch (error) {
          console.error('Error detallado en el proceso LNURL:', error)
          throw new Error(`Error procesando LNURL: ${error instanceof Error ? error.message : 'Error desconocido'}`)
        }
      }
      
      switch (receiverType) {
        case 'lightning':
          response = await fetch(
            `https://api.getalby.com/lnurl/generate-invoice?ln=${receiver}&amount=${msatsAmount}&comment=${encodeURIComponent(note || "Boost con Bitflow")}`
          )
          break
        case 'node':
          response = await fetch(
            `https://api.getalby.com/payments/keysend?node_id=${receiver}&amount=${msatsAmount}&comment=${encodeURIComponent(note || "Boost con Bitflow")}`
          )
          break
        default:
          throw new Error("Tipo de receptor no válido")
      }
      
      if (!response.ok) {
        throw new Error(`Error al generar factura: ${response.status}`)
      }

      const data = await response.json()
      console.log("Respuesta:", data)
      
      if (!data.invoice?.pr || typeof data.invoice.pr !== 'string') {
        throw new Error("La factura no se generó correctamente")
      }
      return data.invoice.pr as string
      
    } catch (error) {
      console.error("Error en generateInvoice:", error)
      throw error
    }
  }

  const validateReceiver = () => {
    if (!isClient) return true // No validar durante SSR
    if (!receiver) {
      console.warn("Por favor, ingresa una dirección de receptor")
      return false
    }
    return true
  }

  const handleBoost = async () => {
    if (isProcessing || !validateReceiver()) return

    try {
      setIsProcessing(true)
      console.log('Iniciando proceso de pago...')
      
      const invoice = await generateInvoice()
      console.log('Factura generada:', invoice)

      // En móvil o sin WebLN, ir directo al QR
      if (isMobile || !webln) {
        console.log('Mostrando QR (móvil o sin WebLN)')
        setInvoice(invoice)
        setStep("qr")
        return
      }

      // En desktop con WebLN
      try {
        console.log('Intentando pago con WebLN')
        await webln.sendPayment(invoice)
        console.log('Pago completado con éxito')
        resetToInitialState()
      } catch (error) {
        console.error("Error detallado en pago WebLN:", error)
        if (error instanceof Error && error.message?.includes('User rejected')) {
          setWeblnError("Pago cancelado por el usuario.")
          setStep("initial")
        } else {
          console.log('Mostrando QR después de error WebLN')
          setInvoice(invoice)
          setStep("qr")
        }
      }
    } catch (error: unknown) {
      console.error("Error detallado en handleBoost:", error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setWeblnError(`Error al generar la factura: ${errorMessage}`)
      setStep("initial")
    } finally {
      setIsProcessing(false)
    }
  }

  const themeColors = {
    orange: '#FF8C00',
    blue: '#3B81A2',
    green: '#2E7D32'
  }

  const currentThemeColor = themeColors[theme as keyof typeof themeColors] || themeColors.orange

  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: currentThemeColor }}>
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-[#3B81A2] rounded-full">
                  {image ? (
                    <CustomAvatar
                      imageUrl={image}
                      size={96}
                      className="w-full h-full"
                    />
                  ) : (
                    <RoboAvatar
                      seed={avatarSeed || 'default'}
                      set={avatarSet}
                      size={96}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-6">Bitflow</h1>
              <Button
                onClick={() => setStep("amount")}
                className="bg-white hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
                style={{ color: currentThemeColor }}
              >
                Donate Sats
              </Button>
            </div>
          </div>
        )

      case "amount":
        return (
          <>
            <h1 className="text-3xl font-bold text-white mb-6">How many Sats?</h1>
            <div className="flex gap-3 mb-4 w-full max-w-[280px] justify-center">
              {amounts.map((preset, index) => (
                <Button
                  key={preset}
                  onClick={() => handleAmountSelect(preset)}
                  className={`rounded-full px-4 py-3 flex-1 text-sm flex flex-col items-center leading-tight h-[70px] justify-center ${
                    amount === preset
                      ? "bg-white"
                      : "bg-transparent text-white border-2 border-white"
                  }`}
                  style={amount === preset ? { color: currentThemeColor } : {}}
                >
                  <span className="font-medium">{labels[index] || preset}</span>
                  <span className="text-xs mt-1">{preset} sats</span>
                </Button>
              ))}
            </div>
            <Button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              className="w-22 h-22 mb-4 rounded-full bg-white hover:bg-white/90 font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform"
              style={{ color: currentThemeColor }}
            >
              <div className="flex flex-col items-center justify-center h-full text-xs font-bold">
                <span>Press</span>
                <span>to Boost</span>
                <span className="text-lg mt-1 font-bold">⚡</span>
              </div>
            </Button>
            <div className="w-full max-w-[280px] flex justify-center">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount || ""}
                onChange={handleCustomAmount}
                placeholder="Enter an amount"
                className="w-full px-4 py-2 mb-4 rounded-full text-center text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2"
                style={{ 
                  color: currentThemeColor,
                  '--tw-ring-color': currentThemeColor
                } as React.CSSProperties}
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setStep("initial")}
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("note")}
                className="bg-white hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
                style={{ color: currentThemeColor }}
              >
                Next
              </Button>
            </div>
          </>
        )

      case "note":
        return (
          <>
            <h1 className="text-3xl font-bold text-white mb-8">Want to add a note?</h1>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="Enter your note"
              className="w-full max-w-[320px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2"
              style={{ 
                color: currentThemeColor,
                '--tw-ring-color': currentThemeColor
              } as React.CSSProperties}
            />
            <div className="flex gap-4">
              <Button
                onClick={() => setStep("amount")}
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={handleBoost}
                disabled={isProcessing}
                className={`bg-white hover:bg-white/90 font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ color: currentThemeColor }}
              >
                {isProcessing ? 'Processing...' : 'Next'}
              </Button>
            </div>
          </>
        )

      case "qr":
        return (
          <div className="w-full flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCodeSVG value={invoice} size={200} />
            </div>
            <div className="w-full bg-[#2d2d2d] p-3 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/70">Lightning Invoice:</p>
                <button
                  onClick={() => navigator.clipboard.writeText(invoice)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                >
                  Copiar
                </button>
              </div>
              <p className="text-[10px] text-white/90 font-mono truncate">
                {invoice}
              </p>
            </div>
            <Button
              onClick={resetToInitialState}
              className="bg-white hover:bg-white/90 font-bold text-lg px-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
              style={{ color: currentThemeColor }}
            >
              Done?
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-[410px] h-[410px]">
        <div 
          className="flex flex-col items-center justify-center w-full h-full rounded-3xl p-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden"
          style={{ backgroundColor: currentThemeColor }}
        >
          {renderStep()}
        </div>
      </div>
      {weblnError && (
        <div className="w-[400px]">
          <WebLNGuide />
        </div>
      )}
    </div>
  )
}

