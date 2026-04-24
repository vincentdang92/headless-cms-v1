'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ContactBlock } from './types'
import type { SiteSettings } from '@/types/site-settings'
import type { CF7Response } from '@/types/wordpress'

interface Props {
  block: ContactBlock
  settings: SiteSettings
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const INPUT_BASE = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none transition-all'

function useInputFocus() {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = 'var(--cp)'
      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--cp) 10%, transparent)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = '#e5e7eb'
      e.target.style.boxShadow = ''
    },
  }
}

export default function ContactBlock({ block, settings }: Props) {
  const { section_label, section_title, cf7_form_id, cf7_services } = block
  const map_embed_url = block.map_embed_url || settings.contact.mapEmbedUrl
  const { contact, siteName } = settings
  const t = useTranslations('Contact')

  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const inputFocus = useInputFocus()

  // Parse service options — ACF textarea (one per line) or built-in defaults
  const serviceOptions = cf7_services
    ? cf7_services.split('\n').map((s) => s.trim()).filter(Boolean)
    : ['Tư vấn pháp lý', 'Kế toán thuế', 'Thành lập doanh nghiệp', 'Bảo hộ thương hiệu', 'Khác']

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setFieldErrors({})
    setServerMessage('')

    const form = e.currentTarget
    const data = new FormData(form)

    const fields: Record<string, string> = {}
    data.forEach((value, key) => { fields[key] = String(value) })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: cf7_form_id, fields }),
      })

      const result: CF7Response = await res.json()

      if (result.status === 'mail_sent') {
        setStatus('success')
        form.reset()
        return
      }

      // CF7 validation errors — map field-level messages
      if (result.status === 'validation_failed' && result.invalid_fields?.length) {
        const errors: Record<string, string> = {}
        result.invalid_fields.forEach((f) => { errors[f.field] = f.message })
        setFieldErrors(errors)
      }

      setStatus('error')
      setServerMessage(result.message || t('errorDefault'))
    } catch {
      setStatus('error')
      setServerMessage(t('errorNetwork'))
    }
  }

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--cd), color-mix(in srgb, var(--cd) 80%, #0f3460))' }}
    >
      <div
        className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--cp) 12%, transparent), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {section_label && (
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--cp)' }}>
                {section_label}
              </span>
            )}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--cd)' }}
            >
              {section_title || t('defaultTitle')}
            </h2>

            {/* Success state */}
            {status === 'success' ? (
              <div className="py-10 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ background: 'color-mix(in srgb, var(--cp) 12%, transparent)' }}
                >
                  ✓
                </div>
                <p className="font-bold text-lg mb-1" style={{ color: 'var(--cd)', fontFamily: 'var(--font-heading)' }}>
                  {t('successTitle')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('successBody')}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs font-semibold underline underline-offset-2"
                  style={{ color: 'var(--cp)' }}
                >
                  {t('sendAnother')}
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <FieldWrap error={fieldErrors['your-name']}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      name="your-name"
                      required
                      placeholder="Nguyễn Văn A"
                      className={INPUT_BASE}
                      {...inputFocus}
                    />
                  </FieldWrap>
                  <FieldWrap error={fieldErrors['your-phone']}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('phone')}</label>
                    <input
                      type="tel"
                      name="your-phone"
                      required
                      placeholder="0123 456 789"
                      className={INPUT_BASE}
                      {...inputFocus}
                    />
                  </FieldWrap>
                </div>

                <FieldWrap error={fieldErrors['your-email']}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')}</label>
                  <input
                    type="email"
                    name="your-email"
                    placeholder="email@example.com"
                    className={INPUT_BASE}
                    {...inputFocus}
                  />
                </FieldWrap>

                <FieldWrap error={fieldErrors['your-service']}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('service')}</label>
                  <select
                    name="your-service"
                    className={INPUT_BASE}
                    style={{ background: '#fff' }}
                    {...inputFocus}
                  >
                    <option value="">{t('servicePlaceholder')}</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FieldWrap>

                <FieldWrap error={fieldErrors['your-message']}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('message')}</label>
                  <textarea
                    name="your-message"
                    required
                    rows={4}
                    placeholder={t('messagePlaceholder')}
                    className={INPUT_BASE + ' resize-none'}
                    {...inputFocus}
                  />
                </FieldWrap>

                {/* Server error message */}
                {status === 'error' && serverMessage && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {serverMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background: 'var(--cp)',
                    boxShadow: '0 4px 16px color-mix(in srgb, var(--cp) 35%, transparent)',
                  }}
                >
                  {status === 'loading' ? t('submitting') : t('submit')}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact info ─────────────────────────────────────────────── */}
          <div className="space-y-7">
            <p
              className="text-white font-bold text-xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {siteName}
            </p>

            <ul className="space-y-5">
              {[
                { icon: '📍', label: t('addressLabel'), value: contact.address },
                { icon: '📞', label: t('hotlineLabel'), value: contact.hotline || contact.phone },
                { icon: '✉️', label: t('email'), value: contact.email },
                { icon: '🕐', label: t('workingHoursLabel'), value: contact.workingHours },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <li key={item.label} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'color-mix(in srgb, var(--cp) 15%, transparent)' }}
                    >
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-white/85">{item.value}</p>
                    </div>
                  </li>
                ))}
            </ul>

            {(contact.zaloLink || contact.facebookLink) && (
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'color-mix(in srgb, var(--cp) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--cp) 20%, transparent)',
                }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--cp-light)' }}>
                  {t('quickConnect')}
                </p>
                <div className="flex gap-3">
                  {contact.zaloLink && (
                    <a href={contact.zaloLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: '#0068ff' }}>
                      Zalo
                    </a>
                  )}
                  {contact.facebookLink && (
                    <a href={contact.facebookLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: '#1877f2' }}>
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── Google Maps ──────────────────────────────────────────────── */}
        {map_embed_url && (
          <div className="mt-10 rounded-2xl overflow-hidden" style={{ height: '360px' }}>
            <iframe
              src={map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ"
            />
          </div>
        )}
      </div>
    </section>
  )
}

// Wrapper nhỏ để hiện field error bên dưới input
function FieldWrap({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
