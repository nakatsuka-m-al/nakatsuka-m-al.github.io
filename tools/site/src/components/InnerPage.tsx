import type { CSSProperties, ReactNode } from "react"
import { createContext, useContext, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import ContactForm from "../ContactForm"

interface Props { data: string; style?: CSSProperties }
const GUNJO_ = "#4A6FC2"
const INK = "#0B1020", SUB = "#5B6272", LINE = "rgba(11,16,32,0.12)", NAVY = "#1B3B8F"
const ease = [0.22, 1, 0.36, 1] as any
const J = "Jost, 'Noto Sans JP', sans-serif", N = "'Noto Sans JP', sans-serif"
const oct = (r: number) => Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}` }).join(" ")
const Oct = ({ size = 14, color = NAVY }: { size?: number; color?: string }) => <svg viewBox="0 0 100 100" style={{ width: size, height: size, flex: "none" }}><polygon points={oct(50)} fill={color} /></svg>
const Reveal = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: d, ease }}>{children}</motion.div>)
const Kicker = ({ t, color = NAVY }: { t: string; color?: string }) => <div style={{ fontFamily: "Jost, sans-serif", fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", color, marginBottom: 16 }}>{t}</div>
const H2 = ({ t }: { t: string }) => <div style={{ fontFamily: J, fontWeight: 700, fontSize: "clamp(32px, 3.6vw, 56px)", letterSpacing: "-0.03em", lineHeight: 1.15, whiteSpace: "pre-line" }}>{t}</div>
const Btn = ({ label, href, dark = true }: { label: string; href: string; dark?: boolean }) => (
    <motion.a href={href} whileHover={{ x: 4 }} style={{ display: "inline-flex", alignItems: "center", gap: 16, background: dark ? INK : "transparent", color: dark ? "#fff" : INK, border: dark ? "none" : `1px solid ${INK}`, textDecoration: "none", padding: "16px 26px", fontFamily: N, fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>{label} <span style={{ fontFamily: "Jost" }}>→</span></motion.a>)

export const WCtx = createContext(1200)
function Block({ b }: { b: any }) {
    const W = useContext(WCtx), m = W < 760
    const g2 = m ? "1fr" : "minmax(260px, 0.8fr) 2fr"
    switch (b.type) {
        case "hero": return (
            <div style={{ padding: m ? "56px 0 48px" : "120px 0 96px", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: m ? 16 : 40 }}>
                <div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}><Kicker t={b.kicker} /></motion.div>
                    <div style={{ overflow: "hidden" }}>
                        <motion.h1 initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.1, ease }}
                            style={{ margin: 0, fontFamily: "Jost, sans-serif", fontWeight: 800, fontSize: m ? Math.round(W * 0.15) : "clamp(64px, 9vw, 150px)", lineHeight: 1.05, letterSpacing: "-0.05em", paddingBottom: "0.2em", marginBottom: "-0.12em" }}>{b.title}</motion.h1>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease }}
                        style={{ fontFamily: N, fontSize: m ? 17 : 20, fontWeight: 700, marginTop: m ? 12 : 18 }}>{b.sub}</motion.div>
                    {b.lead && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ fontFamily: N, fontSize: 15, lineHeight: 2, color: SUB, maxWidth: 640, margin: "20px 0 0" }}>{b.lead}</motion.p>}
                </div>
                <motion.div initial={{ opacity: 0, rotate: -45, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 1.4, delay: 0.3, ease }} style={{ width: m ? 64 : "clamp(80px, 11vw, 160px)", aspectRatio: "1 / 1", flex: "none", clipPath: "polygon(50.00% 0.00%, 85.36% 14.64%, 100.00% 50.00%, 85.36% 85.36%, 50.00% 100.00%, 14.64% 85.36%, 0.00% 50.00%, 14.64% 14.64%)", background: b.color || NAVY }}>
                    <video src="https://assets.mixkit.co/videos/21584/21584-720.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </motion.div>
            </div>)
        case "services": return (
            <div>{b.items.map((s: any, k: number) => (
                <div key={k} id={s.id} style={{ scrollMarginTop: 80, display: "grid", gridTemplateColumns: g2, gap: m ? 28 : "5vw", padding: m ? "56px 0" : "96px 0", borderBottom: `1px solid ${LINE}` }}>
                    <div><div style={{ position: m ? "static" : "sticky", top: 120 }}>
                        <Reveal>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><Oct size={18} color={s.color} /><span style={{ fontFamily: "Jost", fontSize: 13, letterSpacing: "0.14em", color: s.color }}>{s.no} — {s.cat}</span></div>
                            <h2 style={{ margin: 0, fontFamily: J, fontWeight: 700, fontSize: "clamp(34px, 3.4vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>{s.name}</h2>
                            {s.tag && <div style={{ display: "inline-block", marginTop: 16, fontFamily: "Jost", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: s.color, borderBottom: `1px solid ${s.color}`, paddingBottom: 4 }}>{s.tag}</div>}
                        </Reveal>
                    </div></div>
                    <div>
                        <Reveal d={0.1}><p style={{ fontFamily: N, fontSize: 17, lineHeight: 2, margin: 0 }}>{s.desc}</p></Reveal>
                        {s.links?.length > 0 && <Reveal d={0.15}><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>{s.links.map((l: any, j: number) => <Btn key={j} label={l.label} href={l.href} dark={j === 0} />)}</div></Reveal>}
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 28 : "36px 40px", marginTop: m ? 36 : 56 }}>
                            {s.features.map((f: any, j: number) => (
                                <Reveal key={j} d={0.05 * j}><div style={{ borderTop: `1px solid ${INK}`, paddingTop: 18 }}>
                                    <div style={{ fontFamily: "Jost", fontSize: 11, letterSpacing: "0.14em", color: s.color, marginBottom: 10 }}>{String(j + 1).padStart(2, "0")}</div>
                                    <h3 style={{ margin: "0 0 10px", fontFamily: N, fontSize: 17, fontWeight: 700 }}>{f.t}</h3>
                                    <div style={{ fontFamily: N, fontSize: 14, lineHeight: 1.9, color: SUB }}>{f.d}</div>
                                </div></Reveal>))}
                        </div>
                        {s.notes?.length > 0 && <Reveal><div style={{ marginTop: m ? 32 : 48, background: "#F5F6F8", padding: m ? "18px 18px" : "28px 32px" }}>{s.notes.map((n: string, j: number) => (
                            <div key={j} style={{ display: "flex", gap: 14, alignItems: "baseline", fontFamily: N, fontSize: 14, lineHeight: 1.9, padding: "6px 0" }}><Oct size={9} color={s.color} /><span>{n}</span></div>))}</div></Reveal>}
                    </div>
                </div>))}</div>)
        case "mvv": return (
            <div style={{ padding: "96px 0", borderBottom: `1px solid ${LINE}` }}>
                <Reveal><Kicker t={b.kicker} /><H2 t={b.title} /></Reveal>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 40 : 32, marginTop: m ? 36 : 56 }}>
                    {b.items.map((m: any, k: number) => (
                        <Reveal key={k} d={0.08 * k}><div style={{ borderTop: `2px solid ${INK}`, paddingTop: 22 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Jost", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY }}><Oct size={10} />{m.label}</div>
                            <div style={{ fontFamily: N, fontWeight: 800, fontSize: 24, lineHeight: 1.5, margin: "18px 0 14px", whiteSpace: "pre-line" }}>{m.title}</div>
                            <div style={{ fontFamily: N, fontSize: 14, lineHeight: 2, color: SUB }}>{m.body}</div>
                        </div></Reveal>))}
                </div>
            </div>)
        case "message": return (
            <div style={{ display: "grid", gridTemplateColumns: g2, gap: m ? 28 : "5vw", padding: m ? "56px 0" : "96px 0", borderBottom: `1px solid ${LINE}` }}>
                <Reveal><Kicker t={b.kicker} /><H2 t={b.title} /></Reveal>
                <div>
                    <Reveal><div style={{ fontFamily: N, fontWeight: 800, fontSize: "clamp(24px, 2.4vw, 34px)", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 32 }}>{b.lead}</div></Reveal>
                    {b.paragraphs.map((p: string, k: number) => <Reveal key={k}><p style={{ fontFamily: N, fontSize: 16, lineHeight: 2.1, margin: "0 0 22px" }}>{p}</p></Reveal>)}
                    <Reveal><div style={{ marginTop: 32, fontFamily: N, fontSize: 15, fontWeight: 700, textAlign: "right" }}>{b.sign}</div></Reveal>
                </div>
            </div>)
        case "table": return (
            <div style={{ display: "grid", gridTemplateColumns: g2, gap: m ? 28 : "5vw", padding: m ? "56px 0" : "96px 0", borderBottom: `1px solid ${LINE}` }}>
                <Reveal><Kicker t={b.kicker} /><H2 t={b.title} /></Reveal>
                <Reveal d={0.1}><div style={{ borderTop: `1px solid ${INK}` }}>{b.rows.map((r: string[], k: number) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: m ? "88px 1fr" : "180px 1fr", gap: m ? 12 : 24, padding: m ? "16px 0" : "22px 0", borderBottom: `1px solid ${LINE}`, fontFamily: N, fontSize: 15, lineHeight: 1.9 }}>
                        <div style={{ color: SUB, fontWeight: 700 }}>{r[0]}</div><div style={{ whiteSpace: "pre-line" }}>{r[1]}</div></div>))}</div></Reveal>
            </div>)
        case "news": return (
            <div style={{ padding: "72px 0 96px" }}>
                <div style={{ borderTop: `1px solid ${INK}` }}>{b.items.map((n: any, k: number) => {
                    const Row: any = n.href ? motion.a : motion.div
                    return (<Reveal key={k} d={Math.min(k, 6) * 0.04}><Row href={n.href} target={n.href && /^https?:/.test(n.href) ? "_blank" : undefined} rel={n.href && /^https?:/.test(n.href) ? "noopener" : undefined} whileHover={n.href ? { x: 8 } : undefined}
                        style={{ display: "grid", gridTemplateColumns: m ? "auto 1fr" : "130px 110px 1fr 30px", alignItems: "center", gap: m ? "6px 16px" : 20, padding: m ? "20px 0" : "28px 0", borderBottom: `1px solid ${LINE}`, textDecoration: "none", color: INK, fontFamily: N }}>
                        <span style={{ fontFamily: "Jost", fontSize: 14, color: SUB, letterSpacing: "0.06em" }}>{n.date}</span>
                        <span style={{ fontFamily: "Jost", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: n.tag === "Release" ? NAVY : SUB }}>{n.tag}</span>
                        <span style={{ fontSize: m ? 15 : 16, fontWeight: 500, lineHeight: 1.7, gridColumn: m ? "1 / -1" : undefined }}>{n.title}</span>
                        <span style={{ fontFamily: "Jost", fontSize: 20, opacity: n.href ? 1 : 0, display: m ? "none" : undefined }}>→</span>
                    </Row></Reveal>)})}</div>
            </div>)
        case "form": return (
            <div style={{ display: "grid", gridTemplateColumns: g2, gap: m ? 28 : "5vw", padding: m ? "56px 0" : "96px 0" }}>
                <Reveal><Kicker t={b.kicker} /><H2 t={b.title} /><p style={{ fontFamily: N, fontSize: 14, lineHeight: 2, color: SUB, marginTop: 20 }}>{b.note}</p></Reveal>
                <Reveal d={0.1}><ContactForm options={b.options} m={m} /></Reveal>
            </div>)
        case "prose": return (
            <div style={{ display: "grid", gridTemplateColumns: g2, gap: m ? 0 : "5vw", padding: m ? "40px 0 64px" : "72px 0 96px" }}>
                <div style={{ display: m ? "none" : undefined }}><div style={{ position: "sticky", top: 120, fontFamily: N, fontSize: 13, lineHeight: 2.2, color: SUB }}>
                    {b.sections.map((s: any, k: number) => <div key={k}>{s.h}</div>)}</div></div>
                <div>
                    {b.intro && <p style={{ fontFamily: N, fontSize: 15, lineHeight: 2.1, margin: "0 0 48px" }}>{b.intro}</p>}
                    {b.sections.map((s: any, k: number) => (<Reveal key={k}><div style={{ padding: "32px 0", borderTop: `1px solid ${LINE}` }}>
                        {s.h && <h2 style={{ margin: "0 0 16px", fontFamily: N, fontSize: 19, fontWeight: 800 }}>{s.h}</h2>}
                        {(s.p || []).map((p: string, j: number) => <p key={j} style={{ fontFamily: N, fontSize: 15, lineHeight: 2.1, margin: "0 0 12px", whiteSpace: "pre-line" }}>{p}</p>)}
                        {(s.list || []).length > 0 && <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>{s.list.map((li: string, j: number) => (
                            <li key={j} style={{ display: "flex", gap: 12, alignItems: "baseline", fontFamily: N, fontSize: 14, lineHeight: 2 }}><Oct size={8} />{li}</li>))}</ul>}
                    </div></Reveal>))}
                    {b.footer && <p style={{ fontFamily: N, fontSize: 13, color: SUB, marginTop: 32 }}>{b.footer}</p>}
                </div>
            </div>)
        case "jump": return (
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", borderBottom: `1px solid ${LINE}` }}>
                {b.items.map((it: any, k: number) => (
                    <motion.a key={k} href={it.href} whileHover={{ backgroundColor: "rgba(27,59,143,0.04)" }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, padding: m ? "28px 4px" : "40px 32px", textDecoration: "none", color: INK, borderLeft: k && !m ? `1px solid ${LINE}` : "none", borderTop: k && m ? `1px solid ${LINE}` : "none" }}>
                        <div>
                            <Kicker t={it.kicker} />
                            <div style={{ fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: "clamp(24px, 2.4vw, 36px)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>{it.title} <span style={{ color: GUNJO_ }}>{it.accent}</span></div>
                            <div style={{ fontFamily: N, fontSize: 14, color: SUB, marginTop: 12 }}>{it.label}</div>
                        </div>
                        <span style={{ fontFamily: "Jost", fontSize: 22 }}>↓</span>
                    </motion.a>))}
            </div>)
        case "group": return (
            <div id={b.id} style={{ padding: m ? "72px 0 8px" : "120px 0 24px", scrollMarginTop: 80 }}>
                <Reveal>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}><span style={{ width: 56, height: 1, background: NAVY }} /><Kicker t={b.kicker} /></div>
                    <div style={{ fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: "clamp(44px, 5.6vw, 88px)", letterSpacing: "-0.04em", lineHeight: 1.05, paddingBottom: "0.12em" }}>{b.title}<br /><span style={{ color: GUNJO_ }}>{b.accent}</span></div>
                    <div style={{ fontFamily: N, fontSize: 16, color: SUB, lineHeight: 2, marginTop: 16 }}>{b.desc}</div>
                </Reveal>
            </div>)
        case "cta": return (
            <Reveal><div style={{ margin: m ? "32px 0 72px" : "48px 0 120px", background: INK, color: "#fff", padding: m ? "40px 24px" : "72px 64px", display: "flex", flexDirection: m ? "column" : "row", justifyContent: "space-between", alignItems: m ? "flex-start" : "center", gap: m ? 28 : 40 }}>
                <div><Kicker t="Contact" color="#8EA4E0" /><div style={{ fontFamily: N, fontWeight: 800, fontSize: "clamp(26px, 2.6vw, 40px)" }}>{b.title}</div><div style={{ fontFamily: N, fontSize: 15, opacity: 0.75, marginTop: 14 }}>{b.sub}</div></div>
                <motion.a href={b.href} whileHover={{ x: 4 }} style={{ flex: "none", display: "inline-flex", gap: 16, background: "#fff", color: INK, textDecoration: "none", padding: "18px 32px", fontFamily: N, fontSize: 15, fontWeight: 700 }}>お問い合わせ <span style={{ fontFamily: "Jost" }}>→</span></motion.a>
            </div></Reveal>)
        default: return null
    }
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function InnerPage(props: Props) {
    let blocks: any[] = []
    try { blocks = JSON.parse(props.data || "[]") } catch { blocks = [] }
    const ref = useRef<HTMLDivElement>(null)
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return <WCtx.Provider value={w}><div ref={ref} style={{ ...props.style, color: INK, background: "#fff" }}>{blocks.map((b, k) => <Block key={k} b={b} />)}</div></WCtx.Provider>
}
InnerPage.defaultProps = { data: "[]" }
addPropertyControls(InnerPage, { data: { type: ControlType.String, title: "Page JSON", displayTextArea: true } })
