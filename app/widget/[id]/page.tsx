import WidgetClient from './widget-client'
import WidgetStyles from './widget-styles'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function Page({ params }: PageProps) {
  const resolvedParams = await params
  
  return (
    <div className="bg-transparent">
      <WidgetStyles />
      <WidgetClient id={resolvedParams.id} />
    </div>
  )
}

export default Page 