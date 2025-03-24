import { Metadata } from 'next'
import WidgetClient from './widget-client'
import WidgetStyles from './widget-styles'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const decodedConfig = JSON.parse(atob(resolvedParams.id))
    
    return {
      title: `Bitflow - Donación para ${decodedConfig.receiver}`,
      description: 'Haz una donación usando Bitcoin Lightning Network',
      openGraph: {
        title: `Bitflow - Donación para ${decodedConfig.receiver}`,
        description: 'Haz una donación usando Bitcoin Lightning Network',
        images: ['/assets/images/bitflow-preview.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Bitflow - Donación para ${decodedConfig.receiver}`,
        description: 'Haz una donación usando Bitcoin Lightning Network',
        images: ['/assets/images/bitflow-preview.png'],
      },
    }
  } catch (error) {
    return {
      title: 'Bitflow Widget',
      description: 'Widget de donaciones Bitcoin Lightning',
    }
  }
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