import WebLNBoostButton from '@/app/components/webln-boost-button'
import WidgetStyles from '@/app/widget/[id]/widget-styles'

interface PageProps {
  searchParams: {
    receiverType: 'lightning' | 'lnurl' | 'node'
    receiver: string
    amounts: string
    labels: string
    theme: string
    useCustomImage: string
    image?: string
    avatarSeed?: string
    avatarSet?: string
  }
}

export default function WidgetParamsPage({ searchParams }: PageProps) {
  const {
    receiverType,
    receiver,
    amounts,
    labels,
    theme,
    useCustomImage,
    image,
    avatarSeed,
    avatarSet,
  } = searchParams

  return (
    <div className="bg-transparent">
      <WidgetStyles />
      <div className="flex items-center justify-center min-h-screen">
        <WebLNBoostButton
          receiverType={receiverType}
          receiver={receiver}
          amounts={amounts.split(',').map(Number)}
          labels={labels.split(',')}
          theme={theme}
          image={useCustomImage === 'true' ? image : undefined}
          avatarSeed={useCustomImage !== 'true' ? avatarSeed : undefined}
          avatarSet={useCustomImage !== 'true' ? avatarSet as any : undefined}
          hideWebLNGuide={true}
        />
      </div>
    </div>
  )
} 