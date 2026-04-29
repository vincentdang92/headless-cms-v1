import { setRequestLocale } from 'next-intl/server'
import AccountClient from './AccountClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tài khoản' }

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AccountClient />
}
