import { useEffect, useState, useRef } from "react"
import type { CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Item = { word: string; label: string; desc: string; href: string; color: string; stat?: string; statLabel?: string; points?: string }
interface Props { data: string; kicker: string; heading: string; interval: number; style?: CSSProperties }

const INK = "#0B1020", SUB = "#5B6272", LINE = "rgba(11,16,32,0.12)"
const oct = (r: number) => Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}` }).join(" ")

const useW = (ref: any) => {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return w
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function BusinessTabs(props: Props) {
    const { kicker = "Our Business", heading = "Four ways\nto move forward.", interval = 6, style } = props
    let items: Item[] = []
    try { items = JSON.parse(props.data || "[]") } catch { items = [] }
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const rootRef = useRef<HTMLDivElement>(null)
    const w = useW(rootRef), m = w < 760
    const [i, setI] = useState(0)
    const [paused, setPaused] = useState(false)
    const [tick, setTick] = useState(0)
    useEffect(() => {
        if (isCanvas || paused || items.length < 2) return
        const t = setTimeout(() => { setI((v) => (v + 1) % items.length); setTick((v) => v + 1) }, interval * 1000)
        return () => clearTimeout(t)
    }, [i, paused, tick, items.length, interval, isCanvas])
    const go = (k: number) => { setI(k); setTick((v) => v + 1) }
    const it = items[i] || ({ word: "", label: "", desc: "", href: "#", color: "#1B3B8F" } as Item)
    const ease = [0.22, 1, 0.36, 1] as any
    const points = String(it.points || "").split("|").filter(Boolean)

    return (
        <div ref={rootRef} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
            style={{ ...style, background: "#fff", color: INK, fontFamily: "'Noto Sans JP', sans-serif" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, marginBottom: 48 }}>
                <div>
                    <div style={{ fontFamily: "Jost, sans-serif", fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase", color: "#1B3B8F", marginBottom: 18 }}>{kicker}</div>
                    <div style={{ fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: "clamp(44px, 5.4vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.04em", whiteSpace: "pre-line" }}>{heading}</div>
                </div>
            </div>

            <div role="tablist" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, items.length)}, 1fr)`, borderTop: `1px solid ${LINE}` }}>
                {items.map((t, k) => (
                    <button key={k} role="tab" aria-selected={k === i} onClick={() => go(k)}
                        style={{ position: "relative", textAlign: "left", background: "none", border: 0, padding: m ? "16px 2px 16px 0" : "22px 4px 22px 0", cursor: "pointer", font: "inherit", color: k === i ? INK : SUB }}>
                        <span style={{ fontFamily: "Jost, sans-serif", fontSize: 12, letterSpacing: "0.12em", color: k === i ? t.color : SUB, marginRight: 14, display: m ? "block" : undefined, marginBottom: m ? 6 : undefined }}>{String(k + 1).padStart(2, "0")}</span>
                        <span style={{ fontFamily: "Jost, sans-serif", fontWeight: 600, fontSize: m ? 16 : 20, letterSpacing: "-0.01em" }}>{t.word}</span>
                        <span style={{ position: "absolute", left: 0, right: 0, top: -1, height: 2, background: "transparent" }}>
                            {k === i && (
                                <motion.span key={"bar" + tick} initial={{ width: isCanvas || paused ? "100%" : "0%" }} animate={{ width: "100%" }}
                                    transition={{ duration: isCanvas || paused ? 0 : interval, ease: "linear" }}
                                    style={{ display: "block", height: 2, background: t.color }} />
                            )}
                        </span>
                    </button>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 36 : "6vw", alignItems: "center", paddingTop: m ? 40 : 64, minHeight: m ? 0 : "min(64vh, 600px)" }}>
                <AnimatePresence mode="wait">
                    <motion.div key={"t" + i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease }} style={{ minHeight: m ? 470 : undefined }}>
                        <div style={{ fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: m ? Math.round(w * 0.17) : "clamp(64px, 8vw, 140px)", lineHeight: 0.95, letterSpacing: "-0.045em", paddingBottom: "0.1em" }}>{it.word}</div>
                        <div style={{ fontSize: m ? 17 : 20, fontWeight: 700, marginTop: m ? 14 : 22 }}>{it.label}</div>
                        <p style={{ fontSize: 15, lineHeight: 1.95, color: SUB, margin: "14px 0 30px", maxWidth: 520 }}>{it.desc}</p>
                        {points.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: `repeat(${points.length}, 1fr)`, gap: 16, marginBottom: 40, maxWidth: 560 }}>
                                {points.map((pt, k) => (
                                    <div key={k} style={{ borderTop: `1px solid ${INK}`, paddingTop: 12, fontSize: 13, lineHeight: 1.6 }}>
                                        <div style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: it.color, letterSpacing: "0.12em", marginBottom: 6 }}>{String(k + 1).padStart(2, "0")}</div>{pt}
                                    </div>
                                ))}
                            </div>
                        )}
                        <motion.a href={it.href} whileHover={{ x: 4 }} style={{ display: "inline-flex", alignItems: "center", gap: 18, background: INK, color: "#fff", textDecoration: "none", padding: "18px 28px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em" }}>
                            詳しく見る <span style={{ fontFamily: "Jost, sans-serif" }}>→</span>
                        </motion.a>
                    </motion.div>
                </AnimatePresence>

                <div style={{ display: "grid", placeItems: "center", order: m ? -1 : 0 }}>
                    <div style={{ position: "relative", width: m ? Math.round(w * 0.42) : "min(46vh, 30vw)", aspectRatio: "1 / 1" }}>
                        <motion.svg viewBox="-100 -100 200 200" animate={{ rotate: i * 45 }} transition={{ duration: 1, ease }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                            <motion.polygon points={oct(100)} animate={{ fill: it.color }} transition={{ duration: 0.7, ease }} />
                            <polygon points={oct(84)} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
                        </motion.svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
BusinessTabs.defaultProps = { data: "[]", kicker: "Our Business", heading: "Four ways\nto move forward.", interval: 6 }
addPropertyControls(BusinessTabs, {
    kicker: { type: ControlType.String, title: "Kicker" },
    heading: { type: ControlType.String, title: "Heading", displayTextArea: true },
    data: { type: ControlType.String, title: "Items JSON", displayTextArea: true },
    interval: { type: ControlType.Number, title: "Seconds", min: 2, max: 20, step: 0.5, defaultValue: 6 },
})
