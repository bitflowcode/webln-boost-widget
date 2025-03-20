"use client"

import { FC, useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'

type ReceiverType = 'lightning' | 'lnurl' | 'node'
type AvatarSet = 'set1' | 'set2' | 'set3' | 'set4' | 'set5'

interface WidgetParamsClientProps {
  params: { [key: string]: string | string[] | undefined }
}

interface Labels {
  amount: string
  note: string
  submit: string
}

interface WidgetConfig {
  receiverType: ReceiverType
  receiver: string
  amounts: number[]
  labels: string[]
  theme: string
  useCustomImage: boolean
  rawImage?: string
  image?: string
  avatarSeed?: string
  avatarSet?: AvatarSet
}

interface WidgetState extends WidgetConfig {
  formLabels: Labels
  code: string
}

const generateWidgetCode = (config: WidgetConfig): string => {
  // Implementación de la generación del código del widget
  return `// Código del widget generado`
}

// Función para validar URL seguras
const isValidHttpsUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

const WidgetParamsClient: FC<WidgetParamsClientProps> = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [widgetState, setWidgetState] = useState<WidgetState>({
    receiverType: 'lightning',
    receiver: '',
    amounts: [21, 100, 1000],
    labels: ['Café', 'Propina', 'Boost'],
    theme: 'orange',
    useCustomImage: false,
    avatarSet: 'set1',
    formLabels: {
      amount: "Cantidad",
      note: "Nota",
      submit: "Enviar"
    },
    code: ''
  })

  // Función para obtener parámetros
  const getParamAsString = (params: { [key: string]: string | string[] | undefined }, key: string): string | undefined => {
    const value = params[key]
    return Array.isArray(value) ? value[0] : value
  }

  const getParamAsBoolean = (params: { [key: string]: string | string[] | undefined }, key: string): boolean => {
    const value = getParamAsString(params, key)
    return value === 'true'
  }

  useEffect(() => {
    // Extraer parámetros
    const receiverType = (getParamAsString(params, 'receiverType') || 'lightning') as ReceiverType
    const receiver = getParamAsString(params, 'receiver') || ''
    const amountsStr = getParamAsString(params, 'amounts') || '21,100,1000'
    const amounts = amountsStr.split(',').map(Number)
    const buttonLabels = getParamAsString(params, 'labels')?.split(',') || ['Café', 'Propina', 'Boost']
    const theme = getParamAsString(params, 'theme') || 'orange'
    const useCustomImage = getParamAsBoolean(params, 'useCustomImage')
    const rawImage = getParamAsString(params, 'image')
    const image = rawImage ? decodeURIComponent(rawImage) : undefined
    const avatarSeed = getParamAsString(params, 'avatarSeed')
    const avatarSet = (getParamAsString(params, 'avatarSet') || 'set1') as AvatarSet

    // Generar código del widget
    const widgetConfig: WidgetConfig = {
      receiverType,
      receiver,
      amounts,
      labels: buttonLabels,
      theme,
      useCustomImage,
      rawImage,
      image,
      avatarSeed,
      avatarSet
    }

    const code = generateWidgetCode(widgetConfig)
    
    setWidgetState({
      ...widgetConfig,
      formLabels: {
        amount: "Cantidad",
        note: "Nota",
        submit: "Enviar"
      },
      code
    })
    
    setIsLoading(false)
  }, [params, getParamAsBoolean])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={widgetState.receiverType}
        receiver={widgetState.receiver}
        amounts={widgetState.amounts}
        labels={widgetState.labels}
        theme={widgetState.theme}
        avatarSeed={!widgetState.useCustomImage ? widgetState.avatarSeed : undefined}
        avatarSet={!widgetState.useCustomImage ? widgetState.avatarSet : undefined}
        image={widgetState.useCustomImage ? widgetState.image : undefined}
      />
    </div>
  )
}

export default WidgetParamsClient 