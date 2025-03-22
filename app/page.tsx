import WebLNBoostButton from "./components/webln-boost-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Bitflow Widget</h1>
        <p className="text-xl mb-8">Acepta propinas y donaciones en Bitcoin Lightning de forma simple y elegante</p>
        <a
          href="/create"
          className="bg-[#FF8C00] text-white px-8 py-3 rounded-full font-bold hover:bg-[#FF8C00]/90 transition-colors inline-block"
        >
          Crear Mi Widget
        </a>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pruébalo</h2>
        <div className="flex flex-col items-center gap-8">
          <WebLNBoostButton
            receiverType="lightning"
            receiver="bitflowz@getalby.com"
            amounts={[21, 100, 1000]}
            labels={['Café', 'Propina', 'Boost']}
            image="/assets/images/bitflow-avatar.png"
            theme="orange"
            hideWebLNGuide={true}
          />
          
          <div className="relative group cursor-help">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">
              <span>¿Pagos con un click?</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-current">ℹ</span>
            </button>
            
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[320px] bg-white rounded-xl shadow-xl p-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">✨ Fácil de Usar</h3>
            <p>Configura tu widget en minutos y empieza a recibir donaciones</p>
          </div>
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">⚡ Lightning Network</h3>
            <p>Pagos instantáneos con comisiones mínimas</p>
          </div>
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🔒 Sin Custodias</h3>
            <p>Los pagos van directamente a tu wallet, sin intermediarios</p>
          </div>
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">📱 Responsive</h3>
            <p>Funciona perfectamente en dispositivos móviles y escritorio</p>
          </div>
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🎨 Personalizable</h3>
            <p>Adapta el diseño a tu marca y necesidades</p>
          </div>
          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🔌 Fácil Integración</h3>
            <p>Simple de integrar en cualquier sitio web</p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Cómo Empezar</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-8">
            <li className="flex items-start">
              <span className="bg-[#FF8C00] w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">1</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Crea tu Widget</h3>
                <p>Ve a la página de creación y configura tu widget según tus necesidades</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#FF8C00] w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">2</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Configura los Detalles</h3>
                <p>Ingresa tu Lightning Address, LNURL o Node ID y personaliza la apariencia</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#FF8C00] w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">3</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Copia el Código</h3>
                <p>Obtén el código de integración generado automáticamente</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-[#FF8C00] w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">4</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Integra en tu Web</h3>
                <p>Pega el código en tu sitio web y empieza a recibir donaciones</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  )
}