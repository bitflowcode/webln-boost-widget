import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="mb-4">La página que buscas no existe.</p>
        <Link
          href="/"
          className="bg-[#FF8C00] text-white px-4 py-2 rounded-full hover:bg-[#FF8C00]/90 transition-colors inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
} 