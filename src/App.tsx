import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import {
  ArrowUpRight,
  Briefcase,
  Code2,
  Database,
  Download,
  ExternalLink,
  GraduationCap,
  Layout,
  Mail,
  MonitorCog,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { getGithubRepos, type GitHubRepo } from "./services/github"

type Theme = "dark" | "light"

type Projeto = {
  titulo: string
  tipo: string
  numero: string
  resumo: string
  foco: string
  tecnologias: string[]
  codigo: string
  icon: LucideIcon
  origem?: "github"
}

type Experiencia = {
  periodo: string
  cargo: string
  empresa: string
  resumo: string
  detalhes: string
  tags: string[]
  icon: LucideIcon
}

type Destaque = {
  titulo: string
  local: string
  periodo: string
  descricao: string
}

type TechGroup = {
  area: string
  texto: string
  itens: string[]
  icon: LucideIcon
}

type ThemeClasses = ReturnType<typeof getThemeClasses>

const STORAGE_KEY = "portfolio-theme"
const profileImage = "/perfil-leonardo.png"
const HEADER_OFFSET = 96
const MAX_PROJECTS = 3

const links = {
  github: "https://github.com/legomesz",
  linkedin:
    "https://www.linkedin.com/in/leonardo-gomes-alexandrini-652363224/?skipRedirect=true",
  email: "mailto:leogomes.mello@hotmail.com",
  curriculo: "/curriculo-leonardo-gomes.pdf",
}

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Tecnologias", href: "#tecnologias" },
  { label: "Experiências", href: "#experiencias" },
  { label: "Contato", href: "#contato" },
]

const socialLinks = [
  { label: "GitHub", href: links.github, icon: Code2, external: true },
  { label: "LinkedIn", href: links.linkedin, icon: ExternalLink, external: true },
  { label: "Email", href: links.email, icon: Mail, external: false },
]

const tecnologias: TechGroup[] = [
  {
    area: "Backend e dados",
    texto:
      "Criação de APIs, organização de regras de negócio, persistência e estruturação de sistemas.",
    itens: ["Java", "Spring Boot", "PostgreSQL"],
    icon: Database,
  },
  {
    area: "Web e interfaces",
    texto:
      "Construção de páginas responsivas, com atenção à clareza visual, navegação e experiência de uso.",
    itens: ["HTML", "CSS", "JavaScript", "React", "WordPress"],
    icon: Layout,
  },
  {
    area: "Entrega e organização",
    texto:
      "Versionamento, documentação e ferramentas que ajudam a transformar ideias em entregas reais.",
    itens: ["GitHub", "UI/UX", "Excel", "Edição de vídeo"],
    icon: MonitorCog,
  },
]

const experiencias: Experiencia[] = [
  {
    periodo: "2024 — 2025",
    cargo: "Customer Service & Support",
    empresa: "Vancouver — Atendimento Internacional",
    resumo: "Contato direto com clientes internacionais em inglês.",
    detalhes:
      "Atendimento, resolução de problemas e comunicação com públicos de diferentes contextos. Essa experiência ajudou no desenvolvimento da minha comunicação, adaptação e postura profissional.",
    tags: ["Inglês", "Suporte", "Comunicação"],
    icon: Briefcase,
  },
  {
    periodo: "2023 — 2024",
    cargo: "Web Designer de Portais",
    empresa: "EMPREL",
    resumo: "Criação e manutenção de interfaces para portais web.",
    detalhes:
      "Atuação com páginas institucionais, responsividade, organização de conteúdo e melhorias na experiência de uso em ambientes digitais.",
    tags: ["Portais", "UX", "Responsividade"],
    icon: Layout,
  },
  {
    periodo: "2023 — 2024",
    cargo: "Desenvolvedor e Designer",
    empresa: "Projeto VR — Prefeitura do Recife",
    resumo: "Participação em projeto de realidade virtual educacional.",
    detalhes:
      "Apoio em design, acessibilidade, modelagem e integração técnica em uma solução voltada à educação e experiência imersiva.",
    tags: ["VR", "Design", "Acessibilidade"],
    icon: Sparkles,
  },
  {
    periodo: "2019 — 2020",
    cargo: "Instrutor de Programação",
    empresa: "SuperGeeks — DF",
    resumo: "Apoio no ensino de lógica de programação e Python.",
    detalhes:
      "Acompanhamento de estudantes em projetos práticos, reforçando lógica, raciocínio computacional e primeiros passos em programação.",
    tags: ["Python", "Ensino", "Lógica"],
    icon: GraduationCap,
  },
]

const destaques: Destaque[] = [
  {
    titulo: "Formação em tecnologia",
    local: "UNIT-PE",
    periodo: "2022 — 2025",
    descricao:
      "Graduação em Análise e Desenvolvimento de Sistemas, com base em programação, banco de dados, lógica e construção de aplicações.",
  },
  {
    titulo: "Vivência internacional",
    local: "ILAC International College — Vancouver",
    periodo: "2024 — 2025",
    descricao:
      "Formação ligada a atendimento, negócios e marketing digital, com uso diário do inglês e contato com pessoas de diferentes culturas.",
  },
  {
    titulo: "Portais e experiência do usuário",
    local: "EMPREL",
    periodo: "2023 — 2024",
    descricao:
      "Experiência prática com portais web, organização de conteúdo, responsividade e manutenção de interfaces online.",
  },
  {
    titulo: "Programação e ensino",
    local: "SuperGeeks / KA Solution",
    periodo: "2019 — 2022",
    descricao:
      "Base prática em lógica, Python, análise de dados e apoio no desenvolvimento de projetos educacionais.",
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"

  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === "light" ? "light" : "dark"
}

function getThemeClasses(isDark: boolean) {
  return {
    bgMain: isDark ? "bg-[#080a10]" : "bg-[#f6f7f9]",
    bgSection: isDark ? "bg-[#0c1018]" : "bg-white",
    header: isDark ? "bg-[#080a10]/86" : "bg-white/86",
    border: isDark ? "border-white/10" : "border-zinc-200",
    textMain: isDark ? "text-zinc-50" : "text-zinc-950",
    textSoft: isDark ? "text-zinc-400" : "text-zinc-600",
    textMuted: isDark ? "text-zinc-500" : "text-zinc-500",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    card: isDark
      ? "border-white/10 bg-[#111827]/76 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
      : "border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]",
    cardSoft: isDark
      ? "border-white/10 bg-white/[0.035]"
      : "border-zinc-200 bg-zinc-50/80",
    accentPill: isDark
      ? "bg-blue-500/10 text-blue-300"
      : "bg-blue-50 text-blue-700",
    subtlePill: isDark
      ? "border-white/10 bg-white/[0.04] text-zinc-300"
      : "border-zinc-200 bg-zinc-50 text-zinc-700",
  }
}

function nextIndex(current: number, length: number) {
  return current === length - 1 ? 0 : current + 1
}

function previousIndex(current: number, length: number) {
  return current === 0 ? length - 1 : current - 1
}

function formatDate(date?: string) {
  if (!date) return "data não informada"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

function repoToProject(repo: GitHubRepo, index: number): Projeto {
  const topics = (repo.topics || [])
    .filter((topic) => topic !== "portfolio")
    .slice(0, 3)

  return {
    titulo: repo.name,
    tipo: repo.language || "Projeto",
    numero: String(index + 1).padStart(2, "0"),
    resumo:
      repo.description ||
      "Projeto publicado no GitHub para registrar prática, evolução técnica e organização de código.",
    foco: `Última atualização em ${formatDate(repo.updated_at || repo.pushed_at)}.`,
    tecnologias: [repo.language, ...topics].filter(Boolean) as string[],
    codigo: repo.html_url,
    icon: Code2,
    origem: "github",
  }
}

function smoothScrollTo(targetY: number, duration = 850) {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3)

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    window.scrollTo(0, startY + distance * easeOutCubic(progress))

    if (progress < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-sm leading-7 text-zinc-500 sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function Tag({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${className}`}>
      {children}
    </span>
  )
}

function IconButton({
  label,
  onClick,
  children,
  classes,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  classes: ThemeClasses
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 ${classes.cardSoft}`}
      aria-label={label}
      type="button"
    >
      {children}
    </button>
  )
}

function ExternalButton({
  href,
  children,
  external = true,
  variant = "soft",
  classes,
  onClick,
  download = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
  variant?: "primary" | "soft"
  classes: ThemeClasses
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  download?: boolean
}) {
  const base =
    "inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500",
    soft: `border hover:border-blue-500/50 ${classes.card}`,
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      download={download}
    >
      {children}
    </a>
  )
}

function ProgressDots({
  total,
  activeIndex,
  onChange,
  isDark,
  labelPrefix,
}: {
  total: number
  activeIndex: number
  onChange: (index: number) => void
  isDark: boolean
  labelPrefix: string
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? "w-8 bg-blue-500"
              : isDark
                ? "w-2 bg-white/20 hover:bg-white/35"
                : "w-2 bg-zinc-300 hover:bg-zinc-400"
          }`}
          aria-label={`${labelPrefix} ${index + 1}`}
          type="button"
        />
      ))}
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [destaqueAtual, setDestaqueAtual] = useState(0)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [projetoAtivo, setProjetoAtivo] = useState(0)
  const [activeSection, setActiveSection] = useState("#inicio")

  const isDark = theme === "dark"
  const classes = useMemo(() => getThemeClasses(isDark), [isDark])

  const projetosGithub = useMemo(
    () => githubRepos.slice(0, MAX_PROJECTS).map(repoToProject),
    [githubRepos]
  )

  const projetosParaExibir = useMemo(() => {
    return projetosGithub.slice(0, MAX_PROJECTS).map((projeto, index) => ({
      ...projeto,
      numero: String(index + 1).padStart(2, "0"),
    }))
  }, [projetosGithub])

  const projetoSelecionado =
    projetosParaExibir[projetoAtivo] ?? projetosParaExibir[0]

  const alternarTema = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"))

  const navegarParaSecao = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault()

      const section = document.querySelector<HTMLElement>(href)
      if (!section) return

      const targetPosition =
        section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

      smoothScrollTo(Math.max(targetPosition, 0))
      window.history.pushState(null, "", href)
      setActiveSection(href)
    },
    []
  )

  const avancarDestaque = useCallback(() => {
    setDestaqueAtual((current) => nextIndex(current, destaques.length))
  }, [])

  const voltarDestaque = useCallback(() => {
    setDestaqueAtual((current) => previousIndex(current, destaques.length))
  }, [])

  const avancarProjeto = useCallback(() => {
    setProjetoAtivo((current) => nextIndex(current, projetosParaExibir.length))
  }, [projetosParaExibir.length])

  const voltarProjeto = useCallback(() => {
    setProjetoAtivo((current) =>
      previousIndex(current, projetosParaExibir.length)
    )
  }, [projetosParaExibir.length])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const sections = navLinks
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) setActiveSection(`#${visibleEntry.target.id}`)
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadRepos() {
      try {
        setLoadingRepos(true)

        const repos = await getGithubRepos()

        if (isMounted) {
          setGithubRepos(repos)
        }
      } catch (error) {
        console.warn("Não foi possível carregar os projetos do GitHub:", error)

        if (isMounted) {
          setGithubRepos([])
        }
      } finally {
        if (isMounted) {
          setLoadingRepos(false)
        }
      }
    }

    loadRepos()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(avancarDestaque, 5600)

    return () => window.clearInterval(interval)
  }, [avancarDestaque])

  useEffect(() => {
    if (projetoAtivo > projetosParaExibir.length - 1) {
      setProjetoAtivo(0)
    }
  }, [projetoAtivo, projetosParaExibir.length])

  return (
    <main
      className={`min-h-screen overflow-x-hidden ${classes.bgMain} ${classes.textMain}`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -left-36 top-24 h-80 w-80 rounded-full blur-3xl ${
            isDark ? "bg-blue-600/10" : "bg-blue-200/50"
          }`}
        />

        <div
          className={`absolute right-[-130px] top-10 h-[28rem] w-[28rem] rounded-full blur-3xl ${
            isDark ? "bg-indigo-700/10" : "bg-slate-200/60"
          }`}
        />
      </div>

      <header
        className={`sticky top-0 z-50 border-b ${classes.border} ${classes.header} backdrop-blur-xl`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:relative lg:flex-row lg:items-center lg:justify-center lg:py-4">
          <button
            onClick={alternarTema}
            className={`relative flex h-10 w-[76px] shrink-0 items-center self-end rounded-full border p-1 transition-all duration-300 hover:-translate-y-0.5 lg:absolute lg:right-6 ${
              isDark
                ? "border-white/10 bg-[#111827]/90"
                : "border-zinc-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
            }`}
            aria-label="Alternar tema"
            type="button"
          >
            <span
              className={`absolute h-8 w-8 rounded-full transition-all duration-300 ${
                isDark
                  ? "left-1 bg-blue-600 shadow-lg shadow-blue-600/30"
                  : "left-[38px] bg-zinc-900 shadow-lg shadow-zinc-900/20"
              }`}
            />

            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center text-sm ${
                isDark ? "text-white" : "text-zinc-400"
              }`}
            >
              ☾
            </span>

            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center text-sm ${
                isDark ? "text-zinc-500" : "text-white"
              }`}
            >
              ☀
            </span>
          </button>

          <div className="flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap rounded-full border border-transparent pb-1 text-sm font-medium [&::-webkit-scrollbar]:hidden lg:w-auto lg:justify-center lg:overflow-visible lg:pb-0">
            {navLinks.map(({ label, href }) => {
              const active = activeSection === href

              return (
                <a
                  key={label}
                  href={href}
                  onClick={(event) => navegarParaSecao(event, href)}
                  className={`shrink-0 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    active
                      ? isDark
                        ? "bg-white/10 text-white"
                        : "bg-zinc-900 text-white"
                      : `${classes.textSoft} hover:bg-blue-500/10 hover:text-blue-500`
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>
        </nav>
      </header>

      <section
        id="inicio"
        className="relative mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${
              isDark
                ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Portfólio
          </motion.p>

          <motion.div variants={fadeUp}>
            <p
              className={`text-sm font-medium uppercase tracking-[0.24em] ${classes.textMuted}`}
            >
              Leonardo Gomes
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-[3.35rem]">
              Desenvolvedor em formação com foco em web e backend.
            </h1>

            <p className={`mt-4 text-lg font-semibold ${classes.accent}`}>
              Projetos práticos, interfaces digitais e APIs.
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className={`mt-5 max-w-xl text-sm leading-7 sm:text-base ${classes.textSoft}`}
          >
            Sou estudante de Análise e Desenvolvimento de Sistemas e venho
            desenvolvendo projetos para melhorar minha base em programação,
            interfaces web e backend.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <ExternalButton
              href="#projetos"
              external={false}
              variant="primary"
              classes={classes}
              onClick={(event) => navegarParaSecao(event, "#projetos")}
            >
              Ver projetos
              <ArrowUpRight size={15} />
            </ExternalButton>

            <ExternalButton
              href={links.curriculo}
              external={false}
              classes={classes}
              download
            >
              Baixar currículo
              <Download size={15} />
            </ExternalButton>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <ExternalButton
                key={label}
                href={href}
                external={external}
                classes={classes}
              >
                <Icon size={15} />
                {label}
              </ExternalButton>
            ))}
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`relative overflow-hidden rounded-[2rem] border p-5 sm:p-6 ${classes.card}`}
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-blue-500/20 sm:h-32 sm:w-32">
                <img
                  src={profileImage}
                  alt="Foto de perfil de Leonardo Gomes"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isDark
                        ? "bg-green-500/10 text-green-400"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    Aberto a oportunidades
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${classes.subtlePill}`}
                  >
                    Recife / remoto
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight">
                  Leonardo Gomes
                </h2>

                <p className={`mt-2 text-sm leading-7 ${classes.textSoft}`}>
                  Estudante de Análise e Desenvolvimento de Sistemas, com
                  experiência em portais web, atendimento internacional e
                  projetos práticos de programação.
                </p>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${classes.cardSoft}`}>
              <p
                className={`text-xs uppercase tracking-[0.18em] ${classes.textMuted}`}
              >
                Atualmente estudando e praticando
              </p>

              <p className="mt-3 text-base font-semibold">
                Desenvolvimento web, backend com Java e organização de
                interfaces.
              </p>

              <p className={`mt-3 text-sm leading-7 ${classes.textSoft}`}>
                Meu foco é evoluir em projetos reais, melhorar minha base
                técnica e construir aplicações mais bem estruturadas.
              </p>
            </div>

            <div>
              <p
                className={`mb-3 text-xs uppercase tracking-[0.18em] ${classes.textMuted}`}
              >
                Tecnologias principais
              </p>

              <div className="flex flex-wrap gap-2">
                {["Java", "Spring Boot", "PostgreSQL", "React", "GitHub"].map(
                  (item) => (
                    <span
                      key={item}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${classes.accentPill}`}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div
              className={`grid gap-3 border-t pt-5 ${classes.border} sm:grid-cols-3`}
            >
              {[
                ["Web", "Interfaces e páginas responsivas"],
                ["Backend", "APIs e regras de negócio"],
                ["Projetos", "Código publicado no GitHub"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className={`rounded-2xl border p-4 ${classes.cardSoft}`}
                >
                  <p className="font-semibold text-blue-500">{title}</p>
                  <p className={`mt-2 text-xs leading-5 ${classes.textSoft}`}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </section>

      <section
        id="sobre"
        className={`scroll-mt-28 border-y ${classes.border} ${classes.bgSection}`}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                eyebrow="Sobre mim"
                title="Um pouco sobre minha trajetória"
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className={`mt-5 space-y-5 text-sm leading-7 sm:text-base ${classes.textSoft}`}
            >
              <p>
                Minha trajetória passa por desenvolvimento web, portais, suporte
                internacional, design digital e projetos acadêmicos. Essas
                experiências me ajudaram a enxergar tecnologia de forma prática:
                código, organização, comunicação e experiência de uso precisam
                andar juntos.
              </p>

              <p>
                Hoje estou focado em consolidar minha base técnica em backend e
                desenvolvimento web, buscando criar projetos mais completos, bem
                estruturados e fáceis de entender.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7">
              <ExternalButton
                href="#tecnologias"
                external={false}
                classes={classes}
                onClick={(event) => navegarParaSecao(event, "#tecnologias")}
              >
                Ver tecnologias
                <ArrowUpRight size={16} />
              </ExternalButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-[2rem] border p-5 sm:p-6 ${classes.card}`}
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-500">
                Destaques
              </p>

              <div className="flex items-center gap-2">
                <IconButton
                  label="Destaque anterior"
                  onClick={voltarDestaque}
                  classes={classes}
                >
                  ←
                </IconButton>

                <IconButton
                  label="Próximo destaque"
                  onClick={avancarDestaque}
                  classes={classes}
                >
                  →
                </IconButton>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={destaqueAtual}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-xl font-bold sm:text-2xl">
                  {destaques[destaqueAtual].titulo}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="text-sm font-medium text-blue-500">
                    {destaques[destaqueAtual].local}
                  </p>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${classes.subtlePill}`}
                  >
                    {destaques[destaqueAtual].periodo}
                  </span>
                </div>

                <p
                  className={`mt-5 text-sm leading-7 sm:text-base ${classes.textSoft}`}
                >
                  {destaques[destaqueAtual].descricao}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7">
              <ProgressDots
                total={destaques.length}
                activeIndex={destaqueAtual}
                onChange={setDestaqueAtual}
                isDark={isDark}
                labelPrefix="Ver destaque"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="projetos"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Projetos"
            title="Projetos publicados e em desenvolvimento"
            description="Projetos que demonstram habilidades técnicas, organização e progresso prático."
          />

          <ExternalButton href={links.github} classes={classes}>
            Ver GitHub
            <ArrowUpRight size={15} />
          </ExternalButton>
        </div>

        {loadingRepos && (
          <p className={`text-sm ${classes.textMuted}`}>
            Carregando projetos do GitHub...
          </p>
        )}

        {!loadingRepos && projetosParaExibir.length === 0 && (
          <div className={`rounded-[2rem] border p-6 ${classes.card}`}>
            <h3 className="font-semibold">
              Nenhum projeto com a tag portfolio foi carregado.
            </h3>
            <p className={`mt-3 text-sm ${classes.textSoft}`}>
              Confira se os repositórios estão públicos e com a topic portfolio no GitHub.
            </p>
          </div>
        )}

        {!loadingRepos && projetosParaExibir.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
            <AnimatePresence mode="wait">
              {projetoSelecionado && (
                <motion.article
                  key={`${projetoSelecionado.titulo}-${projetoAtivo}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative overflow-hidden rounded-[2rem] border p-5 sm:p-7 lg:p-8 ${classes.card}`}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                  </div>

                  <div className="relative">
                    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${classes.accentPill}`}
                          >
                            {projetoSelecionado.tipo}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${classes.subtlePill}`}
                          >
                            Projeto {projetoSelecionado.numero}
                          </span>
                        </div>

                        <h3 className="max-w-2xl break-words text-3xl font-bold tracking-tight sm:text-4xl">
                          {projetoSelecionado.titulo}
                        </h3>
                      </div>

                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                          isDark
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                            : "border-blue-100 bg-blue-50 text-blue-600"
                        }`}
                      >
                        {(() => {
                          const ProjectIcon = projetoSelecionado.icon
                          return <ProjectIcon size={25} strokeWidth={1.9} />
                        })()}
                      </div>
                    </div>

                    <p
                      className={`max-w-3xl text-base leading-8 ${classes.textSoft}`}
                    >
                      {projetoSelecionado.resumo}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.75fr]">
                      <div
                        className={`rounded-2xl border p-5 ${classes.cardSoft}`}
                      >
                        <p
                          className={`text-xs uppercase tracking-[0.18em] ${classes.textMuted}`}
                        >
                          O que esse projeto demonstra
                        </p>

                        <p
                          className={`mt-3 text-sm leading-7 sm:text-[15px] ${classes.textSoft}`}
                        >
                          {projetoSelecionado.foco}
                        </p>
                      </div>

                      <div
                        className={`rounded-2xl border p-5 ${classes.cardSoft}`}
                      >
                        <p
                          className={`text-xs uppercase tracking-[0.18em] ${classes.textMuted}`}
                        >
                          Tecnologias
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(projetoSelecionado.tecnologias.length > 0
                            ? projetoSelecionado.tecnologias
                            : ["Projeto web"]
                          ).map((tech) => (
                            <Tag key={tech} className={classes.subtlePill}>
                              {tech}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`mt-8 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${classes.border}`}
                    >
                      <ExternalButton
                        href={projetoSelecionado.codigo}
                        variant="primary"
                        classes={classes}
                      >
                        Ver repositório
                        <ArrowUpRight size={15} />
                      </ExternalButton>

                      <div className="flex items-center gap-3">
                        <IconButton
                          label="Projeto anterior"
                          onClick={voltarProjeto}
                          classes={classes}
                        >
                          ←
                        </IconButton>

                        <IconButton
                          label="Próximo projeto"
                          onClick={avancarProjeto}
                          classes={classes}
                        >
                          →
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>

            <aside className="self-start">
              <div className="grid gap-3">
                {projetosParaExibir.map((projeto, index) => {
                  const active = index === projetoAtivo

                  return (
                    <button
                      key={`${projeto.titulo}-${index}`}
                      onClick={() => setProjetoAtivo(index)}
                      type="button"
                      className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? isDark
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-blue-200 bg-blue-50"
                          : `${classes.card} hover:-translate-y-0.5 hover:border-blue-500/40`
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span
                            className={`text-[11px] font-medium ${
                              active ? "text-blue-500" : classes.textMuted
                            }`}
                          >
                            Projeto {projeto.numero}
                          </span>

                          <h4 className="mt-2 truncate text-base font-semibold">
                            {projeto.titulo}
                          </h4>
                        </div>

                        <ArrowUpRight
                          size={15}
                          className={`mt-1 shrink-0 transition ${
                            active ? "text-blue-500" : classes.textMuted
                          }`}
                        />
                      </div>

                      <p
                        className={`mt-2 line-clamp-3 text-sm leading-6 ${classes.textSoft}`}
                      >
                        {projeto.resumo}
                      </p>
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>
        )}
      </section>

      <section
        id="tecnologias"
        className={`scroll-mt-28 border-y ${classes.border} ${classes.bgSection}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeader
            eyebrow="Tecnologias"
            title="Ferramentas que uso na prática"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="mt-8 grid gap-5 lg:grid-cols-3"
          >
            {tecnologias.map((grupo, index) => {
              const TechIcon = grupo.icon

              return (
                <motion.article
                  key={grupo.area}
                  variants={cardReveal}
                  whileHover={{ y: -5 }}
                  className={`rounded-[1.5rem] border p-5 transition duration-300 hover:border-blue-500/40 ${classes.card}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isDark
                            ? "bg-blue-500/10 text-blue-300"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <TechIcon size={20} />
                      </div>

                      <h3 className="font-bold">{grupo.area}</h3>
                    </div>

                    <span className="text-sm text-blue-500">0{index + 1}</span>
                  </div>

                  <p className={`text-sm leading-7 ${classes.textSoft}`}>
                    {grupo.texto}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {grupo.itens.map((item) => (
                      <Tag key={item} className={classes.subtlePill}>
                        {item}
                      </Tag>
                    ))}
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section
        id="experiencias"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="mb-10">
          <SectionHeader
            eyebrow="Experiências"
            title="Experiências"
            description="Algumas experiências que contribuíram para minha formação técnica, comunicação e visão prática de projetos."
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="relative grid gap-5 lg:grid-cols-2"
        >
          {experiencias.map((exp, index) => {
            const ExperienceIcon = exp.icon

            return (
              <motion.article
                key={`${exp.cargo}-${index}`}
                variants={cardReveal}
                whileHover={{ y: -5 }}
                className={`group relative overflow-hidden rounded-[1.7rem] border p-5 transition duration-300 hover:border-blue-500/40 sm:p-6 ${classes.card}`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                </div>

                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                        isDark
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                          : "border-blue-100 bg-blue-50 text-blue-600"
                      }`}
                    >
                      <ExperienceIcon size={21} />
                    </div>

                    {index < experiencias.length - 1 && (
                      <div
                        className={`mt-4 hidden h-full min-h-20 w-px lg:block ${
                          isDark ? "bg-white/10" : "bg-zinc-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${classes.accentPill}`}
                        >
                          {exp.periodo}
                        </span>

                        <h3 className="mt-4 text-xl font-bold leading-snug">
                          {exp.cargo}
                        </h3>

                        <p className="mt-2 text-sm font-medium text-blue-500">
                          {exp.empresa}
                        </p>
                      </div>

                      <span
                        className={`hidden rounded-full border px-3 py-1 text-xs sm:inline-flex ${classes.subtlePill}`}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <p className={`mt-4 text-sm leading-7 ${classes.textSoft}`}>
                      {exp.resumo}
                    </p>

                    <p className={`mt-3 text-sm leading-7 ${classes.textSoft}`}>
                      {exp.detalhes}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <Tag key={tag} className={classes.subtlePill}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </section>

      <section
        id="contato"
        className={`scroll-mt-28 border-t ${classes.border} ${classes.bgSection}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
                Contato
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Vamos conversar?
              </h2>

              <p className={`mt-3 text-sm leading-7 ${classes.textSoft}`}>
                Estou aberto a oportunidades, projetos e conexões na área de
                tecnologia.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon, external }) => (
                <ExternalButton
                  key={label}
                  href={href}
                  external={external}
                  classes={classes}
                >
                  <Icon size={16} />
                  {label === "Email" ? "Enviar email" : label}
                </ExternalButton>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className={`border-t ${classes.border}`}>
        <div
          className={`mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between ${classes.textMuted}`}
        >
          <p>© 2026 Leonardo Gomes. Todos os direitos reservados.</p>
          <p>React, TypeScript, Tailwind CSS e Motion.</p>
        </div>
      </footer>
    </main>
  )
}

export default App