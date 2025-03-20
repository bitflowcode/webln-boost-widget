"use client"

import { useEffect, useState } from 'react'
import WebLNBoostButton from '@/app/components/webln-boost-button'
import { FC } from 'react'

interface WidgetParamsClientProps {
  params: { [key: string]: string | string[] | undefined }
}

// Función auxiliar para obtener un valor de parámetro como string
const getParamAsString = (params: { [key: string]: string | string[] | undefined }, key: string): string | undefined => {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

// Función auxiliar para convertir string a boolean
const getParamAsBoolean = (params: { [key: string]: string | string[] | undefined }, key: string): boolean => {
  const value = getParamAsString(params, key);
  return value === 'true';
};

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Extraer parámetros directamente
  const receiverType = getParamAsString(params, 'receiverType') as 'lightning' | 'lnurl' | 'node' || 'lightning';
  const receiver = getParamAsString(params, 'receiver') || '';
  const amountsStr = getParamAsString(params, 'amounts') || '21,100,1000';
  const amounts = amountsStr.split(',').map(Number);
  const labels = getParamAsString(params, 'labels')?.split(',') || ['Café', 'Propina', 'Boost'];
  const theme = getParamAsString(params, 'theme') || 'orange';
  const useCustomImage = getParamAsBoolean(params, 'useCustomImage');
  const rawImage = getParamAsString(params, 'image');
  // Solo permitir imágenes HTTPS
  const image = rawImage && isValidHttpsUrl(rawImage) ? rawImage : undefined;
  const avatarSeed = getParamAsString(params, 'avatarSeed');
  const avatarSet = getParamAsString(params, 'avatarSet') as 'set1' | 'set2' | 'set3' | 'set4' | 'set5' || 'set1';
  
  // Log para depuración de parámetros
  useEffect(() => {
    console.log('WidgetParamsClient recibió los siguientes parámetros:', {
      receiverType,
      receiver,
      amounts,
      labels,
      theme,
      useCustomImage,
      rawImage,
      image, // La versión validada
      avatarSeed,
      avatarSet
    });
    setIsLoading(false);
  }, [receiverType, receiver, amounts, labels, theme, useCustomImage, rawImage, image, avatarSeed, avatarSet]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse w-24 h-24 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WebLNBoostButton
        receiverType={receiverType as 'lightning' | 'lnurl' | 'node'}
        receiver={receiver}
        amounts={amounts}
        labels={labels}
        theme={theme}
        avatarSeed={!useCustomImage ? avatarSeed : undefined}
        avatarSet={!useCustomImage ? (avatarSet as 'set1' | 'set2' | 'set3' | 'set4' | 'set5') : undefined}
        image={useCustomImage ? image : undefined}
      />
    </div>
  );
};

export default WidgetParamsClient; 