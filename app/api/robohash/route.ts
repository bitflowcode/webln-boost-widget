import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const seed = searchParams.get('seed') || 'default'
  const requestedSet = searchParams.get('set') ?? ''
const allowedSets = ['set1', 'set2', 'set3', 'set4', 'set5']
const set = allowedSets.includes(requestedSet) ? requestedSet : 'set1'

  const robohashUrl = `https://robohash.org/${encodeURIComponent(seed)}?set=${encodeURIComponent(set)}`

  try {
    const response = await fetch(robohashUrl)
    if (!response.ok) {
      return new Response('Error al obtener el avatar de RoboHash', { status: 502 })
    }

    const buffer = await response.arrayBuffer()
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800' // 7 días
      }
    })
  } catch (err) {
    return new Response('Error de conexión con RoboHash', { status: 500 })
  }
}