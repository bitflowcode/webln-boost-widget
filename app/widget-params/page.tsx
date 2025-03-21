import { Suspense } from 'react'
import WidgetParamsClient from './widget-params-client'

interface PageProps {
  params: Promise<Record<string, never>>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function WidgetParamsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <WidgetParamsClient params={resolvedSearchParams} />
    </Suspense>
  )
} 