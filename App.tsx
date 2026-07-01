import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

// ─────────────────────────────────────────────
// DATOS
// ─────────────────────────────────────────────

const ROW1_IMGS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
]
const ROW2_IMGS = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
]

const HERO_BULLETS = [
  'Videos IA + imágenes publicitarias',
  'Ángulos de venta para testear',
  'Listos para Meta Ads y TikTok Ads',
  'Planes desde $19.990 CLP',
]

const PROJECTS = [
  {
    num: '01', category: 'Anuncios creados', name: 'Skincare Orgánica',
    blurb: 'Textura, rutina, deseo aspiracional y beneficios visibles.',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
  {
    num: '02', category: 'Anuncios creados', name: 'Tech Wearable',
    blurb: 'Uso diario, diferenciación, estilo de vida y beneficio directo.',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
  },
  {
    num: '03', category: 'Anuncios creados', name: 'Hogar & Deco',
    blurb: 'Transformación del espacio, comodidad y valor percibido.',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
  },
]

const SERVICES = [
  { num: '01', name: 'Videos IA', desc: 'Videos publicitarios creados con inteligencia artificial, hooks claros y estructura pensada para captar atención rápido.' },
  { num: '02', name: 'Imágenes publicitarias', desc: 'Anuncios visuales con dirección de arte, composición y copy comercial. No son solo imágenes: son piezas creadas para vender.' },
  { num: '03', name: 'Ángulos de venta', desc: 'Creamos distintas formas de vender el mismo producto: dolor, deseo, beneficio, oferta, comparación, transformación y objeciones.' },
  { num: '04', name: 'Copy de conversión', desc: 'Cada anuncio incluye textos, titulares y llamados a la acción pensados para generar interés, clics y compras.' },
  { num: '05', name: 'Listos para lanzar', desc: 'Recibes tus anuncios en formatos listos para campañas de pago en Meta Ads y TikTok Ads, sin escribir prompts ni reuniones eternas.' },
]

const PLANS = [
  {
    name: 'Starter', priceOld: '$39.980', price: '$19.990', period: 'CLP/mes',
    tagline: 'Para probar ALTY con tu primer producto.',
    items: ['18 anuncios al mes', '3 videos IA', '15 imágenes publicitarias', '1 producto mensual', 'Distintos ángulos de venta'],
    valueText: 'Ideal para ver cómo tu producto se transforma en publicidad con IA.',
    ctaLabel: 'Probar Starter →',
    planId: 'starter', featured: false,
  },
  {
    name: 'Pro', priceOld: '$59.980', price: '$29.990', period: 'CLP/mes',
    tagline: 'El plan recomendado para marcas que quieren testear de verdad.',
    items: ['36 anuncios al mes', '6 videos IA', '30 imágenes publicitarias', 'Hasta 3 productos diferentes', 'Menos de $850 por anuncio'],
    valueText: 'Más volumen, más ángulos y más oportunidades de encontrar anuncios ganadores sin pagar precio de agencia.',
    ctaLabel: 'Elegir Pro →',
    planId: 'pro', featured: true,
  },
  {
    name: 'Business', priceOld: '$99.980', price: '$49.990', period: 'CLP/mes',
    tagline: 'Para marcas que necesitan producir anuncios de forma constante.',
    items: ['70 anuncios al mes', '10 videos IA', '60 imágenes publicitarias', 'Hasta 5 productos diferentes', 'Mayor volumen para escalar'],
    valueText: 'Ideal para marcas con campañas activas que necesitan alimentar sus anuncios todos los meses.',
    ctaLabel: 'Escalar mi publicidad →',
    planId: 'business', featured: false,
  },
]

// ─────────────────────────────────────────────
// COMPONENTES BASE
// ─────────────────────────────────────────────

function SilkBackground() {
  return (
    <div className="silk-bg">
      <div className="vignette" />
    </div>
  )
}

function CampaignButton({
  label = 'Crear mis anuncios', compact = false, planId = 'starter',
}: { label?: string; compact?: boolean; planId?: string }) {
  return (
    <button
      onClick={() => { window.location.href = `/signup?plan=${planId}` }}
      className={
        'rounded-full font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 whitespace-nowrap ' +
        (compact
          ? 'px-5 py-2 text-[10px] sm:text-xs'
          : 'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base')
      }
      style={{
        background: 'linear-gradient(123deg, #001a0e 7%, #00df81 37%, #007842 72%, #002b1a 100%)',
        boxShadow: '0px 4px 4px rgba(0,223,129,0.2), 4px 4px 12px #007842 inset',
        outline: '2px solid rgba(255,255,255,0.15)',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </button>
  )
}

function GhostButton({ label, href }: { label: string; href: string }) {
  return (
    <a href={href}
      className="rounded-full font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base border-2 transition-colors hover:bg-white/5 whitespace-nowrap inline-block text-center"
      style={{ color: '#D7E2EA', borderColor: 'rgba(215,226,234,0.3)' }}>
      {label}
    </a>
  )
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors px-5 py-2 sm:px-8 sm:py-3 text-[10px] sm:text-sm whitespace-nowrap shrink-0">
      Ver anuncios
    </button>
  )
}

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style }: {
  children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
    >
      {children}
    </motion.div>
  )
}

function Magnet({ children, padding = 150, strength = 3 }: { children: ReactNode; padding?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2
    const isNear = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding && e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding
    if (isNear) {
      setActive(true)
      el.style.transition = 'transform 0.3s ease-out'
      el.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${(e.clientY - cy) / strength}px, 0)`
    } else if (active) {
      setActive(false)
      el.style.transition = 'transform 0.6s ease-in-out'
      el.style.transform = 'translate3d(0,0,0)'
    }
  }, [active, padding, strength])
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])
  return <div ref={ref} style={{ willChange: 'transform', display: 'inline-block' }}>{children}</div>
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-x-clip">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,223,129,0.08), transparent 70%)'
      }} />

      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="relative z-10 flex items-center justify-between gap-2 px-5 sm:px-8 md:px-10 pt-6 md:pt-8">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
          {['Cómo funciona', 'Precios', 'Ejemplos', 'Contacto'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="text-[10px] sm:text-base md:text-lg lg:text-[1.3rem] font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70 whitespace-nowrap"
              style={{ color: '#D7E2EA' }}>
              {link}
            </a>
          ))}
        </div>
        <div className="hidden md:block shrink-0">
          <CampaignButton label="Crear anuncios" compact />
        </div>
      </FadeIn>

      {/* Contenido central */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 pt-6">
        <FadeIn delay={0.1} y={20}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 sm:mb-6 md:mb-7 mx-4 sm:mx-6 md:mx-8 w-fit"
            style={{ border: '1px solid rgba(0,223,129,0.35)', background: 'rgba(0,223,129,0.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00df81' }} />
            <span className="font-medium uppercase tracking-widest whitespace-nowrap" style={{ color: '#00df81', fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)' }}>
              Primer Agente IA de Publicidad
            </span>
          </span>
        </FadeIn>

        <div className="overflow-hidden">
          <FadeIn delay={0.2} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-[0.85]">
              <span className="block text-[15.5vw] sm:text-[13.5vw] md:text-[11.5vw] lg:text-[10.5vw] whitespace-nowrap">ANUNCIOS</span>
              <span className="block text-[15.5vw] sm:text-[13.5vw] md:text-[11.5vw] lg:text-[10.5vw] whitespace-nowrap">EFECTIVOS EN 24HRS.</span>
            </h1>
          </FadeIn>
        </div>

        <FadeIn delay={0.35} y={20} className="mt-6 sm:mt-8 md:mt-10 max-w-xl">
          <p className="font-medium leading-snug" style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2.2vw, 1.5rem)' }}>
            Convierte tu producto en videos IA e imágenes publicitarias listas para vender.
          </p>
          <p className="font-light leading-relaxed mt-3" style={{ color: 'rgba(215,226,234,0.55)', fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}>
            Pega el link de tu producto y ALTY crea anuncios con distintos ángulos de venta para que puedas testear, encontrar ganadores y escalar tus campañas.
          </p>
        </FadeIn>
      </div>

      {/* Bullets + CTAs */}
      <div className="relative z-10 px-5 sm:px-8 md:px-10 pb-8 sm:pb-8 md:pb-10">
        <FadeIn delay={0.45} y={16} className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 md:mb-8">
          {HERO_BULLETS.map((b) => (
            <span key={b} className="flex items-center gap-1.5 font-medium uppercase tracking-wide whitespace-nowrap"
              style={{ color: 'rgba(215,226,234,0.7)', fontSize: 'clamp(0.6rem, 1vw, 0.78rem)' }}>
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#00df81' }} />
              {b}
            </span>
          ))}
        </FadeIn>
        <FadeIn delay={0.55} y={20} className="flex flex-wrap items-center gap-3 sm:gap-4">
          <CampaignButton label="Quiero mis anuncios" />
          <GhostButton label="Ver ejemplos" href="#ejemplos" />
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────────

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const section = sectionRef.current; const row1 = row1Ref.current; const row2 = row2Ref.current
    if (!section || !row1 || !row2) return
    const update = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      row1.style.transform = `translateX(${offset - 200}px)`
      row2.style.transform = `translateX(${-(offset - 200)}px)`
    }
    window.addEventListener('scroll', update, { passive: true }); update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  const tripled = (arr: string[]) => [...arr, ...arr, ...arr]
  return (
    <section ref={sectionRef} className="relative z-[5] pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-16 md:pb-20 overflow-hidden">
      <FadeIn delay={0} y={24} className="text-center px-5 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-black uppercase tracking-tight leading-tight text-white"
          style={{ fontSize: 'clamp(1.3rem, 4vw, 2.6rem)' }}>
          Look de estudio. Velocidad de IA.
        </h2>
        <p className="font-light mt-2 max-w-lg mx-auto" style={{ color: 'rgba(215,226,234,0.5)', fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}>
          Publicidad visual con calidad de estudio, creada en una fracción del tiempo y del precio.
        </p>
      </FadeIn>
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex gap-3" style={{ width: 'max-content', willChange: 'transform' }}>
          {tripled(ROW1_IMGS).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden w-[260px] h-[170px] sm:w-[340px] sm:h-[220px] md:w-[420px] md:h-[270px]" style={{ background: '#161616' }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3" style={{ width: 'max-content', willChange: 'transform' }}>
          {tripled(ROW2_IMGS).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden w-[260px] h-[170px] sm:w-[340px] sm:h-[220px] md:w-[420px] md:h-[270px]" style={{ background: '#161616' }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// ABOUT (Qué hacemos) — panel apilable
// ─────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="relative sticky top-0 z-10 bg-[#0c0c0c] rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[60px] -mt-10 sm:-mt-14 min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-16 sm:py-20 overflow-hidden"
      style={{ boxShadow: '0 -30px 70px -15px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.10)' }}>
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[6%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none">
        <div className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.22) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[6%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none">
        <div className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.15) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[10%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none">
        <div className="w-[100px] sm:w-[140px] md:w-[180px] aspect-square" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.12) 0%, transparent 70%)', borderRadius: '40% 60% 55% 45%' }} />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[10%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none">
        <div className="w-[130px] sm:w-[170px] md:w-[220px] aspect-square" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.09) 0%, transparent 70%)', borderRadius: '55% 45% 40% 60%' }} />
      </FadeIn>

      <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 text-center z-10 max-w-2xl">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading-muted font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.2rem, 8vw, 112px)' }}>
            Qué hacemos
          </h2>
        </FadeIn>
        <FadeIn delay={0.15} y={24} className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
          <div className="flex flex-col gap-2.5" style={{ color: '#D7E2EA', fontSize: 'clamp(0.9rem, 1.9vw, 1.25rem)' }}>
            <p className="font-medium leading-relaxed">
              Somos el primer Agente IA de Publicidad. Tomamos tu producto y lo convertimos en anuncios listos para vender: videos IA, imágenes publicitarias, copy y ángulos de venta pensados para campañas de pago.
            </p>
            <p className="font-light leading-relaxed" style={{ color: 'rgba(215,226,234,0.6)' }}>
              No somos Canva. No somos agencia. No somos otra herramienta para que trabajes más.
            </p>
            <p className="font-medium leading-relaxed">
              Somos el primer agente IA que produce los anuncios que tu marca necesita para testear, aprender y escalar.
            </p>
          </div>
          <CampaignButton label="Quiero mis anuncios" />
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SERVICES (De un link a un anuncio ganador) — panel apilable
// ─────────────────────────────────────────────

function ServicesSection() {
  return (
    <section id="cómo-funciona" className="relative sticky top-0 min-h-screen flex flex-col justify-center z-20 bg-white rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[60px] mt-0 px-5 sm:px-8 md:px-10 py-12 sm:py-14 overflow-hidden"
      style={{ boxShadow: '0 -30px 70px -15px rgba(0,0,0,0.55)' }}>
      <FadeIn delay={0} y={40}>
        <h2 className="font-black uppercase text-center text-[#0c0c0c] mb-5 sm:mb-6 md:mb-6 leading-[0.95]"
          style={{ fontSize: 'clamp(1.7rem, 6vw, 68px)', letterSpacing: '-0.03em' }}>
          <span className="block">De un link</span>
          <span className="block">a un anuncio ganador</span>
        </h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto w-full">
        {SERVICES.map((svc, i) => (
          <FadeIn key={svc.num} delay={i * 0.1} y={24}>
            <div className="flex items-start gap-3 sm:gap-4 md:gap-6 py-3 sm:py-3.5 md:py-4"
              style={{ borderTop: i === 0 ? '1px solid rgba(12,12,12,0.15)' : undefined, borderBottom: '1px solid rgba(12,12,12,0.15)' }}>
              <span className="font-black leading-none shrink-0 text-[#0c0c0c]" style={{ fontSize: 'clamp(1.7rem, 5.2vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {svc.num}
              </span>
              <div className="flex flex-col gap-2 pt-1 md:pt-2">
                <h3 className="font-medium uppercase text-[#0c0c0c]" style={{ fontSize: 'clamp(0.95rem, 1.9vw, 1.7rem)' }}>{svc.name}</h3>
                <p className="font-light leading-snug max-w-2xl" style={{ color: 'rgba(12,12,12,0.6)', fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}>{svc.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// PROJECTS (Ejemplos) — apilamiento real de cards (sticky)
// ─────────────────────────────────────────────

function StackingCard({
  project, index, total, containerRef,
}: {
  project: typeof PROJECTS[0]; index: number; total: number; containerRef: RefObject<HTMLDivElement>
}) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const start = index / total
  const end = (index + 1) / total
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.9])

  return (
    <div className="sticky top-[80px] sm:top-[90px] md:top-[100px] min-h-[80vh] sm:min-h-[84vh] flex items-start justify-center">
      <motion.div
        style={{ scale, transformOrigin: 'center top', background: '#0c0c0c' }}
        className="w-full rounded-[28px] sm:rounded-[40px] md:rounded-[52px] border-2 border-[#D7E2EA]/20 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-start justify-between mb-3 md:mb-4 gap-3">
          <span className="font-black leading-none shrink-0"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 96px)', letterSpacing: '-0.04em', WebkitTextStroke: '1px rgba(215,226,234,0.3)', color: 'transparent' }}>
            {project.num}
          </span>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <span className="font-medium uppercase tracking-widest text-[#D7E2EA]/50 truncate max-w-full" style={{ fontSize: 'clamp(0.55rem, 1vw, 0.8rem)' }}>{project.category}</span>
            <span className="font-black uppercase leading-tight text-[#D7E2EA] truncate max-w-full" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 2rem)' }}>{project.name}</span>
            <span className="font-light leading-snug text-[#D7E2EA]/45 max-w-full mt-0.5 hidden sm:block" style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}>{project.blurb}</span>
          </div>
          <LiveProjectButton />
        </div>
        <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: '2fr 3fr' }}>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="rounded-[16px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-[#161616]" style={{ height: 'clamp(100px, 15vw, 210px)' }}>
              <img src={project.images.col1Top} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-[16px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-[#161616]" style={{ height: 'clamp(130px, 20vw, 300px)' }}>
              <img src={project.images.col1Bot} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="rounded-[16px] sm:rounded-[28px] md:rounded-[36px] overflow-hidden bg-[#161616]">
            <img src={project.images.col2} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <section id="ejemplos" className="relative z-30 bg-[#0a0a0a] rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[60px] -mt-12 sm:-mt-16 md:mt-0 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ boxShadow: '0 -30px 70px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.10)' }}>
      <FadeIn delay={0} y={40} className="text-center mb-4 sm:mb-5 md:mb-6">
        <h2 className="hero-heading font-black uppercase"
          style={{ fontSize: 'clamp(2.6rem, 12vw, 160px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Ejemplos
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={24} className="text-center mb-16 sm:mb-20 md:mb-28">
        <p className="font-light max-w-xl mx-auto" style={{ color: 'rgba(215,226,234,0.5)', fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)' }}>
          Un producto puede venderse de muchas formas. Estos ejemplos muestran cómo ALTY transforma productos en anuncios listos para testear.
        </p>
      </FadeIn>
      <div ref={containerRef} className="relative max-w-5xl mx-auto">
        {PROJECTS.map((project, i) => (
          <StackingCard key={project.num} project={project} index={i} total={PROJECTS.length} containerRef={containerRef} />
        ))}
      </div>
      <FadeIn delay={0.2} y={24} className="flex flex-col items-center mt-20 md:mt-28 gap-6">
        <p className="font-medium uppercase tracking-widest text-center text-[#D7E2EA]/40" style={{ fontSize: '0.8rem' }}>
          ¿Lista para ver tu producto así?
        </p>
        <CampaignButton label="Crear mis anuncios" />
      </FadeIn>
    </section>
  )
}

// ─────────────────────────────────────────────
// PRICING — SIN forzar min-h-screen/overflow-hidden
// (esto es lo que causaba el corte de las cards en desktop)
// ─────────────────────────────────────────────

function PricingSection() {
  return (
    <section id="precios" className="relative md:sticky md:top-0 z-40 bg-[#0a0a0a] rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[60px] -mt-12 sm:-mt-16 md:mt-0 px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-16"
      style={{ boxShadow: '0 -30px 70px -15px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.10)' }}>
      <FadeIn delay={0} y={40} className="text-center mb-8 sm:mb-9 md:mb-10 max-w-2xl mx-auto">
        <h2 className="hero-heading font-black uppercase" style={{ fontSize: 'clamp(1.8rem, 6.5vw, 76px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Precios de lanzamiento
        </h2>
        <p className="mt-3 font-light text-[#D7E2EA]/50" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}>
          Más volumen, más ángulos, más oportunidades de encontrar el anuncio ganador. Todos los planes incluyen videos IA, imágenes publicitarias, copy y formatos listos para campañas de pago.
        </p>
        <p className="mt-4 font-medium" style={{ color: 'rgba(0,223,129,0.85)', fontSize: 'clamp(0.8rem, 1.3vw, 1rem)' }}>
          Si ya inviertes en pauta, no quemes presupuesto con una sola idea. Prueba más anuncios, encuentra lo que funciona y escala con mejores creativos.
        </p>
      </FadeIn>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 0.1} y={24}>
            <div className="flex flex-col p-6 sm:p-7 rounded-3xl relative h-full"
              style={{
                background: plan.featured ? 'rgba(0,223,129,0.06)' : 'rgba(255,255,255,0.03)',
                border: plan.featured ? '1px solid rgba(0,223,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black uppercase tracking-widest whitespace-nowrap" style={{ background: '#00df81', color: '#000', fontSize: '9px' }}>
                  ⭐ Más elegido
                </div>
              )}
              <p className="font-black uppercase tracking-widest mb-3 text-[#D7E2EA]/35" style={{ fontSize: '0.65rem' }}>{plan.name}</p>
              <p className="font-medium line-through mb-0.5" style={{ color: 'rgba(215,226,234,0.3)', fontSize: '0.95rem' }}>{plan.priceOld} CLP/mes</p>
              <p className="font-black leading-none mb-1 text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '-0.03em' }}>
                {plan.price}
                <span className="font-medium ml-1 text-white/35" style={{ fontSize: '0.85rem' }}>{plan.period}</span>
              </p>
              <p className="font-light mt-2 mb-4 pb-4 leading-snug text-[#D7E2EA]/45" style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {plan.tagline}
              </p>
              <ul className="flex flex-col gap-2 mb-4">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-medium text-[#D7E2EA]/80" style={{ fontSize: '0.875rem' }}>
                    <span className="text-[#00df81] font-black shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <p className="font-light leading-snug flex-1 mb-6" style={{ color: 'rgba(215,226,234,0.4)', fontSize: '0.8rem' }}>
                {plan.valueText}
              </p>
              <button onClick={() => { window.location.href = `/signup?plan=${plan.planId}` }}
                className="w-full py-3.5 rounded-full font-black uppercase tracking-wider text-sm transition-all duration-200"
                style={plan.featured ? { background: '#00df81', color: '#000' } : { background: 'transparent', color: 'rgba(215,226,234,0.65)', border: '1px solid rgba(215,226,234,0.16)' }}>
                {plan.ctaLabel}
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MICROCOPY BAJO PRECIOS (flujo normal, no apilable)
// ─────────────────────────────────────────────

function MicrocopySection() {
  return (
    <section className="relative z-40 bg-[#0a0a0a] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24">
      <FadeIn delay={0} y={30} className="max-w-2xl mx-auto text-center">
        <h2 className="font-black uppercase leading-tight text-white mb-5"
          style={{ fontSize: 'clamp(1.4rem, 4vw, 2.4rem)', letterSpacing: '-0.02em' }}>
          Publicidad de calidad, sin pagar sobreprecios.
        </h2>
        <p className="font-light leading-relaxed" style={{ color: 'rgba(215,226,234,0.55)', fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}>
          Crear buenos anuncios normalmente requiere diseñador, editor, copywriter, dirección creativa, reuniones y días de espera. ALTY reduce todo eso a una experiencia simple: envías tu producto, eliges un plan y recibes anuncios listos para lanzar.
        </p>
        <p className="font-medium mt-4" style={{ color: '#00df81', fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}>
          No pagas por horas. No pagas por reuniones. No pagas por procesos eternos. Pagas por anuncios.
        </p>
      </FadeIn>
    </section>
  )
}

// ─────────────────────────────────────────────
// CTA FINAL (flujo normal, no apilable)
// ─────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="relative z-40 bg-[#0c0c0c] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <FadeIn delay={0} y={30} className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
        <h2 className="hero-heading font-black uppercase leading-tight"
          style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', letterSpacing: '-0.02em' }}>
          Convierte tu producto en anuncios listos para vender.
        </h2>
        <p className="font-light leading-relaxed max-w-lg" style={{ color: 'rgba(215,226,234,0.55)', fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}>
          Empieza con Pro y recibe 36 anuncios al mes: 6 videos IA + 30 imágenes publicitarias para testear distintos ángulos de venta.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          <CampaignButton label="Crear anuncios con Pro" planId="pro" />
          <GhostButton label="Ver precios" href="#precios" />
        </div>
      </FadeIn>
    </section>
  )
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contacto" className="relative z-40 bg-[#0a0a0a] px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex flex-col gap-0.5">
        <span className="font-black tracking-tight text-[#D7E2EA]" style={{ fontSize: '1.2rem' }}>ALTY</span>
        <span className="font-light uppercase tracking-wide" style={{ color: 'rgba(215,226,234,0.35)', fontSize: '0.65rem' }}>El Agente IA de Publicidad</span>
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        {[{ label: 'Privacidad', href: '/privacy' }, { label: 'Términos', href: '/terms' }, { label: 'soporte@altyapp.com', href: 'mailto:soporte@altyapp.com' }].map((l) => (
          <a key={l.label} href={l.href} className="font-medium uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: 'rgba(215,226,234,0.35)', fontSize: '0.7rem' }}>{l.label}</a>
        ))}
      </div>
      <span className="font-medium uppercase tracking-widest" style={{ color: 'rgba(215,226,234,0.2)', fontSize: '0.65rem' }}>© 2026 ALTY</span>
    </footer>
  )
}

// ─────────────────────────────────────────────
// MOBILE STICKY CTA
// ─────────────────────────────────────────────

function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <motion.div className="fixed bottom-0 left-0 right-0 z-50 md:hidden text-center"
      style={{ background: '#00df81', paddingBottom: 'calc(14px + env(safe-area-inset-bottom))', paddingTop: 14 }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: visible ? 0 : 80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <button className="text-black font-black uppercase tracking-wider text-sm w-full" onClick={() => { window.location.href = '/signup?plan=starter' }}>
        Crear mis anuncios →
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  return (
    <>
      <SilkBackground />
      <main className="relative z-10" style={{ overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        {/* Grupo apilable: se fijan y apilan, luego se sueltan antes de Ejemplos */}
        <div className="relative">
          <AboutSection />
          <ServicesSection />
        </div>
        <ProjectsSection />
        <PricingSection />
        <MicrocopySection />
        <FinalCTASection />
        <Footer />
        <MobileStickyCTA />
      </main>
    </>
  )
}
