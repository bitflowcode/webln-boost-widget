"use client"

import { useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'
import { FC } from 'react'

interface WidgetConfig {
  receiverType: 'lightning' | 'lnurl' | 'node'
  receiver: string
  amounts: string
  labels: string
  theme: string
  useCustomImage: boolean
  avatarSeed?: string
  avatarSet?: 'set1' | 'set2' | 'set3' | 'set4' | 'set5'
  image?: string
}

interface WidgetClientProps {
  id: string
}

const WidgetClient: FC<WidgetClientProps> = ({ id }) => {
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Función para intentar decodificar manualmente el ID
  const tryDecodingId = (encodedId: string) => {
    try {
      // Primero intentamos decodificar directamente
      const decodedString = atob(encodedId);
      const decodedJson = JSON.parse(decodedString);
      return {
        success: true,
        method: 'direct',
        data: decodedJson
      };
    } catch (directError) {
      try {
        // Si falla, intentamos corregir los caracteres URL-safe
        let fixedId = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        // Añadir padding si es necesario
        while (fixedId.length % 4) {
          fixedId += '=';
        }
        const decodedString = atob(fixedId);
        const decodedJson = JSON.parse(decodedString);
        return {
          success: true,
          method: 'url-safe-corrected',
          data: decodedJson
        };
      } catch (fixedError) {
        return {
          success: false,
          method: 'failed',
          error: {
            directError,
            fixedError
          }
        };
      }
    }
  };

  useEffect(() => {
    // Intentar decodificar el ID de diferentes formas para depuración
    const debugResult = tryDecodingId(id);
    setDebugInfo(JSON.stringify(debugResult, null, 2));
    
    try {
      console.log('ID recibido:', id);
      
      // Decodificar la configuración desde el ID
      let decodedConfig;
      try {
        // Método estándar
        decodedConfig = JSON.parse(atob(id));
      } catch (_) {
        // Método alternativo para URL-safe
        const fixedId = id.replace(/-/g, '+').replace(/_/g, '/');
        decodedConfig = JSON.parse(atob(fixedId));
      }
      
      console.log('Widget decodificado:', decodedConfig);
      
      // Validar y limpiar la configuración
      const cleanConfig: WidgetConfig = {
        receiverType: decodedConfig.receiverType,
        receiver: decodedConfig.receiver,
        theme: decodedConfig.theme,
        amounts: decodedConfig.amounts,
        labels: decodedConfig.labels,
        useCustomImage: false // Por defecto, no usar imagen personalizada
      };
      
      // Procesar imagen o avatar
      if (decodedConfig.image && decodedConfig.image.startsWith('https://')) {
        cleanConfig.image = decodedConfig.image;
        cleanConfig.useCustomImage = true;
        console.log('Usando imagen personalizada:', cleanConfig.image);
      } else {
        cleanConfig.useCustomImage = false;
        cleanConfig.avatarSeed = decodedConfig.avatarSeed || Math.random().toString(36).substring(2, 10);
        cleanConfig.avatarSet = decodedConfig.avatarSet || 'set1';
        console.log('Usando avatar con seed:', cleanConfig.avatarSeed);
      }
      
      console.log('Configuración final:', cleanConfig);
      setConfig(cleanConfig);
    } catch (err) {
      console.error('Error al decodificar la configuración:', err);
      setError(`Configuración de widget inválida: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <pre className="mt-4 text-xs text-left bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-60">
            {debugInfo}
          </pre>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  // Convertir los montos de string a array de números
  const amounts = config.amounts.split(',').map(Number)
  const labels = config.labels.split(',')

  console.log('Renderizando WebLNBoostButton con configuración:', {
    receiverType: config.receiverType,
    receiver: config.receiver,
    amounts,
    labels,
    theme: config.theme,
    avatarSeed: config.avatarSeed,
    avatarSet: config.avatarSet,
    image: config.image,
    useCustomImage: config.useCustomImage
  });

  // Agregar un log detallado de la configuración antes de renderizar
  console.log('Configuración final antes de renderizar:', JSON.stringify(config, null, 2));

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={config.receiverType}
        receiver={config.receiver}
        amounts={amounts}
        labels={labels}
        theme={config.theme}
        avatarSeed={config.avatarSeed}
        avatarSet={config.avatarSet}
        image={config.image}
      />
    </div>
  )
}

export default WidgetClient 