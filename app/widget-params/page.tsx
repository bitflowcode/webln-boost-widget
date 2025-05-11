import WebLNBoostButton from '@/app/components/webln-boost-button'
import WidgetStyles from '@/app/widget/[id]/widget-styles'

type AvatarSet = 'set1' | 'set2' | 'set3' | 'set4' | 'set5'

interface WidgetParams {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: string
  labels: string
  theme: string
  useCustomImage: string
  image?: string
  avatarSeed?: string
  avatarSet?: AvatarSet
}

interface PageProps {
  searchParams: Promise<WidgetParams>
}

export default async function WidgetParamsPage({ searchParams }: PageProps) {
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
  } = await searchParams

  return (
    <div className="bg-transparent">
      <WidgetStyles />
      <div className="flex items-center justify-center min-h-screen">
        <WebLNBoostButton
          receiverType={receiverType as 'lightning' | 'lnurl' | 'node'}
          receiver={receiver}
          amounts={amounts.split(',').map(Number)}
          labels={labels.split(',')}
          theme={theme}
          image={useCustomImage === 'true' ? image : undefined}
          avatarSeed={useCustomImage !== 'true' ? avatarSeed : undefined}
          avatarSet={useCustomImage !== 'true' ? avatarSet : undefined}
        />
      </div>
    </div>
  )
} 