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

// ─── Article helpers ──────────────────────────────────────────────────────────

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function calcReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  let i = 0
  html.replace(/<h([23])[^>]*>(.*?)<\/h[23]>/gi, (_: string, level: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, '').trim()
    if (text) items.push({ id: `h-${i++}`, text, level: Number(level) as 2 | 3 })
    return ''
  })
  return items
}

export function injectHeadingIds(html: string): string {
  let i = 0
  return html.replace(/<h([23])([^>]*)>/gi, (_: string, level: string, attrs: string) =>
    `<h${level}${attrs} id="h-${i++}">`
  )
}
