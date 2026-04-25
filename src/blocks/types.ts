// ACF Flexible Content — block type definitions
// acf_fc_layout is the discriminator from WordPress

export interface AcfImage {
  url: string
  alt: string
  width: number
  height: number
}

// ─── Individual block types ────────────────────────────────────────────────

export interface HeroSlide {
  badge_text?: string
  headline: string
  headline_highlight?: string
  slogan?: string
  description: string
  cta_primary_text?: string
  cta_primary_link?: string
  cta_secondary_text?: string
  cta_secondary_link?: string
  bg_image?: AcfImage             // dùng cho variant image_bg
}

export interface HeroBlock {
  acf_fc_layout: 'hero'
  variant?: 'split' | 'centered' | 'image_bg' | 'minimal'
  slides: HeroSlide[]
  stats?: Array<{ value: string; label: string }>
  checklist?: Array<{ text: string }>
  show_stats_card?: boolean
  autoplay_delay?: number         // ms, default 5000
}

export interface TrustBarBlock {
  acf_fc_layout: 'trust_bar'
  items: Array<{ text: string }>
}

export interface ServicesGridBlock {
  acf_fc_layout: 'services_grid'
  section_label: string
  section_title: string
  section_desc: string
  dark_background: boolean
  columns: 2 | 3 | 4
  services: Array<{
    title: string
    description: string
    features: string[]
    link_text: string
    link_url: string
  }>
}

export interface TwoColumnBlock {
  acf_fc_layout: 'two_column'
  layout: 'image_left' | 'image_right'
  dark_background: boolean
  section_label: string
  section_title: string
  section_desc: string
  features: Array<{
    title: string
    description: string
  }>
  badge_number: string
  badge_label: string
}

export interface TeamGridBlock {
  acf_fc_layout: 'team_grid'
  section_label: string
  section_title: string
  section_desc: string
  dark_background: boolean
  members: Array<{
    name: string
    role: string
    description: string
    avatar?: AcfImage
  }>
}

export interface TestimonialsBlock {
  acf_fc_layout: 'testimonials'
  section_label: string
  section_title: string
  dark_background: boolean
  testimonials: Array<{
    quote: string
    author_name: string
    author_company: string
    rating: number
  }>
}

export interface ClientsBlock {
  acf_fc_layout: 'clients_logos'
  section_title: string
  dark_background: boolean
  clients: Array<{
    name: string
    logo?: AcfImage
  }>
}

export interface FaqBlock {
  acf_fc_layout: 'faq_accordion'
  section_label: string
  section_title: string
  section_desc: string
  dark_background: boolean
  faqs: Array<{ question: string; answer: string }>
}

export interface CtaBlock {
  acf_fc_layout: 'cta_banner'
  headline: string
  description: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
  dark_background: boolean
}

export interface ContactBlock {
  acf_fc_layout: 'contact_form'
  section_label: string
  section_title: string
  dark_background: boolean
  cf7_form_id?: number   // WP Contact Form 7 form ID — fallback to CF7_DEFAULT_FORM_ID env var
  cf7_services?: string  // Newline-separated list of service options to show in the select
  map_embed_url?: string // Google Maps embed URL (iframe src) — set via ACF in WordPress
}

export interface TimelineBlock {
  acf_fc_layout: 'timeline'
  section_label: string
  section_title: string
  section_desc: string
  dark_background: boolean
  milestones: Array<{
    year: string
    title: string
    description: string
  }>
}

export interface ValuesBlock {
  acf_fc_layout: 'values_grid'
  section_label: string
  section_title: string
  section_desc: string
  dark_background: boolean
  values: Array<{
    icon: string
    title: string
    description: string
  }>
}

export interface LatestPostsBlock {
  acf_fc_layout: 'latest_posts'
  section_label?: string
  section_title: string
  section_desc?: string
  dark_background: boolean
  posts_count?: number      // số bài hiển thị, default 6
  category_slug?: string    // lọc theo danh mục (slug WP)
  view_all_text?: string
  view_all_link?: string    // default /tin-tuc
}

// ─── Union type ────────────────────────────────────────────────────────────

export type FlexibleBlock =
  | HeroBlock
  | TrustBarBlock
  | ServicesGridBlock
  | TwoColumnBlock
  | TeamGridBlock
  | TestimonialsBlock
  | ClientsBlock
  | FaqBlock
  | CtaBlock
  | ContactBlock
  | TimelineBlock
  | ValuesBlock
  | LatestPostsBlock

export type FlexibleContent = FlexibleBlock[]
