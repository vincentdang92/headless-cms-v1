'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Link } from '@/i18n/navigation'
import type { HeroBlock, HeroSlide } from './types'

// ─── Shared helpers ────────────────────────────────────────────────────────────

function SlideContent({ slide, dark = true }: { slide: HeroSlide; dark?: boolean }) {
  const textBase  = dark ? 'text-white' : 'text-[var(--cd)]'
  const textMuted = dark ? 'text-white/60' : 'text-[var(--cd)]/60'
  const textItalic = dark ? 'text-white/70' : 'text-[var(--cd)]/70'

  return (
    <div>
      {slide.badge_text && (
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{
            background: 'color-mix(in srgb, var(--cp) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--cp) 30%, transparent)',
            color: 'var(--cp-light)',
          }}
        >
          {slide.badge_text}
        </div>
      )}
      <h1
        className={`text-4xl md:text-5xl font-bold leading-tight mb-3 ${textBase}`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {slide.headline}{' '}
        {slide.headline_highlight && (
          <span style={{ color: 'var(--cp-light)' }}>{slide.headline_highlight}</span>
        )}
      </h1>
      {slide.slogan && (
        <p className={`text-lg italic mb-2 ${textItalic}`} style={{ fontFamily: 'var(--font-heading)' }}>
          {slide.slogan}
        </p>
      )}
      <p className={`text-sm leading-relaxed mb-8 ${textMuted}`}>{slide.description}</p>
      <div className="flex flex-wrap gap-3">
        {slide.cta_primary_text && (
          <Link
            href={slide.cta_primary_link || '/lien-he'}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--cp)', boxShadow: '0 6px 20px color-mix(in srgb, var(--cp) 40%, transparent)' }}
          >
            {slide.cta_primary_text}
          </Link>
        )}
        {slide.cta_secondary_text && (
          <Link
            href={slide.cta_secondary_link || '/dich-vu'}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all ${
              dark ? 'text-white hover:bg-white/10 border border-white/30' : 'hover:bg-black/5 border border-[var(--cd)]/30'
            }`}
            style={dark ? {} : { color: 'var(--cd)' }}
          >
            {slide.cta_secondary_text}
          </Link>
        )}
      </div>
    </div>
  )
}

const DARK_BG = 'linear-gradient(135deg, var(--cd) 0%, color-mix(in srgb, var(--cd) 85%, #0f3460) 100%)'
const PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`

// ─── Variant: split (default) ──────────────────────────────────────────────────
// Dark gradient, 2-col, Swiper on left, glass stats card on right

function HeroSplit({ block }: { block: HeroBlock }) {
  const { slides, stats, checklist, show_stats_card, autoplay_delay = 5000 } = block
  if (!slides?.length) return null
  return (
    <section className="relative overflow-hidden py-24 min-h-[580px] flex items-center" style={{ background: DARK_BG }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: PATTERN }} />
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--cp) 15%, transparent) 0%, transparent 70%)' }} />

      <style>{`
        .hero-split .swiper-pagination-bullet { background: rgba(255,255,255,0.35); opacity:1; width:8px; height:8px; }
        .hero-split .swiper-pagination-bullet-active { background: var(--cp-light,#F4A96A); width:24px; border-radius:4px; }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="pb-10">
            <Swiper modules={[Autoplay, Pagination]}
              autoplay={{ delay: autoplay_delay, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }} loop={slides.length > 1} className="hero-split">
              {slides.map((slide, i) => (
                <SwiperSlide key={i}><div className="pb-6"><SlideContent slide={slide} dark /></div></SwiperSlide>
              ))}
            </Swiper>
          </div>

          {show_stats_card && (
            <div className="rounded-2xl p-8 hidden md:block"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <p className="text-white font-semibold mb-5 pb-4"
                style={{ fontFamily: 'var(--font-heading)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                ✦ Thành Tích Nổi Bật
              </p>
              {stats?.length ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((s, i) => (
                    <div key={i}>
                      <p className="text-3xl font-bold leading-none mb-1"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp-light)' }}>{s.value}</p>
                      <p className="text-xs text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {checklist?.length ? (
                <ul className="space-y-2">
                  {checklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/75">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--cp) 20%, transparent)', color: 'var(--cp-light)' }}>✓</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Variant: centered ─────────────────────────────────────────────────────────
// Dark gradient, single column centered, stats row below slides

function HeroCentered({ block }: { block: HeroBlock }) {
  const { slides, stats, autoplay_delay = 5000 } = block
  if (!slides?.length) return null
  return (
    <section className="relative overflow-hidden py-28 min-h-[560px] flex flex-col items-center justify-center text-center"
      style={{ background: DARK_BG }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: PATTERN }} />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, color-mix(in srgb, var(--cp) 12%, transparent) 0%, transparent 70%)' }} />

      <style>{`
        .hero-centered .swiper-pagination { position:static; margin-top:2rem; }
        .hero-centered .swiper-pagination-bullet { background: rgba(255,255,255,0.35); opacity:1; width:8px; height:8px; }
        .hero-centered .swiper-pagination-bullet-active { background: var(--cp-light,#F4A96A); width:24px; border-radius:4px; }
      `}</style>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <Swiper modules={[Autoplay, Pagination, EffectFade]}
          effect="fade" autoplay={{ delay: autoplay_delay, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }} loop={slides.length > 1} className="hero-centered">
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center">
                {slide.badge_text && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                    style={{ background: 'color-mix(in srgb, var(--cp) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--cp) 30%, transparent)', color: 'var(--cp-light)' }}>
                    {slide.badge_text}
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {slide.headline}{' '}
                  {slide.headline_highlight && <span style={{ color: 'var(--cp-light)' }}>{slide.headline_highlight}</span>}
                </h1>
                {slide.slogan && (
                  <p className="text-lg text-white/70 italic mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{slide.slogan}</p>
                )}
                <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-xl">{slide.description}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {slide.cta_primary_text && (
                    <Link href={slide.cta_primary_link || '/lien-he'}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--cp)', boxShadow: '0 6px 20px color-mix(in srgb, var(--cp) 40%, transparent)' }}>
                      {slide.cta_primary_text}
                    </Link>
                  )}
                  {slide.cta_secondary_text && (
                    <Link href={slide.cta_secondary_link || '/dich-vu'}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:bg-white/10"
                      style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
                      {slide.cta_secondary_text}
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {stats?.length ? (
        <div className="relative z-10 mt-12 w-full max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp-light)' }}>{s.value}</span>
                <span className="text-xs text-white/50 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

// ─── Variant: image_bg ─────────────────────────────────────────────────────────
// Background image per slide + dark overlay, stats bar at bottom

function HeroImageBg({ block }: { block: HeroBlock }) {
  const { slides, stats, autoplay_delay = 5000 } = block
  if (!slides?.length) return null
  return (
    <section className="relative overflow-hidden min-h-[620px] flex flex-col">
      <style>{`
        .hero-imagebg { flex: 1; }
        .hero-imagebg .swiper-pagination { bottom: 1.5rem !important; }
        .hero-imagebg .swiper-pagination-bullet { background: rgba(255,255,255,0.5); opacity:1; width:8px; height:8px; }
        .hero-imagebg .swiper-pagination-bullet-active { background: var(--cp-light,#F4A96A); width:24px; border-radius:4px; }
      `}</style>

      <Swiper modules={[Autoplay, Pagination, EffectFade]}
        effect="fade" autoplay={{ delay: autoplay_delay, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }} loop={slides.length > 1}
        className="hero-imagebg w-full" style={{ minHeight: stats?.length ? '520px' : '620px' }}>
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative flex items-center">
            {/* Background */}
            <div className="absolute inset-0" style={
              slide.bg_image
                ? { backgroundImage: `url(${slide.bg_image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: DARK_BG }
            } />
            {/* Overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)' }} />
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
              <div className="max-w-xl">
                <SlideContent slide={slide} dark />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {stats?.length ? (
        <div style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 py-5 px-4 md:px-6">
                  <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--cp-light)' }}>{s.value}</span>
                  <span className="text-xs text-white/60 leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

// ─── Variant: minimal ──────────────────────────────────────────────────────────
// Light background, 2-col, colored stats tiles — for tech / healthcare

function HeroMinimal({ block }: { block: HeroBlock }) {
  const { slides, stats, checklist, show_stats_card, autoplay_delay = 5000 } = block
  if (!slides?.length) return null
  return (
    <section className="relative overflow-hidden py-24 min-h-[560px] flex items-center"
      style={{ background: 'var(--cp-pale, #f8fafc)' }}>
      {/* Subtle accent blob */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, var(--cp) 0%, transparent 70%)' }} />

      <style>{`
        .hero-minimal .swiper-pagination-bullet { background: var(--cd); opacity:0.25; width:8px; height:8px; }
        .hero-minimal .swiper-pagination-bullet-active { background: var(--cp); opacity:1; width:24px; border-radius:4px; }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          <div className="pb-10">
            <Swiper modules={[Autoplay, Pagination]}
              autoplay={{ delay: autoplay_delay, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }} loop={slides.length > 1} className="hero-minimal">
              {slides.map((slide, i) => (
                <SwiperSlide key={i}><div className="pb-6"><SlideContent slide={slide} dark={false} /></div></SwiperSlide>
              ))}
            </Swiper>
          </div>

          {show_stats_card && stats?.length ? (
            <div className="hidden md:grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: 'var(--cp)', color: '#fff' }}>
                  <p className="text-3xl font-bold leading-none mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                  <p className="text-sm opacity-80">{s.label}</p>
                </div>
              ))}
              {checklist?.length ? (
                <div className="col-span-2 rounded-xl p-5"
                  style={{ background: 'white', border: '1px solid color-mix(in srgb, var(--cp) 20%, transparent)' }}>
                  <ul className="space-y-2">
                    {checklist.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--cd)' }}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                          style={{ background: 'var(--cp)' }}>✓</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

// ─── Dispatcher ────────────────────────────────────────────────────────────────

export default function HeroBlock({ block }: { block: HeroBlock }) {
  switch (block.variant) {
    case 'centered':  return <HeroCentered  block={block} />
    case 'image_bg':  return <HeroImageBg   block={block} />
    case 'minimal':   return <HeroMinimal   block={block} />
    default:          return <HeroSplit     block={block} />
  }
}
