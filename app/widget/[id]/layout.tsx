export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="bg-transparent">
      <body className="bg-transparent">{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Bitflow Widget',
  description: 'Widget de donaciones Bitcoin Lightning',
} 