'use client'

import dynamic from 'next/dynamic'
import type { SiteSettings } from '@/types/site-settings'

const DevPanel = dynamic(() => import('./DevPanel'), { ssr: false })

interface Props {
  settings: SiteSettings
  apiUrl: string
  locale: string
  hasSecret: boolean
}

export default function DevPanelLoader(props: Props) {
  return <DevPanel {...props} />
}
