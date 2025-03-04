import WidgetClient from './widget-client'
import { FC } from 'react'

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

const Page: FC<PageProps> = ({ params }) => {
  return <WidgetClient id={params.id} />
}

export default Page 