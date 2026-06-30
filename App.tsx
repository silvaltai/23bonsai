import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

// ─────────────────────────────────────────────
// DATOS
// ─────────────────────────────────────────────

// GIFs externos del prompt original (sin depender de /images/ local)
const ROW1_IMGS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
]
const ROW2_IMGS = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

// Imágenes de proyectos — CloudFront (del prompt original)
const PROJECTS = [
  {
    num: '01', category: 'Campaña Generada', name: 'Skincare Orgánica',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
  {
    num: '02', category: 'Campaña Generada', name: 'Tech Wearable',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
  },
  {
    num: '03', category: 'Campaña Generada', name: 'Hogar & Deco',
    images: {
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1Bot: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2:    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
  },
]

const SERVICES = [
  { num: '01', name: 'Video IA', desc: 'Producción de video publicitario con inteligencia artificial, con copy, ritmo y ganchos optimizados para convertir en Meta, Instagram y TikTok.' },
  { num: '02', name: 'Ads Estáticos', desc: '5 anuncios de imagen por campaña con copy estratégico y diseño visual listo para publicar. Múltiples ángulos para testear cuál vende mejor.' },
  { num: '03', name: 'Copy Estratégico', desc: 'Textos escritos para vender, no para decorar. Cada pieza lleva el hook correcto según el formato y la plataforma donde se va a publicar.' },
  { num: '04', name: 'Formatos Nativos', desc: 'Los creativos salen en los formatos correctos para cada plataforma. Feed 4:5, Story 9:16, Square 1:1. Sin retoques manuales.' },
  { num: '05', name: 'Entrega en 24hrs', desc: 'La campaña completa lista para publicar en menos de 24 horas desde que subes el link del producto. Sin reuniones, sin briefs.' },
]

const PLANS = [
  { name: 'Starter', price: '$19.990', period: 'CLP/mes', tagline: 'Para probar ALTY con tu primera tanda de publicidad IA.', items: ['3 campañas publicitarias IA', '3 videos IA', '15 ads estáticos', 'Listos para Meta y TikTok', 'Entrega en 24 horas'], planId: 'starter', featured: false },
  { name: 'Pro', price: '$29.990', period: 'CLP/mes', tagline: 'Para marcas que quieren testear más ángulos y encontrar mejores creativos.', items: ['6 campañas publicitarias IA', '6 videos IA', '30 ads estáticos', 'Más ángulos creativos para testear', 'Entrega en 24 horas'], planId: 'pro', featured: true },
  { name: 'Business', price: '$49.990', period: 'CLP/mes', tagline: 'Para marcas que necesitan volumen creativo constante.', items: ['12 campañas publicitarias IA', '12 videos IA', '60 ads estáticos', 'Mayor volumen para campañas activas', 'Entrega en 24 horas'], planId: 'business', featured: false },
]

// ─────────────────────────────────────────────
// COMPONENTES BASE
// ─────────────────────────────────────────────

function CampaignButton() {
  return (
    <button
      onClick={() => { window.location.href = '/signup?plan=starter' }}
      className="rounded-full font-medium uppercase tracking-widest text-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-opacity hover:opacity-90"
      style={{
        background: 'linear-gradient(123deg, #001a0e 7%, #00df81 37%, #007842 72%, #002b1a 100%)',
        boxShadow: '0px 4px 4px rgba(0,223,129,0.2), 4px 4px 12px #007842 inset',
        outline: '2px solid rgba(255,255,255,0.15)',
        outlineOffset: '-3px',
      }}
    >
      Crear mi campaña
    </button>
  )
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors px-6 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
      Ver campaña
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

function AnimatedChar({ char, progress, index, total }: { char: string; progress: any; index: number; total: number }) {
  const start = index / total
  const end = Math.min(start + 1 / total, 1)
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ opacity: 0 }}>{char}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>{char}</motion.span>
    </span>
  )
}

function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const chars = text.split('')
  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => <AnimatedChar key={i} char={char} progress={scrollYProgress} index={i} total={chars.length} />)}
    </p>
  )
}

// ─────────────────────────────────────────────
// SECCIONES
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col overflow-x-clip" style={{ background: '#0c0c0c' }}>
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
        {['Cómo funciona', 'Precios', 'Ejemplos', 'Contacto'].map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
            className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
            style={{ color: '#D7E2EA' }}>
            {link}
          </a>
        ))}
      </FadeIn>

      {/* H1 masivo */}
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full mt-6 sm:mt-4 md:-mt-5 text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] px-4 sm:px-6 md:px-8">
            PUBLICIDAD CON IA.
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex items-end justify-between pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 mt-auto">
        <FadeIn delay={0.35} y={20}>
          <p className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ color: '#D7E2EA', fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            el primer agente que transforma un producto en una campaña lista para vender
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><CampaignButton /></FadeIn>
      </div>

      {/* Portrait con Magnet */}
      <FadeIn delay={0.6} y={30}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet padding={150} strength={3}>
          <img src="/images/alty-hero.png" alt="ALTY — Agente IA de Publicidad"
            className="w-full h-auto object-contain" loading="eager" />
        </Magnet>
      </FadeIn>
    </section>
  )
}

// ─── MARQUEE ─────────────────────────────────

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
    <section ref={sectionRef} className="bg-[#0c0c0c] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex gap-3" style={{ width: 'max-content', willChange: 'transform' }}>
          {tripled(ROW1_IMGS).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: 420, height: 270, background: '#111' }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3" style={{ width: 'max-content', willChange: 'transform' }}>
          {tripled(ROW2_IMGS).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: 420, height: 270, background: '#111' }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ───────────────────────────────────

function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
      style={{ background: '#0c0c0c' }}>
      {/* Acentos decorativos de esquinas */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none">
        <div className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.2) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none">
        <div className="w-[120px] sm:w-[160px] md:w-[210px] aspect-square rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.14) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none">
        <div className="w-[100px] sm:w-[140px] md:w-[180px] aspect-square"
          style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.10) 0%, transparent 70%)', borderRadius: '40% 60% 55% 45%' }} />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none">
        <div className="w-[130px] sm:w-[170px] md:w-[220px] aspect-square"
          style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.08) 0%, transparent 70%)', borderRadius: '55% 45% 40% 60%' }} />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center z-10">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading-muted font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Qué hacemos
          </h2>
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text="Somos el primer Agente IA de Publicidad. Pegas el link de tu producto y nosotros producimos el video IA y los 5 ads estáticos en 24 horas. Listos para Meta, Instagram y TikTok. Sin agencia, sin diseñador, sin procesos eternos."
            className="font-medium text-center leading-relaxed max-w-[560px]"
            style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <CampaignButton />
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ────────────────────────────────

function ServicesSection() {
  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn delay={0} y={40}>
        <h2 className="font-black uppercase text-center text-[#0c0c0c] mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Campaña
        </h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((svc, i) => (
          <FadeIn key={svc.num} delay={i * 0.1} y={24}>
            <div className="flex items-start gap-4 md:gap-8 py-8 sm:py-10 md:py-12"
              style={{ borderTop: i === 0 ? '1px solid rgba(12,12,12,0.15)' : undefined, borderBottom: '1px solid rgba(12,12,12,0.15)' }}>
              <span className="font-black leading-none shrink-0 text-[#0c0c0c]"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {svc.num}
              </span>
              <div className="flex flex-col gap-2 pt-1 md:pt-2">
                <h3 className="font-medium uppercase text-[#0c0c0c]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{svc.name}</h3>
                <p className="font-light leading-relaxed max-w-2xl"
                  style={{ color: 'rgba(12,12,12,0.6)', fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{svc.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── PROJECTS ────────────────────────────────

function ProjectCard({ project, index, totalCards }: { project: typeof PROJECTS[0]; index: number; totalCards: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const targetScale = 1 - (totalCards - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [targetScale, 1])
  return (
    <div ref={cardRef} className="h-[85vh] flex items-start justify-center">
      <motion.div
        style={{ scale, position: 'sticky', top: `${96 + index * 28}px`, width: '100%', background: '#0c0c0c' }}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/20 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-4">
          <span className="font-black leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 110px)', letterSpacing: '-0.04em', WebkitTextStroke: '1px rgba(215,226,234,0.3)', color: 'transparent' }}>
            {project.num}
          </span>
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            <span className="font-medium uppercase tracking-widest text-[#D7E2EA]/50"
              style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>{project.category}</span>
            <span className="font-black uppercase leading-tight text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 2rem)' }}>{project.name}</span>
          </div>
          <LiveProjectButton />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 3fr' }}>
          <div className="flex flex-col gap-3">
            <div className="rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#111]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}>
              <img src={project.images.col1Top} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#111]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}>
              <img src={project.images.col1Bot} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#111]">
            <img src={project.images.col2} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProjectsSection() {
  return (
    <section className="bg-[#0c0c0c] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10">
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Ejemplos
        </h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.num} project={project} index={i} totalCards={PROJECTS.length} />
        ))}
      </div>
      <FadeIn delay={0.2} y={24} className="flex flex-col items-center mt-24 md:mt-32 gap-6">
        <p className="font-medium uppercase tracking-widest text-center text-[#D7E2EA]/40" style={{ fontSize: '0.8rem' }}>
          ¿Lista para crear la tuya?
        </p>
        <CampaignButton />
      </FadeIn>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────

function PricingSection() {
  return (
    <section id="precios" className="bg-[#0c0c0c] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
        <h2 className="hero-heading font-black uppercase"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Precios
        </h2>
        <p className="mt-4 font-light text-[#D7E2EA]/50" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}>
          Elige más, paga menos. Todos los planes entregan lo mismo — solo cambia el volumen.
        </p>
      </FadeIn>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 0.1} y={24}>
            <div className="flex flex-col p-8 rounded-3xl relative h-full"
              style={{
                background: plan.featured ? 'rgba(0,223,129,0.05)' : 'rgba(255,255,255,0.03)',
                border: plan.featured ? '1px solid rgba(0,223,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ background: '#00df81', color: '#000', fontSize: '9px' }}>
                  ⭐ Más elegido
                </div>
              )}
              <p className="font-black uppercase tracking-widest mb-4 text-[#D7E2EA]/35" style={{ fontSize: '0.65rem' }}>{plan.name}</p>
              <p className="font-black leading-none mb-1 text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '-0.03em' }}>
                {plan.price}
                <span className="font-medium ml-1 text-white/35" style={{ fontSize: '0.85rem' }}>{plan.period}</span>
              </p>
              <p className="font-light mt-3 mb-6 pb-6 leading-relaxed text-[#D7E2EA]/45"
                style={{ fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {plan.tagline}
              </p>
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-medium text-[#D7E2EA]/78" style={{ fontSize: '0.875rem' }}>
                    <span className="text-[#00df81] font-black shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => { window.location.href = `/signup?plan=${plan.planId}` }}
                className="w-full py-3.5 rounded-full font-black uppercase tracking-wider text-sm transition-all duration-200"
                style={plan.featured
                  ? { background: '#00df81', color: '#000' }
                  : { background: 'transparent', color: 'rgba(215,226,234,0.65)', border: '1px solid rgba(215,226,234,0.16)' }}>
                {plan.name === 'Starter' ? 'Crear mis primeras campañas →' : plan.name === 'Pro' ? 'Crear más anuncios →' : 'Escalar mi publicidad →'}
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0c0c0c] px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="font-black tracking-tight text-[#D7E2EA]" style={{ fontSize: '1.2rem' }}>ALTY</span>
      <div className="flex items-center gap-6 flex-wrap">
        {[{ label: 'Privacidad', href: '/privacy' }, { label: 'Términos', href: '/terms' }, { label: 'soporte@altyapp.com', href: 'mailto:soporte@altyapp.com' }].map((l) => (
          <a key={l.label} href={l.href} className="font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(215,226,234,0.35)', fontSize: '0.7rem' }}>{l.label}</a>
        ))}
      </div>
      <span className="font-medium uppercase tracking-widest" style={{ color: 'rgba(215,226,234,0.2)', fontSize: '0.65rem' }}>© 2026 ALTY</span>
    </footer>
  )
}

// ─── MOBILE STICKY CTA ───────────────────────

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
      <button className="text-black font-black uppercase tracking-wider text-sm w-full"
        onClick={() => { window.location.href = '/signup?plan=starter' }}>
        Crear mi primera campaña →
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  return (
    <main style={{ overflowX: 'clip', background: '#0c0c0c' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <Footer />
      <MobileStickyCTA />
    </main>
  )
}
