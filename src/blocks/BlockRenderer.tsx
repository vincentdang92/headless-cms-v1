import type { FlexibleBlock } from './types'
import type { SiteSettings } from '@/types/site-settings'
import HeroBlock from './HeroBlock'
import TrustBarBlock from './TrustBarBlock'
import ServicesGridBlock from './ServicesGridBlock'
import TwoColumnBlock from './TwoColumnBlock'
import TeamGridBlock from './TeamGridBlock'
import TestimonialsBlock from './TestimonialsBlock'
import ClientsBlock from './ClientsBlock'
import FaqBlock from './FaqBlock'
import CtaBlock from './CtaBlock'
import ContactBlock from './ContactBlock'
import TimelineBlock from './TimelineBlock'
import ValuesBlock from './ValuesBlock'

interface Props {
  blocks: FlexibleBlock[]
  settings: SiteSettings
}

export default function BlockRenderer({ blocks, settings }: Props) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.acf_fc_layout}-${index}`

        switch (block.acf_fc_layout) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'trust_bar':
            return <TrustBarBlock key={key} block={block} />
          case 'services_grid':
            return <ServicesGridBlock key={key} block={block} />
          case 'two_column':
            return <TwoColumnBlock key={key} block={block} />
          case 'team_grid':
            return <TeamGridBlock key={key} block={block} />
          case 'testimonials':
            return <TestimonialsBlock key={key} block={block} />
          case 'clients_logos':
            return <ClientsBlock key={key} block={block} />
          case 'faq_accordion':
            return <FaqBlock key={key} block={block} />
          case 'cta_banner':
            return <CtaBlock key={key} block={block} />
          case 'contact_form':
            return <ContactBlock key={key} block={block} settings={settings} />
          case 'timeline':
            return <TimelineBlock key={key} block={block} />
          case 'values_grid':
            return <ValuesBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
