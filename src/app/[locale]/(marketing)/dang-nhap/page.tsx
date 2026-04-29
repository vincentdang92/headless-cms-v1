import { setRequestLocale } from 'next-intl/server'
import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Đăng nhập' }

interface Props {
  params:       Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale }           = await params
  const { redirect: redirectTo } = await searchParams
  setRequestLocale(locale)
  return <LoginForm redirectTo={redirectTo} />
}
