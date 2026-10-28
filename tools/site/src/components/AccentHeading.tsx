import { useRef, useState, useEffect } from "react"
import type { CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props { text: string; accent: string; color: string; size: number; align: "left" | "center"; style?: CSSProperties }

function Char({ ch, i, n, p, color }: any) {
    const start = (i / n) * 0.7, end = start + 0.3
    const o = useTransform(p, [start, end], [0.12, 1])
    return <motion.span style={{ opacity: o, color }}>{ch}</motion.span>
}

const useW = (ref: any) => {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return w
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function AccentHeading(props: Props) {
    const { text = "**採用**と**キャリア**を起点に", accent = "#1F5FE0", color = "#0B1020", size = 56, align = "left", style } = props
    const ref = useRef<HTMLDivElement>(null)
    const w = useW(ref), m = w < 760
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] })
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const parts: { ch: string; hl: boolean }[] = []
    String(text).split(/(\*\*[^*]+\*\*)/).forEach((seg) => {
        const hl = seg.startsWith("**") && seg.endsWith("**")
        const body = hl ? seg.slice(2, -2) : seg
        for (const ch of body) parts.push({ ch, hl })
    })
    const n = parts.length || 1
    return (
        <div ref={ref} style={{ ...style, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 800, fontSize: m ? Math.min(size, Math.round(w * 0.078)) : size, lineHeight: 1.35, letterSpacing: "-0.01em", textAlign: align, whiteSpace: "pre-wrap" }}>
            {parts.map((p, i) => p.ch === "\n" ? <br key={i} /> : isCanvas
                ? <span key={i} style={{ color: p.hl ? accent : color }}>{p.ch}</span>
                : <Char key={i} ch={p.ch} i={i} n={n} p={scrollYProgress} color={p.hl ? accent : color} />)}
        </div>
    )
}
AccentHeading.defaultProps = { text: "**採用**と**キャリア**を起点に", accent: "#1F5FE0", color: "#0B1020", size: 56, align: "left" }
addPropertyControls(AccentHeading, {
    text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: "**採用**と**キャリア**を起点に" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#1F5FE0" },
    color: { type: ControlType.Color, title: "Color", defaultValue: "#0B1020" },
    size: { type: ControlType.Number, title: "Size", min: 16, max: 160, defaultValue: 56 },
    align: { type: ControlType.Enum, title: "Align", options: ["left", "center"], defaultValue: "left" },
})
