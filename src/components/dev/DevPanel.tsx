'use client'

import { useState, useTransition, useEffect, useCallback, useRef, useMemo } from 'react'
import type { SiteSettings } from '@/types/site-settings'
import { pingWordPress, probeEndpoints } from '@/app/actions/dev'
import type { PingResult, RequestLog } from '@/app/actions/dev'
import type { LogEntry } from '@/lib/dev-store'

interface Props {
  settings: SiteSettings
  apiUrl: string
  locale: string
  hasSecret: boolean
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientEntry {
  id: string
  source: 'client'
  method: string
  url: string
  path: string
  status: number | null
  ms: number
  ts: number
  error?: string
  preview?: string
}

type AnyEntry = (LogEntry & { source: 'server' }) | ClientEntry

type FilterType = 'all' | 'server' | 'client' | 'errors'
type Tab = 'requests' | 'api' | 'settings' | 'env'

// ─── Badge components ─────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const m = method.toUpperCase()
  const colors: Record<string, [string, string]> = {
    GET:    ['#1e3a5a', '#89b4fa'],
    POST:   ['#1e3a2b', '#a6e3a1'],
    PUT:    ['#3a3018', '#f9e2af'],
    PATCH:  ['#3a2a10', '#fab387'],
    DELETE: ['#3a1e1e', '#f38ba8'],
  }
  const [bg, color] = colors[m] ?? ['#313244', '#cdd6f4']
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide shrink-0" style={{ background: bg, color }}>
      {m}
    </span>
  )
}

function StatusBadge({ status }: { status: number | null }) {
  if (status === null)
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0" style={{ background: '#313244', color: '#6c7086' }}>ERR</span>
  const color = status < 300 ? '#a6e3a1' : status < 400 ? '#f9e2af' : '#f38ba8'
  const bg    = status < 300 ? '#1e3a2b' : status < 400 ? '#3a3018' : '#3a1e1e'
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0" style={{ background: bg, color }}>{status}</span>
}

function SourceBadge({ source }: { source: 'server' | 'client' }) {
  const [bg, color, label] = source === 'server'
    ? ['#2a1e4a', '#cba6f7', 'SSR']
    : ['#1e3340', '#89dceb', 'CLI']
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 w-[28px] text-center" style={{ background: bg, color }}>
      {label}
    </span>
  )
}

function MsBadge({ ms }: { ms: number }) {
  const color = ms < 200 ? '#a6e3a1' : ms < 800 ? '#f9e2af' : '#f38ba8'
  return <span className="shrink-0 tabular-nums text-[10px]" style={{ color }}>{ms}ms</span>
}

function TimeAgo({ ts }: { ts: number }) {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const update = () => {
      const diff = Math.round((Date.now() - ts) / 1000)
      setLabel(diff < 5 ? 'now' : diff < 60 ? `${diff}s` : `${Math.floor(diff / 60)}m`)
    }
    update()
    const t = setInterval(update, 5000)
    return () => clearInterval(t)
  }, [ts])
  return <span className="shrink-0 text-[10px]" style={{ color: '#45475a' }}>{label}</span>
}

// ─── Log Row ──────────────────────────────────────────────────────────────────

function LogRow({ entry }: { entry: AnyEntry }) {
  const [expanded, setExpanded] = useState(false)
  const isError = entry.status === null || entry.status >= 400

  return (
    <div
      className="rounded cursor-pointer select-none"
      style={{
        background: expanded ? '#252535' : '#181825',
        border: `1px solid ${isError && !expanded ? '#4a1e1e' : '#313244'}`,
        marginBottom: '2px',
      }}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Main row */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <SourceBadge source={entry.source} />
        <MethodBadge method={entry.method} />
        <StatusBadge status={entry.status} />
        <MsBadge ms={entry.ms} />
        <span
          className="flex-1 truncate text-[10px] min-w-0"
          style={{ color: isError ? '#f38ba8' : '#a6adc8' }}
          title={entry.url}
        >
          {entry.path || entry.url}
        </span>
        <TimeAgo ts={entry.ts} />
        <span className="text-[9px] shrink-0" style={{ color: '#45475a' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-2 pb-2 space-y-1" style={{ borderTop: '1px solid #313244' }}>
          <div className="pt-1.5 break-all text-[10px]" style={{ color: '#6c7086' }}>
            <span style={{ color: '#45475a' }}>URL </span>
            <span style={{ color: '#cdd6f4' }}>{entry.url}</span>
          </div>
          {entry.error && (
            <div className="break-all text-[10px]" style={{ color: '#f38ba8' }}>
              <span style={{ color: '#45475a' }}>ERR </span>{entry.error}
            </div>
          )}
          {'preview' in entry && entry.preview && (
            <div className="text-[10px] break-all" style={{ color: '#89dceb' }}>
              <span style={{ color: '#45475a' }}>RES </span>
              <span className="opacity-80">{entry.preview}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Row component for settings display ──────────────────────────────────────

function Row({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null
  return (
    <div className="flex gap-2 py-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="shrink-0 w-24 text-[10px]" style={{ color: '#6c7086' }}>{label}</span>
      <span className="break-all text-[10px]" style={{ color: '#cdd6f4' }}>{value}</span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

let _clientSeq = 0

export default function DevPanel({ settings, apiUrl, locale, hasSecret }: Props) {
  const [open, setOpen]               = useState(false)
  const [tab, setTab]                 = useState<Tab>('requests')
  const [filter, setFilter]           = useState<FilterType>('all')
  const [pingResult, setPingResult]   = useState<PingResult | null>(null)
  const [probeResults, setProbeResults] = useState<RequestLog[]>([])
  const [serverLogs, setServerLogs]   = useState<(LogEntry & { source: 'server' })[]>([])
  const [clientLogs, setClientLogs]   = useState<ClientEntry[]>([])
  const [pageUrl, setPageUrl]         = useState('')
  const [isPinging, startPing]        = useTransition()
  const [isProbing, startProbe]       = useTransition()
  const lastIdRef    = useRef(0)
  const addClientRef = useRef<(e: ClientEntry) => void>(() => {})

  useEffect(() => { setPageUrl(window.location.href) }, [])

  // Keep addClientRef in sync with current setClientLogs
  useEffect(() => {
    addClientRef.current = (entry: ClientEntry) => {
      setClientLogs(prev => [entry, ...prev].slice(0, 150))
    }
  })

  // ── Client-side fetch interceptor ────────────────────────────────────────────
  useEffect(() => {
    const original = window.fetch.bind(window)

    window.fetch = async (input, init) => {
      const rawUrl = typeof input === 'string' ? input
        : input instanceof URL ? input.toString()
        : (input as Request).url
      const method = (init?.method ?? (input instanceof Request ? input.method : undefined) ?? 'GET').toUpperCase()

      // Skip DevPanel's own polling request
      if (rawUrl.includes('/api/dev/logs')) return original(input, init)

      const ts = Date.now()
      let path = rawUrl
      try { path = new URL(rawUrl, location.origin).pathname + new URL(rawUrl, location.origin).search } catch { /* relative URL */ }

      try {
        const res = await original(input, init)
        const ms = Date.now() - ts
        const id = `c${++_clientSeq}`

        // Non-blocking response preview for JSON responses
        const ct = res.headers.get('content-type') ?? ''
        if (ct.includes('json') || ct.includes('text/')) {
          res.clone().text().then(text => {
            const preview = text.length > 200 ? text.slice(0, 200) + '…' : text
            addClientRef.current({ id, source: 'client', method, url: rawUrl, path, status: res.status, ms, ts, preview })
          }).catch(() => {
            addClientRef.current({ id, source: 'client', method, url: rawUrl, path, status: res.status, ms, ts })
          })
        } else {
          addClientRef.current({ id, source: 'client', method, url: rawUrl, path, status: res.status, ms, ts })
        }

        return res
      } catch (e) {
        addClientRef.current({ id: `c${++_clientSeq}`, source: 'client', method, url: rawUrl, path, status: null, ms: Date.now() - ts, ts, error: String(e) })
        throw e
      }
    }

    return () => { window.fetch = original }
  }, [])

  // ── Server log fetch (no polling — fetch once on mount + on panel open) ────────
  const fetchServerLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/dev/logs?after=${lastIdRef.current}`)
      const json = await res.json() as { logs: LogEntry[] }
      if (json.logs.length) {
        lastIdRef.current = json.logs[0].id
        setServerLogs(prev => [...json.logs.map(l => ({ ...l, source: 'server' as const })), ...prev].slice(0, 150))
      }
    } catch { /* ignore */ }
  }, [])

  // Fetch SSR logs once on mount to capture initial page render
  useEffect(() => { fetchServerLogs() }, [fetchServerLogs])

  // Re-fetch SSR logs when panel is opened (picks up any new RSC navigations)
  useEffect(() => { if (open) fetchServerLogs() }, [open, fetchServerLogs])

  const handleClearLogs = async () => {
    await fetch('/api/dev/logs', { method: 'DELETE' })
    setServerLogs([])
    setClientLogs([])
    lastIdRef.current = 0
  }

  const handlePing  = () => startPing(async ()  => { setPingResult(await pingWordPress()) })
  const handleProbe = useCallback(() => startProbe(async () => { setProbeResults(await probeEndpoints()) }), [])

  // Auto-run probe when API tab is first opened
  const probedOnceRef = useRef(false)
  useEffect(() => {
    if (tab === 'api' && !probedOnceRef.current) {
      probedOnceRef.current = true
      handleProbe()
    }
  }, [tab, handleProbe])

  // ── Merge + sort + filter logs ────────────────────────────────────────────────
  const allLogs = useMemo<AnyEntry[]>(() => {
    const merged = [...serverLogs, ...clientLogs]
    merged.sort((a, b) => b.ts - a.ts)
    return merged
  }, [serverLogs, clientLogs])

  const filteredLogs = useMemo(() => {
    switch (filter) {
      case 'server': return allLogs.filter(l => l.source === 'server')
      case 'client': return allLogs.filter(l => l.source === 'client')
      case 'errors': return allLogs.filter(l => l.status === null || l.status >= 400)
      default:       return allLogs
    }
  }, [allLogs, filter])

  const errorCount  = useMemo(() => allLogs.filter(l => l.status === null || l.status >= 400).length, [allLogs])
  const clientCount = useMemo(() => allLogs.filter(l => l.source === 'client').length, [allLogs])
  const serverCount = useMemo(() => allLogs.filter(l => l.source === 'server').length, [allLogs])

  const { siteName, contact, colors, headingFont, bodyFont, topbar, scripts } = settings
  const TABS: Tab[] = ['requests', 'api', 'settings', 'env']
  const FILTERS: Array<{ key: FilterType; label: string; count: number; color: string }> = [
    { key: 'all',    label: 'All',    count: allLogs.length, color: '#cdd6f4' },
    { key: 'server', label: 'SSR',    count: serverCount,   color: '#cba6f7' },
    { key: 'client', label: 'Client', count: clientCount,   color: '#89dceb' },
    { key: 'errors', label: 'Errors', count: errorCount,    color: '#f38ba8' },
  ]

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999]"
      style={{ fontFamily: '"ui-monospace","SFMono-Regular","Menlo",monospace', fontSize: '11px' }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold shadow-2xl transition-all hover:opacity-90 active:scale-95"
        style={{ background: '#1e1e2e', border: '1px solid #313244', color: '#cdd6f4' }}
      >
        <span style={{ color: '#cba6f7' }}>⚙</span>
        <span>DEV</span>
        {allLogs.length > 0 && (
          <span className="rounded px-1.5 text-[9px] font-bold" style={{ background: '#313244', color: '#89dceb' }}>
            {allLogs.length}
          </span>
        )}
        {errorCount > 0 && (
          <span className="rounded px-1.5 text-[9px] font-bold" style={{ background: '#3a1e1e', color: '#f38ba8' }}>
            {errorCount} err
          </span>
        )}
        <span style={{ color: '#45475a', fontSize: '9px' }}>{open ? '▼' : '▲'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-10 right-0 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: '460px', background: '#1e1e2e', border: '1px solid #313244', maxHeight: '600px' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ background: '#181825', borderBottom: '1px solid #313244' }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: '#cba6f7', fontWeight: 700 }}>⚙ DevPanel</span>
              <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#313244', color: '#45475a' }}>
                {locale.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-[10px] max-w-[180px]" style={{ color: '#45475a' }} title={pageUrl}>
                {pageUrl.replace(/^https?:\/\/[^/]+/, '') || '/'}
              </span>
              <button onClick={() => setOpen(false)} className="hover:text-white transition-colors text-[10px]" style={{ color: '#45475a' }}>✕</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0" style={{ borderBottom: '1px solid #313244', background: '#181825' }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors relative"
                style={{
                  color: tab === t ? '#cba6f7' : '#6c7086',
                  borderBottom: tab === t ? '2px solid #cba6f7' : '2px solid transparent',
                  background: 'transparent',
                }}
              >
                {t}
                {t === 'requests' && errorCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: '#f38ba8' }} />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1" style={{ color: '#cdd6f4' }}>

            {/* ── REQUESTS ──────────────────────────────────────────────── */}
            {tab === 'requests' && (
              <div className="flex flex-col h-full">
                {/* Filter bar */}
                <div
                  className="flex items-center gap-1 px-2 py-1.5 shrink-0"
                  style={{ borderBottom: '1px solid #313244', background: '#181825' }}
                >
                  {FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all"
                      style={{
                        background: filter === f.key ? '#313244' : 'transparent',
                        color: filter === f.key ? f.color : '#45475a',
                        border: `1px solid ${filter === f.key ? '#45475a' : 'transparent'}`,
                      }}
                    >
                      {f.label}
                      {f.count > 0 && (
                        <span style={{ color: filter === f.key ? f.color : '#45475a', opacity: 0.7 }}>
                          {f.count}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button
                    onClick={fetchServerLogs}
                    className="px-2 py-0.5 rounded text-[10px] hover:opacity-80"
                    style={{ background: '#313244', color: '#89b4fa' }}
                    title="Refresh SSR logs"
                  >
                    ↻ SSR
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className="px-2 py-0.5 rounded text-[10px] hover:opacity-80"
                    style={{ background: '#313244', color: '#f38ba8' }}
                  >
                    clear
                  </button>
                </div>

                {/* Log list */}
                <div className="flex-1 overflow-y-auto p-2">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[10px]" style={{ color: '#45475a' }}>
                        {allLogs.length === 0
                          ? 'No requests yet — navigate to a page'
                          : 'No entries match this filter'}
                      </p>
                    </div>
                  ) : (
                    filteredLogs.map(entry => <LogRow key={`${entry.source}-${entry.id}`} entry={entry} />)
                  )}
                </div>
              </div>
            )}

            {/* ── API ───────────────────────────────────────────────────── */}
            {tab === 'api' && (
              <div className="p-3 space-y-3">
                {/* Ping */}
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: pingResult ? (pingResult.ok ? '#a6e3a1' : '#f38ba8') : '#45475a' }}
                    />
                    <span className="font-bold" style={{ color: '#a6e3a1' }}>WordPress API</span>
                  </div>
                  <div className="truncate mb-2 text-[10px]" style={{ color: '#45475a' }} title={apiUrl}>
                    {apiUrl || '⚠ WORDPRESS_API_URL not set'}
                  </div>
                  {pingResult && (
                    <div className="flex gap-2 mb-2">
                      <StatusBadge status={pingResult.status} />
                      <MsBadge ms={pingResult.ms} />
                      {pingResult.error && (
                        <span className="truncate text-[10px]" style={{ color: '#f38ba8' }}>{pingResult.error}</span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handlePing}
                    disabled={isPinging}
                    className="px-3 py-1 rounded font-bold text-[10px] hover:opacity-80 disabled:opacity-40"
                    style={{ background: '#313244', color: '#cba6f7' }}
                  >
                    {isPinging ? '…Pinging' : '⚡ Ping WP'}
                  </button>
                </div>

                {/* Probe */}
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold" style={{ color: '#89dceb' }}>Endpoint Probe</span>
                    <button
                      onClick={handleProbe}
                      disabled={isProbing}
                      className="px-2 py-0.5 rounded text-[10px] font-bold hover:opacity-80 disabled:opacity-40"
                      style={{ background: '#313244', color: '#89dceb' }}
                    >
                      {isProbing ? '…Running' : '▶ Run'}
                    </button>
                  </div>
                  {probeResults.length === 0 ? (
                    <p className="text-[10px]" style={{ color: '#45475a' }}>Press Run to probe all endpoints.</p>
                  ) : (
                    <div className="space-y-0">
                      {probeResults.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1.5 text-[10px]"
                          style={{ borderTop: i > 0 ? '1px solid #313244' : 'none' }}
                        >
                          <StatusBadge status={r.status} />
                          <MsBadge ms={r.ms} />
                          <span className="flex-1 min-w-0" style={{ color: '#cdd6f4' }}>{r.label}</span>
                          <span className="truncate max-w-[140px]" style={{ color: '#45475a' }} title={r.url}>
                            {r.url.replace(apiUrl, '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── SETTINGS ──────────────────────────────────────────────── */}
            {tab === 'settings' && (
              <div className="p-3 space-y-2">
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Brand</p>
                  <Row label="site_name"  value={siteName} />
                  <Row label="tagline"    value={settings.siteTagline} />
                  <Row label="logo"       value={settings.logo?.url} />
                </div>
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Colors & Fonts</p>
                  <div className="flex gap-2 py-1 items-center">
                    {[colors.primary, colors.primaryLight, colors.primaryPale, colors.dark].map((c, i) => (
                      <span key={i} title={c} className="w-4 h-4 rounded border border-white/10 shrink-0 cursor-help" style={{ background: c }} />
                    ))}
                    <span className="text-[10px]" style={{ color: '#6c7086' }}>{colors.primary}</span>
                  </div>
                  <Row label="heading" value={headingFont} />
                  <Row label="body"    value={bodyFont} />
                </div>
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Contact</p>
                  <Row label="phone"   value={contact.phone} />
                  <Row label="hotline" value={contact.hotline} />
                  <Row label="email"   value={contact.email} />
                  <Row label="address" value={contact.address} />
                  <Row label="hours"   value={contact.workingHours} />
                  <Row label="zalo"    value={contact.zaloLink} />
                  <Row label="fb"      value={contact.facebookLink} />
                </div>
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Topbar</p>
                  <Row label="enabled" value={String(topbar.enabled)} />
                  <Row label="text"    value={topbar.text || '(empty)'} />
                </div>
              </div>
            )}

            {/* ── ENV ───────────────────────────────────────────────────── */}
            {tab === 'env' && (
              <div className="p-3 space-y-2">
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Environment</p>
                  <Row label="NODE_ENV"  value={process.env.NODE_ENV} />
                  <Row label="WP_API"    value={apiUrl || '⚠ NOT SET'} />
                  <Row label="WP_SECRET" value={hasSecret ? '✅ set' : '⚠ not set'} />
                  <Row label="SITE_URL"  value={process.env.NEXT_PUBLIC_SITE_URL} />
                </div>
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Tracking</p>
                  <Row label="GA4" value={scripts.googleAnalyticsId || '(not set)'} />
                  <Row label="GTM" value={scripts.googleTagManagerId || '(not set)'} />
                </div>
                <div className="rounded-lg p-2.5" style={{ background: '#181825', border: '1px solid #313244' }}>
                  <p className="text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: '#f9e2af' }}>Legend</p>
                  <div className="space-y-1">
                    {[
                      ['SSR', '#cba6f7', 'Server-side fetch (RSC, Route Handler)'],
                      ['CLI', '#89dceb', 'Client-side fetch (browser, React components)'],
                    ].map(([label, color, desc]) => (
                      <div key={label} className="flex items-center gap-2 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold w-[28px] text-center shrink-0"
                          style={{ background: '#2a1e4a', color }}>
                          {label}
                        </span>
                        <span style={{ color: '#6c7086' }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-3 py-1.5 flex items-center justify-between shrink-0 text-[10px]"
            style={{ background: '#181825', borderTop: '1px solid #313244', color: '#45475a' }}
          >
            <span>headless-cms-v1 · dev only</span>
            <div className="flex items-center gap-3">
              <span style={{ color: '#45475a' }}>
                <span style={{ color: '#cba6f7' }}>{serverCount}</span> SSR ·{' '}
                <span style={{ color: '#89dceb' }}>{clientCount}</span> CLI
                {errorCount > 0 && <> · <span style={{ color: '#f38ba8' }}>{errorCount} err</span></>}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
