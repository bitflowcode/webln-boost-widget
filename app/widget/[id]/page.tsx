import WidgetClient from './widget-client'

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
      <style jsx global>{`
        body {
          background: transparent !important;
          min-height: unset !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      <WidgetClient id={resolvedParams.id} />
    </div>
  )
}

export default Page 