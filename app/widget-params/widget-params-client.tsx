"use client"

import { FC, useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'

type AvatarSet = 'set1' | 'set2' | 'set3' | 'set4' | 'set5'

interface WidgetConfig {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: number[]
  labels: string[]
  theme: string
  useCustomImage: boolean
  image?: string
  avatarSeed?: string
  avatarSet?: AvatarSet
}

interface WidgetParamsClientProps {
  params: { [key: string]: string | string[] | undefined }
}

const WidgetParamsClient: FC<WidgetParamsClientProps> = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    receiverType: 'lightning',
    receiver: '',
    amounts: [21, 100, 1000],
    labels: ['Café', 'Propina', 'Boost'],
    theme: 'orange',
    useCustomImage: false
  })

  useEffect(() => {
    const getParamAsBoolean = (key: string): boolean => {
      const value = params[key]
      return value === 'true'
    }

    const getParamAsArray = (key: string, defaultValue: string[]): string[] => {
      const value = params[key]
      if (typeof value === 'string') {
        return value.split(',')
      }
      return defaultValue
    }

    const getParamAsNumberArray = (key: string, defaultValue: number[]): number[] => {
      const value = params[key]
      if (typeof value === 'string') {
        return value.split(',').map(Number)
      }
      return defaultValue
    }

    const getParamAsAvatarSet = (value: string | string[] | undefined): AvatarSet | undefined => {
      if (typeof value === 'string' && ['set1', 'set2', 'set3', 'set4', 'set5'].includes(value)) {
        return value as AvatarSet
      }
      return undefined
    }

    const config: WidgetConfig = {
      receiverType: (params.receiverType as 'lightning' | 'lnurl' | 'node') || 'lightning',
      receiver: (params.receiver as string) || '',
      amounts: getParamAsNumberArray('amounts', [21, 100, 1000]),
      labels: getParamAsArray('labels', ['Café', 'Propina', 'Boost']),
      theme: (params.theme as string) || 'orange',
      useCustomImage: getParamAsBoolean('useCustomImage'),
      image: params.image as string | undefined,
      avatarSeed: params.avatarSeed as string | undefined,
      avatarSet: getParamAsAvatarSet(params.avatarSet)
    }

    setWidgetConfig(config)
    setIsLoading(false)
  }, [params])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={widgetConfig.receiverType}
        receiver={widgetConfig.receiver}
        amounts={widgetConfig.amounts}
        labels={widgetConfig.labels}
        theme={widgetConfig.theme}
        image={widgetConfig.useCustomImage ? widgetConfig.image : undefined}
        avatarSeed={!widgetConfig.useCustomImage ? widgetConfig.avatarSeed : undefined}
        avatarSet={!widgetConfig.useCustomImage ? widgetConfig.avatarSet : undefined}
      />
    </div>
  )
}

export default WidgetParamsClient 