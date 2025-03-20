import WidgetParamsClient from './widget-params-client'

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function WidgetParamsPage({ searchParams }: PageProps) {
  // Pasar los parámetros de URL directamente al componente cliente
  return (
    <>
      <WidgetParamsClient params={searchParams} />
    </>
  )
} 