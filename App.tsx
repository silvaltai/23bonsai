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

const MARQUEE_IMAGES = [
  '/images/alty-ganadores-1.png',
  '/images/alty-ganadores-2.png',
  '/images/alty-ganadores-3.png',
  '/images/alty-ganadores-4.png',
  '/images/alty-ganadores-5.png',
  '/images/alty-ganadores-6.png',
  '/images/alty-ganadores-7.png',
  '/images/alty-ganadores-8.png',
  '/images/alty-ganadores-9.png',
  '/images/alty-ganadores-10.png',
]
const ROW1 = MARQUEE_IMAGES.slice(0, 6)
const ROW2 = MARQUEE_IMAGES.slice(4)

const SERVICES = [
  { num: '01', name: 'Video IA', desc: 'Producción de video publicitario con inteligencia artificial, con copy, ritmo y ganchos optimizados para convertir en Meta, Instagram y TikTok.' },
  { num: '02', name: 'Ads Estáticos', desc: '5 anuncios de imagen por campaña con copy estratégico y diseño visual listo para publicar. Múltiples ángulos para testear cuál vende mejor.' },
  { num: '03', name: 'Copy Estratégico', desc: 'Textos escritos para vender, no para decorar. Cada pieza lleva el hook correcto según el formato y la plataforma donde se va a publicar.' },
  { num: '04', name: 'Formatos Nativos', desc: 'Los creativos salen en los formatos correctos para cada plataforma. Feed 4:5, Story 9:16, Square 1:1. Sin retoques manuales.' },
  { num: '05', name: 'Entrega en 24hrs', desc: 'La campaña completa lista para publicar en menos de 24 horas desde que subes el link del producto. Sin reuniones, sin briefs.' },
]

const PROJECTS = [
  { num: '01', category: 'Campaña Generada', name: 'Skincare Orgánica', images: { col1Top: '/images/alty-ganadores-1.png', col1Bot: '/images/alty-ganadores-2.png', col2: '/images/alty-ganadores-3.png' } },
  { num: '02', category: 'Campaña Generada', name: 'Tech Wearable', images: { col1Top: '/images/alty-ganadores-4.png', col1Bot: '/images/alty-ganadores-5.png', col2: '/images/alty-ganadores-6.png' } },
  { num: '03', category: 'Campaña Generada', name: 'Hogar & Deco', images: { col1Top: '/images/alty-ganadores-7.png', col1Bot: '/images/alty-ganadores-8.png', col2: '/images/alty-ganadores-9.png' } },
]

const PLANS = [
  { name: 'Starter', price: '$19.990', period: 'CLP/mes', tagline: 'Para probar ALTY con tu primera tanda de publicidad IA.', items: ['3 campañas publicitarias IA', '3 videos IA', '15 ads estáticos', 'Listos para Meta y TikTok', 'Entrega en 24 horas'], planId: 'starter', featured: false },
  { name: 'Pro', price: '$29.990', period: 'CLP/mes', tagline: 'Para marcas que quieren testear más ángulos y encontrar mejores creativos.', items: ['6 campañas publicitarias IA', '6 videos IA', '30 ads estáticos', 'Más ángulos creativos para testear', 'Entrega en 24 horas'], planId: 'pro', featured: true },
  { name: 'Business', price: '$49.990', period: 'CLP/mes', tagline: 'Para marcas que necesitan volumen creativo constante.', items: ['12 campañas publicitarias IA', '12 videos IA', '60 ads estáticos', 'Mayor volumen para campañas activas', 'Entrega en 24 horas'], planId: 'business', featured: false },
]

// ── COMPONENTES ──────────────────────────────

function CampaignButton() {
  return (
    <button
      onClick={() => { window.location.href = '/signup?plan=starter' }}
      className="rounded-full font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{ background: 'linear-gradient(123deg, #001a0e 7%, #00df81 37%, #007842 72%, #002b1a 100%)', boxShadow: '0px 4px 4px rgba(0,223,129,0.2), 4px 4px 12px #007842 inset', outline: '2px solid rgba(255,255,255,0.15)', outlineOffset: '-3px' }}
    >
      Crear mi campaña
    </button>
  )
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors px-6 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm">
      Ver campaña
    </button>
  )
}

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style }: { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
    >{children}</motion.div>
  )
}

function Magnet({ children, padding = 150, strength = 3 }: { children: ReactNode; padding?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
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

// ── SECCIONES ────────────────────────────────

function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col overflow-x-clip" style={{ background: '#0c0c0c' }}>
      <FadeIn delay={0} y={-20} className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
        <nav className="contents">
          {['Cómo funciona', 'Precios', 'Ejemplos', 'Contacto'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
              style={{ color: '#D7E2EA' }}>{link}</a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full px-4 sm:px-6 md:px-8 mt-6 sm:mt-4 md:-mt-5"
            style={{ fontSize: 'clamp(40px, 14vw, 180px)' }}>
            PUBLICIDAD CON IA.
          </h1>
        </FadeIn>
      </div>

      <div className="flex items-end justify-between pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 mt-auto">
        <FadeIn delay={0.35} y={20}>
          <p className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ color: '#D7E2EA', fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            el primer agente que transforma un producto en una campaña lista para vender
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><CampaignButton /></FadeIn>
      </div>

      <FadeIn delay={0.6} y={30}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet padding={150} strength={3}>
          <img src="/images/alty-hero.png" alt="Campaña publicitaria IA — ALTY" className="w-full h-auto object-contain" loading="eager" />
        </Magnet>
      </FadeIn>
    </section>
  )
}

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
          {tripled(ROW1).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111]" style={{ width: 420, height: 270 }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3" style={{ width: 'max-content', willChange: 'transform' }}>
          {tripled(ROW2).map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111]" style={{ width: 420, height: 270 }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden" style={{ background: '#0c0c0c' }}>
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[4%] pointer-events-none">
        <div className="w-[100px] sm:w-[180px] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.18) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[4%] pointer-events-none">
        <div className="w-[100px] sm:w-[180px] aspect-square rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.12) 0%, transparent 70%)' }} />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[10%] pointer-events-none">
        <div className="w-[80px] sm:w-[140px] aspect-square" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.10) 0%, transparent 70%)', borderRadius: '40% 60% 55% 45%' }} />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[10%] pointer-events-none">
        <div className="w-[90px] sm:w-[150px] aspect-square" style={{ background: 'radial-gradient(circle, rgba(0,223,129,0.08) 0%, transparent 70%)', borderRadius: '55% 45% 40% 60%' }} />
      </FadeIn>
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center z-10">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading-muted font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Qué hacemos
          </h2>
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text="Somos el primer Agente IA de Publicidad. Pegas el link de tu producto y nosotros producimos el video IA y los 5 ads estáticos en 24 horas. Listos para Meta, Instagram y TikTok. Sin agencia, sin diseñador, sin procesos eternos."
            className="font-medium text-center leading-relaxed max-w-[560px] text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <CampaignButton />
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: '#ffffff' }}>
      <FadeIn delay={0} y={40}>
        <h2 className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ color: '#0c0c0c', fontSize: 'clamp(3rem, 12vw, 160px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Campaña
        </h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((svc, i) => (
          <FadeIn key={svc.num} delay={i * 0.1} y={24}>
            <div className="flex items-start gap-4 md:gap-8 py-8 sm:py-10 md:py-12"
              style={{ borderTop: i === 0 ? '1px solid rgba(12,12,12,0.12)' : undefined, borderBottom: '1px solid rgba(12,12,12,0.12)' }}>
              <span className="font-black leading-none shrink-0"
                style={{ color: '#0c0c0c', fontSize: 'clamp(3rem, 10vw, 140px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {svc.num}
              </span>
              <div className="flex flex-col gap-2 pt-1 md:pt-2">
                <h3 className="font-medium uppercase" style={{ color: '#0c0c0c', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{svc.name}</h3>
                <p className="font-light leading-relaxed max-w-2xl" style={{ color: 'rgba(12,12,12,0.55)', fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{svc.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

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
          <div className="flex flex-col items-start gap-1 flex-1">
            <span className="font-medium uppercase tracking-widest" style={{ color: '#D7E2EA', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)', opacity: 0.5 }}>{project.category}</span>
            <span className="font-black uppercase leading-tight" style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2.5vw, 2rem)' }}>{project.name}</span>
          </div>
          <LiveProjectButton />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 3fr' }}>
          <div className="flex flex-col gap-3">
            <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden bg-[#111] border border-white/[0.06]" style={{ height: 'clamp(130px, 16vw, 230px)' }}>
              <img src={project.images.col1Top} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden bg-[#111] border border-white/[0.06]" style={{ height: 'clamp(160px, 22vw, 340px)' }}>
              <img src={project.images.col1Bot} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden bg-[#111] border border-white/[0.06]">
            <img src={project.images.col2} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProjectsSection() {
  return (
    <section className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#0c0c0c', position: 'relative', zIndex: 10 }}>
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
        <p className="font-medium uppercase tracking-widest text-center" style={{ color: 'rgba(215,226,234,0.4)', fontSize: '0.8rem' }}>¿Listo para crear la tuya?</p>
        <CampaignButton />
      </FadeIn>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="precios" className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#0c0c0c', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
        <h2 className="hero-heading font-black uppercase" style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)', letterSpacing: '-0.03em', lineHeight: 1 }}>Precios</h2>
        <p className="mt-4 font-light" style={{ color: 'rgba(215,226,234,0.5)', fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}>
          Elige más, paga menos. Todos los planes entregan lo mismo — solo cambia el volumen.
        </p>
      </FadeIn>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 0.1} y={24}>
            <div className="flex flex-col p-8 rounded-3xl relative h-full"
              style={{ background: plan.featured ? 'rgba(0,223,129,0.05)' : 'rgba(255,255,255,0.03)', border: plan.featured ? '1px solid rgba(0,223,129,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ background: '#00df81', color: '#000' }}>⭐ Más elegido</div>
              )}
              <p className="font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(215,226,234,0.35)', fontSize: '0.65rem' }}>{plan.name}</p>
              <p className="font-black leading-none mb-1" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '-0.03em' }}>
                {plan.price}
                <span className="font-medium ml-1" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{plan.period}</span>
              </p>
              <p className="font-light mt-3 mb-6 pb-6 leading-relaxed"
                style={{ color: 'rgba(215,226,234,0.45)', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {plan.tagline}
              </p>
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-medium" style={{ color: 'rgba(215,226,234,0.78)', fontSize: '0.875rem' }}>
                    <span style={{ color: '#00df81', fontWeight: 900, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => { window.location.href = `/signup?plan=${plan.planId}` }}
                className="w-full py-3.5 rounded-full font-black uppercase tracking-wider text-sm transition-all duration-200"
                style={plan.featured ? { background: '#00df81', color: '#000' } : { background: 'transparent', color: 'rgba(215,226,234,0.65)', border: '1px solid rgba(215,226,234,0.16)' }}>
                {plan.name === 'Starter' ? 'Crear mis primeras campañas →' : plan.name === 'Pro' ? 'Crear más anuncios →' : 'Escalar mi publicidad →'}
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0c0c0c' }}>
      <span className="font-black tracking-tight" style={{ color: '#D7E2EA', fontSize: '1.2rem' }}>ALTY</span>
      <div className="flex items-center gap-6 flex-wrap">
        {[{ label: 'Privacidad', href: '/privacy' }, { label: 'Términos', href: '/terms' }, { label: 'soporte@altyapp.com', href: 'mailto:soporte@altyapp.com' }].map((l) => (
          <a key={l.label} href={l.href} className="font-medium uppercase tracking-wider transition-opacity hover:opacity-70" style={{ color: 'rgba(215,226,234,0.35)', fontSize: '0.7rem' }}>{l.label}</a>
        ))}
      </div>
      <span className="font-medium uppercase tracking-widest" style={{ color: 'rgba(215,226,234,0.2)', fontSize: '0.65rem' }}>© 2026 ALTY</span>
    </footer>
  )
}

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
