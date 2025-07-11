"use client"

import { useState, useEffect, useCallback } from "react"
import { requestProvider, type WebLNProvider } from "webln"
import { Button } from "@/app/components/ui/button"
import { QRCodeSVG } from "qrcode.react"

import RoboAvatar from "./ui/robo-avatar"
import CustomAvatar from "./ui/custom-avatar"
import { bech32 } from 'bech32'

// Definir tipos para window.webln y window.alby
declare global {
  interface Window {
    webln?: WebLNProvider & { _isEnabled?: boolean }
    alby?: WebLNProvider & { _isEnabled?: boolean }
  }
}

const RECIPIENT_ADDRESS = "bitflowz@getalby.com"

interface WebLNBoostButtonProps {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: number[]
  labels: string[] | {
    amount: string
    note: string
    submit: string
  }
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
    const { words } = bech32.decode(lnurl, 2000)
    const data = bech32.fromWords(words)
    const url = new TextDecoder().decode(new Uint8Array(data))
    return url
  } catch {
    // Si falla el decode, asumimos que es una URL directa
    return lnurl
  }
}

const getLabel = (labels: string[] | { amount: string, note: string, submit: string }, index: number): string => {
  if (Array.isArray(labels)) {
    return labels[index] || ''
  }
  return ''
}

const MAX_WEBLN_RETRIES = 5;
const WEBLN_RETRY_DELAY = 1000;

const waitForWebLN = async (timeout = 10000) => {
  const start = Date.now();
  let attempts = 0;
  
  while (Date.now() - start < timeout && attempts < MAX_WEBLN_RETRIES) {
    try {
      // Verificar disponibilidad de WebLN en el contexto actual
      const hasWebLN = typeof window !== 'undefined' && (
        (window.webln && typeof window.webln.enable === 'function') || 
        (window.alby && typeof window.alby.enable === 'function')
      );
      
      if (hasWebLN) {
        return true;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, WEBLN_RETRY_DELAY));
    } catch (error) {
      console.error('Error al verificar WebLN:', error);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, WEBLN_RETRY_DELAY));
    }
  }
  
  return false;
};

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
  const [weblnError, setWeblnError] = useState<string>("") // eslint-disable-line @typescript-eslint/no-unused-vars
  const [invoice, setInvoice] = useState<string>("")
  const [isHolding, setIsHolding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
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
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleWebLNError = useCallback((error: unknown) => {
    setWebln(null)
    if (!isMobile) {
      if (error instanceof Error) {
        if (error.message?.toLowerCase().includes('not authorized') || 
            error.message?.toLowerCase().includes('permission denied')) {
          setWeblnError("Este sitio necesita autorización en Alby. Por favor, autoriza el sitio en la extensión y recarga la página.")
        } else if (error.message?.toLowerCase().includes('no provider available')) {
          setWeblnError("No se detectó una billetera compatible con WebLN")
        } else if (error.message?.toLowerCase().includes('user rejected')) {
          setWeblnError("Pago cancelado por el usuario")
        } else {
          setWeblnError("Error al inicializar WebLN")
        }
      } else {
        setWeblnError("Error desconocido al inicializar WebLN")
      }
    }
  }, [isMobile])

  useEffect(() => {
    const initWebLN = async () => {
      try {
        console.log('Iniciando initWebLN...');
        // Solo intentar WebLN en desktop
        if (!isMobile) {
          console.log('Verificando disponibilidad de WebLN...');
          const hasWebLN = await waitForWebLN();
          if (hasWebLN) {
            console.log('WebLN detectado, intentando habilitar...');
            try {
              const provider = await requestProvider();
              if (provider) {
                await provider.enable();
                console.log('WebLN habilitado correctamente');
                setWebln(provider);
                setWeblnError("");
              }
            } catch (enableError) {
              console.log('Error al habilitar WebLN:', enableError);
              setWeblnError("Haz clic en 'Donate Sats' para habilitar el pago directo con Alby");
            }
          } else {
            console.log('WebLN no detectado después de múltiples intentos');
            setWeblnError("No se detectó una billetera compatible con WebLN");
          }
        }
      } catch (error) {
        console.error('Error al inicializar WebLN:', error);
        handleWebLNError(error);
      }
    };
    setWebln(null);
    setWeblnError("");
    initWebLN();
    return () => {
      setWebln(null);
      setWeblnError("");
    };
  }, [isMobile, handleWebLNError]);

  const handleUserConsent = async () => {
    try {
      console.log('Iniciando habilitación de WebLN...')
      
      const provider = await requestProvider()
      
      console.log('Provider obtenido:', provider)
      
      if (!provider) {
        throw new Error('No se pudo obtener el proveedor WebLN')
      }

      // Verificar si ya está habilitado
      if ((provider as WebLNProvider & { _isEnabled?: boolean })._isEnabled) {
        console.log('WebLN ya está habilitado')
        setWebln(provider)
        setWeblnError("")
        return
      }
      
      await provider.enable()
      console.log('WebLN habilitado correctamente')
      setWebln(provider)
      setWeblnError("")
    } catch (error) {
      console.error("Error al habilitar WebLN:", error)
      handleWebLNError(error)
    }
  }

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
          } catch (invoiceError) {
            console.error('Error al obtener la factura:', invoiceError)
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
        } catch (lnurlError) {
          console.error('Error detallado en el proceso LNURL:', lnurlError)
          throw new Error(`Error procesando LNURL: ${lnurlError instanceof Error ? lnurlError.message : 'Error desconocido'}`)
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
      
    } catch (generateError) {
      console.error("Error en generateInvoice:", generateError)
      throw generateError
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
      } catch (weblnError) {
        console.error("Error detallado en pago WebLN:", weblnError)
        if (weblnError instanceof Error) {
          if (weblnError.message?.includes('User rejected')) {
            setWeblnError("Pago cancelado por el usuario.")
            setStep("initial")
          } else if (weblnError.message?.includes('not authorized') || weblnError.message?.includes('Permission denied')) {
            setWeblnError("Este sitio necesita autorización en Alby para pagar directamente. Por favor, autoriza el sitio en la extensión Alby y vuelve a intentarlo.")
            setStep("qr")
          } else {
            console.log('Mostrando QR después de error WebLN')
            setInvoice(invoice)
            setStep("qr")
          }
        } else {
          console.log('Mostrando QR después de error WebLN')
          setInvoice(invoice)
          setStep("qr")
        }
      }
    } catch (boostError: unknown) {
      console.error("Error detallado en handleBoost:", boostError)
      const errorMessage = boostError instanceof Error ? boostError.message : 'Error desconocido'
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

  const renderAvatar = () => {
    if (image) {
      let imageUrl = image
      if (/^[A-Za-z0-9_-]+={0,2}$/.test(image)) {
        try {
          const base64 = image
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(image.length + ((4 - (image.length % 4)) % 4), '=')
          const decoded = atob(base64)
          if (decoded.startsWith('http')) {
            imageUrl = decoded
          }
        } catch (e) {
          console.error('Error decodificando URL en renderAvatar:', e)
        }
      }
      return <CustomAvatar imageUrl={imageUrl} size={128} />
    }
    return <RoboAvatar seed={avatarSeed || 'default'} set={avatarSet} size={128} />
  }

  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 relative">
              {renderAvatar()}
            </div>
            <h2 className="text-4xl font-bold text-white">Bitflow</h2>
            <Button
              onClick={async () => {
                await handleUserConsent()
                setStep("amount")
              }}
              className="bg-white hover:bg-white/90 font-bold text-lg px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
              style={{ color: currentThemeColor }}
            >
              Donate Sats
            </Button>
            {receiverType === 'lightning' && receiver && (
              <div className="mt-2 text-white/80 text-sm break-all text-center">
                <span className="font-mono">{receiver}</span>
              </div>
            )}
          </div>
        )

      case "amount":
        return (
          <>
            <h1 className="text-3xl font-bold text-white mb-6">How many Sats?</h1>
            <div className="flex gap-4 mb-4 w-full max-w-[380px] justify-center">
              {amounts.map((preset, index) => (
                <Button
                  key={preset}
                  onClick={() => handleAmountSelect(preset)}
                  className={`rounded-full w-[75px] h-[75px] text-sm font-bold flex flex-col items-center leading-tight justify-center ${
                    amount === preset
                      ? "bg-white"
                      : "bg-transparent text-white border-2 border-white"
                  }`}
                  style={amount === preset ? { color: currentThemeColor } : {}}
                >
                  <span className="font-medium text-[11px]">{getLabel(labels, index) || preset}</span>
                  <span className="text-[10px] mt-0.5">{preset} sats</span>
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
            <div className="w-full max-w-[300px] flex justify-center">
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
              placeholder="Enter your note here"
              className="w-full max-w-[300px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2"
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
          <div className="w-full h-full flex flex-col items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-4 overflow-y-auto max-h-[90%] w-full">
              <div className="bg-white p-4 rounded-lg flex-shrink-0">
                <QRCodeSVG value={invoice} size={200} />
              </div>
              <div className="w-full max-w-[320px] bg-[#2d2d2d] p-3 rounded-lg flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/70">Lightning Invoice:</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(invoice)}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-[10px] text-white/90 font-mono break-all whitespace-pre-wrap">
                  {invoice}
                </p>
              </div>
            </div>
            <Button
              onClick={resetToInitialState}
              className="bg-white hover:bg-white/90 font-bold text-lg px-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200 flex-shrink-0"
              style={{ color: currentThemeColor }}
            >
              Done?
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center bg-transparent">
      <div className="w-[460px] h-[420px] relative flex items-center justify-center bg-transparent">
        <div 
          className="w-[420px] h-[420px] rounded-2xl p-6 space-y-4 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: currentThemeColor,
            minHeight: '420px',
            minWidth: '420px'
          }}
        >
          {renderStep()}
        </div>

      </div>
    </div>
  )
}


