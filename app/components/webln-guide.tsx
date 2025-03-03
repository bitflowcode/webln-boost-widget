import { Button } from "@/app/components/ui/button"

export function WebLNGuide() {
  const handleInstallClick = () => {
    window.open('https://getalby.com', '_blank')
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ¿Quieres hacer pagos Lightning fácilmente?
      </h2>
      <p className="text-gray-700 mb-6">
        Instala Alby, la billetera Bitcoin Lightning para tu navegador.
        Con Alby podrás hacer pagos con un solo click.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Button
          onClick={handleInstallClick}
          className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
        >
          Instalar Alby
        </Button>
        <p className="text-gray-600 text-sm">
          Es gratis, seguro y fácil de usar
        </p>
      </div>
    </div>
  )
} 