import { useRef, useState, useEffect } from "react"
import type { CSSProperties } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Row = { no: string; title: string; sub: string; href: string; image: string }
interface Props { kicker: string; heading: string; data: string; accent: string; style?: CSSProperties }

const useW = (ref: any) => {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return w
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function HoverIndex(props: Props) {
    const { kicker = "Index", heading = "Explore\nBLAZE.", accent = "#1B3B8F", style } = props
    let rows: Row[] = []
    try { rows = JSON.parse(props.data || "[]") } catch { rows = [] }
    const ref = useRef<HTMLDivElement>(null)
    const w = useW(ref), m = w < 760
    const [hover, setHover] = useState(-1)
    const mx = useMotionValue(0), my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 220, damping: 26 }), sy = useSpring(my, { stiffness: 220, damping: 26 })
    const onMove = (e: React.PointerEvent) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; mx.set(e.clientX - r.left); my.set(e.clientY - r.top) }
    const ease = [0.22, 1, 0.36, 1] as any
    return (
        <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setHover(-1)} style={{ ...style, position: "relative", display: "grid", gridTemplateColumns: m ? "1fr" : "minmax(260px, 0.8fr) 2fr", gap: m ? 32 : 56, fontFamily: "'Noto Sans JP', sans-serif", color: "#0B1020" }}>
            <div style={{ position: "relative" }}>
                <div style={{ position: m ? "static" : "sticky", top: 120 }}>
                    <div style={{ fontFamily: "Jost, sans-serif", fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase", color: accent, marginBottom: 20 }}>{kicker}</div>
                    <div style={{ fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: "clamp(56px, 7vw, 112px)", lineHeight: 0.95, letterSpacing: "-0.045em", whiteSpace: "pre-line" }}>{heading}</div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #0B1020" }}>
                {rows.map((r, i) => (
                    <a key={i} href={r.href} onPointerEnter={() => setHover(i)} style={{ position: "relative", display: "grid", gridTemplateColumns: m ? "36px 1fr auto" : "64px 1fr auto", alignItems: "center", gap: m ? 12 : 24, padding: m ? "22px 4px" : "34px 8px", borderBottom: "1px solid rgba(11,16,32,0.18)", textDecoration: "none", color: "inherit", overflow: "hidden" }}>
                        <motion.span initial={false} animate={{ scaleY: hover === i ? 1 : 0 }} transition={{ duration: 0.55, ease }} style={{ position: "absolute", inset: 0, background: accent, transformOrigin: "bottom", zIndex: 0 }} />
                        <motion.span animate={{ color: hover === i ? "#fff" : accent }} style={{ position: "relative", zIndex: 1, fontFamily: "Jost, sans-serif", fontSize: 14, letterSpacing: "0.1em" }}>{r.no}</motion.span>
                        <motion.span animate={{ x: hover === i ? 16 : 0, color: hover === i ? "#fff" : "#0B1020" }} transition={{ duration: 0.5, ease }} style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "Jost, 'Noto Sans JP', sans-serif", fontWeight: 600, fontSize: m ? 26 : "clamp(30px, 3.4vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{r.title}</span>
                            <span style={{ fontSize: 14, opacity: 0.7 }}>{r.sub}</span>
                        </motion.span>
                        <motion.span animate={{ rotate: hover === i ? -45 : 0, color: hover === i ? "#fff" : "#0B1020" }} transition={{ duration: 0.5, ease }} style={{ position: "relative", zIndex: 1, fontFamily: "Jost, sans-serif", fontSize: 30, fontWeight: 300 }}>→</motion.span>
                    </a>
                ))}
            </div>
                    </div>
    )
}
HoverIndex.defaultProps = { kicker: "Index", heading: "Explore\nBLAZE.", data: "[]", accent: "#1B3B8F" }
addPropertyControls(HoverIndex, {
    kicker: { type: ControlType.String, title: "Kicker" },
    heading: { type: ControlType.String, title: "Heading", displayTextArea: true },
    data: { type: ControlType.String, title: "Rows JSON", displayTextArea: true },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#1B3B8F" },
})
