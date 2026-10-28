// Framer 上で直接組んだ部分（ナビ・ステートメント・ニュース欄・フッター）の再現。
// 数値・色・アニメーション設定は Framer の各レイヤーの値をそのまま写している。
import type { ReactNode } from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import CursorRing from "./components/CursorRing"

const contactHref = (from?: string) => (from ? `/contact/?from=${from}` : "/contact/")

// Framer の appearEffect（onInView・spring）
export function Appear({ children, x = 0, y = 0, stiffness, damping, delay = 0, amount, className }: { children: ReactNode; x?: number; y?: number; stiffness: number; damping: number; delay?: number; amount: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount }}
            transition={{ type: "spring", stiffness, damping, mass: 1, delay }}>{children}</motion.div>)
}

// Framer の textEffect（単語・文字ごとに下から出る）
function TextEffect({ text, by, y, stiffness, damping, stagger, className, as = "p" }: { text: string; by: "word" | "char"; y: number; stiffness: number; damping: number; stagger: number; className?: string; as?: "p" | "h2" }) {
    const ref = useRef<HTMLElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.5 })
    let n = 0
    const Tag: any = as
    return (
        <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, " ")}>
            {text.split("\n").map((line, li) => (
                <span key={li} aria-hidden="true" style={{ display: "block" }}>
                    {(by === "word" ? line.split(" ") : Array.from(line)).map((tok, ti, arr) => {
                        const i = n++
                        return (
                            <span key={ti}>
                                <motion.span style={{ display: "inline-block" }} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
                                    transition={{ type: "spring", stiffness, damping, mass: 1, delay: i * stagger }}>{tok}</motion.span>
                                {by === "word" && ti < arr.length - 1 ? " " : null}
                            </span>)
                    })}
                </span>
            ))}
        </Tag>)
}

export function Nav({ from }: { from?: string }) {
    return (
        <nav className="nav">
            <a className="nav-logo" href="/"><img src="/logo-dark.png" alt="BLAZE" width={117} height={26} /></a>
            <div className="nav-links">
                <a className="nav-link" href="/#vision">Vision</a>
                <a className="nav-link" href="/service/">Service</a>
                <a className="nav-link" href="/column/">Column</a>
                <a className="nav-link" href="/company/">Company</a>
                <motion.a className="nav-btn" href={contactHref(from)} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
                    <span className="nav-btn-t">お問い合わせ</span><span className="nav-btn-a">→</span>
                </motion.a>
            </div>
        </nav>)
}

export function Footer({ from }: { from?: string }) {
    return (
        <footer className="ft">
            <div className="ft-top">
                <div className="ft-cta">
                    <p className="ft-k">CONTACT</p>
                    <TextEffect className="ft-h" as="h2" text={"Let’s ignite\nyour next action."} by="word" y={40} stiffness={140} damping={28} stagger={0.08} />
                </div>
                <motion.a className="ft-btn" href={contactHref(from)} whileHover={{ scale: 1.08, backgroundColor: "#4A6FC2" }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>お問い合わせ →</motion.a>
            </div>
            <div className="ft-links">
                <div className="ft-row">
                    <a href="/company/">About</a><a href="/service/">Service</a><a href="/column/">Column</a><a href="/news/">News</a><a href="/privacy/">Privacy</a>
                </div>
                <p className="ft-addr">〒160-0022 東京都新宿区新宿3-5-6 キュープラザ新宿三丁目4F</p>
            </div>
            <div className="ft-mark-wrap">
                <TextEffect className="ft-mark" text="BLAZE" by="char" y={120} stiffness={110} damping={22} stagger={0.07} />
            </div>
            <p className="ft-copy">© 2026 BLAZE Inc. All rights reserved.</p>
        </footer>)
}

type Row = { a: string; tag: string; title: string; href: string }
function NewsBlock({ title, more, rows }: { title: string; more: string; rows: Row[] }) {
    return (
        <div className="nb">
            <div className="nb-head"><h2 className="nb-t">{title}</h2><a className="nb-more" href={more}>一覧 →</a></div>
            {rows.map((r, i) => (
                <a key={i} className="nb-row" href={r.href} {...(/^https?:/.test(r.href) ? { target: "_blank", rel: "noopener" } : {})}>
                    <span className="nb-a">{r.a}</span><span className="nb-tag">{r.tag}</span><span className="nb-title">{r.title}</span>
                </a>))}
        </div>)
}

export function HomeNews() {
    return (
        <section className="news">
            <Appear className="news-in" y={36} stiffness={180} damping={40} amount={0.15}>
                <NewsBlock title="ニュース" more="/news/" rows={[
                    { a: "2026.08.06", tag: "Notice", title: "「Oubo Pay」取引社数50社突破、アライアンスパートナー募集を開始", href: "https://prtimes.jp/main/html/rd/p/000000006.000181457.html" },
                    { a: "2026.07.31", tag: "Media", title: "経営メディア「ビジョン図鑑」に代表 中塚のインタビューが掲載", href: "https://vision-zukan.com/posts/blaze-ltd/" },
                    { a: "2026.07.08", tag: "Release", title: "AIキャリアアシスタント「Cocopath」をリリース", href: "https://prtimes.jp/main/html/rd/p/000000005.000181457.html" },
                ]} />
                <NewsBlock title="コラム新着" more="/column/" rows={[
                    { a: "AI", tag: "業務自動化", title: "経理業務におけるAI活用の現実的な範囲", href: "/column/keiri-ai-katsuyou/" },
                    { a: "採用", tag: "採用・組織", title: "採用の最終決定権は誰が持つべきか", href: "/column/saiyo-kettei-kengen/" },
                    { a: "転職", tag: "キャリア", title: "転職市場の動向を、個人がどう読むか", href: "/column/tenshoku-shijou-doukou/" },
                ]} />
            </Appear>
        </section>)
}

export function Page({ from, children }: { from?: string; children: ReactNode }) {
    return (
        <div className="page">
            <Nav from={from} />
            {children}
            <CursorRing color="#1B3B8F" style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }} />
            <Footer from={from} />
        </div>)
}
