"use client"

import { useState, useEffect, useRef } from "react"
import { requestProvider, type WebLNProvider } from "webln"
import { Button } from "@/app/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { WebLNGuide } from "./webln-guide"
import Image from "next/image"

const RECIPIENT_ADDRESS = "bitflowz@getalby.com"

interface WebLNBoostButtonProps {
  defaultAmount?: number
  incrementSpeed?: number
  incrementValue?: number
}

type Step = "initial" | "amount" | "note" | "qr"

interface WebLNError extends Error {
  message: string;
}

export default function WebLNBoostButton({
  defaultAmount = 100,
  incrementSpeed = 50,
  incrementValue = 10,
}: WebLNBoostButtonProps) {
  const [step, setStep] = useState<Step>("initial")
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [note, setNote] = useState<string>("")
  const [webln, setWebln] = useState<WebLNProvider | null>(null)
  const [weblnError, setWeblnError] = useState<string>("")
  const [invoice, setInvoice] = useState<string>("")
  const [isHolding, setIsHolding] = useState(false)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const initWebLN = async () => {
      try {
        const provider = await requestProvider()
        setWebln(provider)
        setWeblnError("")
      } catch (err) {
        console.error("WebLN no está disponible:", err)
        setWeblnError("No se detectó una billetera compatible con WebLN")
      }
    }
    initWebLN()
  }, [])

  useEffect(() => {
    if (isHolding) {
      setAmount(0)
      holdTimerRef.current = setInterval(() => {
        setAmount(prev => prev + incrementValue)
      }, incrementSpeed)
    } else if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
    }

    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current)
      }
    }
  }, [isHolding, incrementValue, incrementSpeed])

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount)
  }

  const handleCustomAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "" ? defaultAmount : parseInt(event.target.value)
    if (!isNaN(value)) {
      setAmount(value)
    }
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value)
  }

  const resetToInitialState = () => {
    setAmount(defaultAmount)
    setNote("")
    setStep("initial")
  }

  const handleBoost = async () => {
    if (!webln) {
      setStep("initial")
      return
    }

    try {
      await webln.enable()
      let invoicePr: string | null = null
      
      // Si el usuario tiene WebLN (Alby), intentamos pago directo
      try {
        // Convertimos la cantidad a milisatoshis (debe ser un entero)
        const msatsAmount = Math.round(amount * 1000)
        
        // Obtenemos la factura usando LNURL
        const response = await fetch(
          `https://getalby.com/lnurlp/${RECIPIENT_ADDRESS}/callback?amount=${msatsAmount}&comment=${encodeURIComponent(note || "Boost con Bitflow")}`
        )
        
        if (!response.ok) {
          throw new Error(`Error al generar factura: ${response.status}`)
        }

        const data = await response.json() as { pr: string }
        invoicePr = data.pr
        
        // Intentamos pagar con WebLN
        await webln.sendPayment(invoicePr)
        // Si el pago es exitoso, mostramos mensaje de éxito
        resetToInitialState()
      } catch (error: unknown) {
        console.error("Error al enviar pago directo:", error)
        // Si falla el pago directo, mostramos el QR como fallback
        if (error instanceof Error && error.message?.includes('User rejected')) {
          setWeblnError("Pago cancelado por el usuario.")
          setStep("initial")
        } else if (invoicePr) {
          // Usamos la última factura generada para mostrar el QR
          setInvoice(invoicePr)
          setStep("qr")
        } else {
          setWeblnError("Error al generar la factura. Por favor, intenta de nuevo.")
          setStep("initial")
        }
      }
    } catch (error) {
      console.error("Error al inicializar WebLN:", error)
      setWeblnError("Error al inicializar la billetera. Por favor, intenta de nuevo.")
      setStep("initial")
    }
  }

  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <>
            <div className="relative w-32 h-32 bg-[#3B81A2] rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/images/bitflow-avatar.png"
                alt="Bitflow"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white">Bitflow</h1>
            <Button
              onClick={() => setStep("amount")}
              disabled={!webln}
              className={`bg-white hover:bg-white/90 text-[#3B81A2] font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200
                ${!webln && 'opacity-50 cursor-not-allowed hover:bg-white hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]'}`}
            >
              Donate Sats
            </Button>
          </>
        )

      case "amount":
        return (
          <>
            <h1 className="text-3xl font-bold text-white mb-6">How many Sats?</h1>
            <div className="flex gap-3 mb-4 w-full max-w-[280px] justify-center">
              {[21, 100, 1000].map((preset) => (
                <Button
                  key={preset}
                  onClick={() => handleAmountSelect(preset)}
                  className={`rounded-full px-4 py-2 flex-1 text-sm ${
                    amount === preset
                      ? "bg-white text-[#3B81A2]"
                      : "bg-transparent text-white border-2 border-white"
                  }`}
                >
                  {preset === 1000 ? "1k" : preset}
                </Button>
              ))}
            </div>
            <Button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              className="w-22 h-22 mb-4 rounded-full bg-white hover:bg-white/90 text-[#3B81A2] font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform"
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
                value={amount === defaultAmount ? "" : amount}
                onChange={handleCustomAmount}
                placeholder="Enter an amount"
                className="w-full px-4 py-2 mb-4 rounded-full text-center text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B81A2]"
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
                className="bg-white hover:bg-white/90 text-[#3B81A2] font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
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
              className="w-full max-w-[320px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none"
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
                className="bg-white hover:bg-white/90 text-[#3B81A2] font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
              >
                Next
              </Button>
            </div>
          </>
        )

      case "qr":
        return (
          <>
            <div className="bg-white p-4 rounded-lg mb-6">
              <QRCodeSVG value={invoice} size={256} />
            </div>
            <Button
              onClick={resetToInitialState}
              className="bg-white hover:bg-white/90 text-[#3B81A2] font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
            >
              Done?
            </Button>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-[410px] h-[410px]">
        <div className={`flex flex-col items-center justify-center w-full h-full bg-[#FF8C00] rounded-3xl p-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300
          ${!webln && 'opacity-95'}`}
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

