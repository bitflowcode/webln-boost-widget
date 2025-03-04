import WidgetClient from './widget-client'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: { [key: string]: string | string[] | undefined }
}

async function Page({ params }: PageProps) {
  const resolvedParams = await params
  return <WidgetClient id={resolvedParams.id} />
}

export default Page 