import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const after = Number(searchParams.get('after') ?? 0)

  // dynamic import to keep dev-store out of production bundle
  return import('@/lib/dev-store').then(({ readLogs }) =>
    NextResponse.json({ logs: readLogs(after) })
  )
}

export function DELETE() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 403 })
  }
  return import('@/lib/dev-store').then(({ clearLogs }) => {
    clearLogs()
    return NextResponse.json({ ok: true })
  })
}
