import { setRequestLocale } from 'next-intl/server'
import RegisterForm from './RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Đăng ký' }

interface Props {
  params: Promise<{ locale: string }>
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RegisterForm />
}
