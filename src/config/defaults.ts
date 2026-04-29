import type { SiteSettings } from '@/types/site-settings'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'CôngTy.vn',
  siteTagline: 'Giải pháp chuyên nghiệp',
  siteDescription: 'Công ty chuyên cung cấp dịch vụ chuyên nghiệp tại Việt Nam.',
  logo: null,
  favicon: null,
  colors: {
    primary: '#E8753A',
    primaryLight: '#F4A96A',
    primaryPale: '#FDF0E7',
    dark: '#1A1A2E',
  },
  headingFont: 'Playfair Display',
  bodyFont: 'Be Vietnam Pro',
  contact: {
    phone: '0123 456 789',
    hotline: '',
    email: 'info@congty.vn',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    workingHours: 'T2–T6, 8:00–17:30',
    zaloLink: '',
    facebookLink: '',
    youtubeLink: '',
    twitterLink: '',
    linkedinLink: '',
    mapEmbedUrl: '',
  },
  heroVariant: 'split',
  showPostFeaturedImage: true,
  tocScrollOffset: 96,
  tocScrollDuration: 700,
  showNewsSidebar: true,
  weather: {
    provider: 'auto',
    apiKey: '',
    locationOverride: '',
  },
  topbar: { enabled: true, text: '' },
  footer: {
    about: 'Đồng hành cùng khách hàng với dịch vụ chuyên nghiệp và tận tâm.',
    copyright: `© ${new Date().getFullYear()} CôngTy.vn — All rights reserved.`,
  },
  scripts: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    headScripts: '',
    bodyScripts: '',
  },
}

// ─── Industry Presets ─────────────────────────────────────────────────────────
// Dùng để override DEFAULT_SITE_SETTINGS khi khởi tạo dự án mới cho từng ngành

export type PresetKey = keyof typeof PRESETS

export const PRESETS = {
  // Luật, kế toán, tài chính
  law: {
    colors: { primary: '#E8753A', primaryLight: '#F4A96A', primaryPale: '#FDF0E7', dark: '#1A1A2E' },
    headingFont: 'Playfair Display',
    bodyFont: 'Be Vietnam Pro',
  },
  // Công nghệ, SaaS, startup
  tech: {
    colors: { primary: '#2563EB', primaryLight: '#60A5FA', primaryPale: '#EFF6FF', dark: '#0F172A' },
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  // Y tế, dược, spa, wellness
  healthcare: {
    colors: { primary: '#0D9488', primaryLight: '#2DD4BF', primaryPale: '#F0FDFA', dark: '#134E4A' },
    headingFont: 'DM Sans',
    bodyFont: 'DM Sans',
  },
  // Bất động sản, nội thất, cao cấp
  realestate: {
    colors: { primary: '#B45309', primaryLight: '#D97706', primaryPale: '#FFFBEB', dark: '#1C1917' },
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Raleway',
  },
  // Giáo dục, đào tạo, trẻ em
  education: {
    colors: { primary: '#7C3AED', primaryLight: '#A78BFA', primaryPale: '#F5F3FF', dark: '#1E1B4B' },
    headingFont: 'Nunito',
    bodyFont: 'Nunito',
  },
  // Nhà hàng, F&B, thực phẩm
  food: {
    colors: { primary: '#DC2626', primaryLight: '#F87171', primaryPale: '#FEF2F2', dark: '#1C0A00' },
    headingFont: 'Lora',
    bodyFont: 'Lato',
  },
} as const
