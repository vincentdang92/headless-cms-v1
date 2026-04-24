// ACF Flexible Content — block type definitions
// acf_fc_layout is the discriminator from WordPress

export interface AcfImage {
  url: string
  alt: string
  width: number
  height: number
}

// ─── Individual block types ────────────────────────────────────────────────

export interface HeroBlock {
  acf_fc_layout: 'hero'
  badge_text: string
  headline: string
  headline_highlight: string      // từ được highlight màu primary
  slogan: string                  // italic dưới headline
  description: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
  stats: Array<{ value: string; label: string }>
  checklist: Array<{ text: string }>
  show_stats_card: boolean
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

export type FlexibleContent = FlexibleBlock[]
