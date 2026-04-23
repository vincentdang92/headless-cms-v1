import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function formatDateLong(dateString: string): string {
  return format(parseISO(dateString), "EEEE, dd 'tháng' MM, yyyy", { locale: vi })
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

export function truncate(text: string, maxLength: number): string {
  const clean = stripHtml(text)
  if (clean.length <= maxLength) return clean
  return clean.slice(0, maxLength).trimEnd() + '…'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
