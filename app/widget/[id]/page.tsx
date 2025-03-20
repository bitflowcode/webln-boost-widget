import WidgetClient from './widget-client'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function Page({ params }: PageProps) {
  const resolvedParams = await params
  
  // Podemos intentar decodificar el ID en el servidor para depuración
  try {
    // Lamentablemente, atob no está disponible en el servidor de Next.js
    // Esta parte la manejará el cliente
    console.log("ID recibido en el servidor:", resolvedParams.id);
  } catch (error) {
    console.error("Error al decodificar en el servidor:", error);
  }
  
  return (
    <>
      {/* Pasar el ID al componente cliente para procesamiento */}
      <WidgetClient id={resolvedParams.id} />
    </>
  )
}

export default Page 