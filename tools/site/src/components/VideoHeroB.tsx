import { useRef, useState, useEffect } from "react"
import type { CSSProperties } from "react"
import { motion, useInView } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props { videoUrl: string; text: string; sub: string; accent: string; style?: CSSProperties }

const OCT = Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `${(100 * Math.cos(a)).toFixed(2)},${(100 * Math.sin(a)).toFixed(2)}` }).join(" ")

const useW = (ref: any) => {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return w
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function VideoHeroB(props: Props) {
    const { videoUrl, text = "Ignite\nAction.", sub = "", accent = "#1B3B8F", style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const rootRef = useRef<HTMLDivElement>(null)
    const w = useW(rootRef), m = w < 760
    const inView = useInView(rootRef, { once: true, amount: 0.2 })
    const shown = isCanvas || inView
    const ease = [0.22, 1, 0.36, 1] as any
    const lines = (m ? String(text).replace(/ /g, "\n") : String(text)).split("\n")
    return (
        <div ref={rootRef} style={{ ...style, position: "relative", overflow: "hidden", background: "#fff" }}>
            <video src={videoUrl} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "#fff", mixBlendMode: "screen", ...(m ? { display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 24, padding: "92px 20px 64px", boxSizing: "border-box" } : { display: "flex", alignItems: "center", gap: "5vw", padding: "4vh 4vw 12vh 3.5vw", boxSizing: "border-box" }) }}>
                <div style={{ flex: "0 0 auto" }}>
                    {lines.map((l, i) => (
                        <div key={i} style={{ lineHeight: 0.92, paddingBottom: i === lines.length - 1 ? "0.18em" : "0.04em" }}>
                            <motion.div initial={false} animate={shown ? { y: "0em", opacity: 1 } : { y: "0.5em", opacity: 0 }} transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease }}
                                style={{ fontFamily: "Jost, sans-serif", fontWeight: 800, fontSize: m ? Math.round(w * 0.29) : "clamp(72px, min(21.5vw, 40vh), 640px)", letterSpacing: "-0.055em", color: "#000", whiteSpace: "nowrap" }}>{l.endsWith(".") ? <>{l.slice(0, -1)}<svg viewBox="-100 -100 200 200" style={{ display: "inline-block", width: "0.21em", height: "0.21em", marginLeft: "0.04em", verticalAlign: "baseline", overflow: "visible" }}><polygon points={OCT} fill="#000" /></svg></> : l}</motion.div>
                        </div>
                    ))}
                    <motion.div initial={false} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 1, delay: 0.9, ease }}
                        style={{ marginTop: m ? 16 : "4vh", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: m ? Math.round(w * 0.056) : "clamp(28px, 3.2vw, 52px)", letterSpacing: "0.04em", lineHeight: 1.3, color: "#000" }}>{sub}</motion.div>
                </div>

            </div>
            <motion.div initial={false} animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.9, delay: 1.1, ease }}
                style={{ position: "absolute", right: m ? 20 : "3.8vw", bottom: m ? 20 : "4.5vh", display: "flex", alignItems: "center", gap: 28, fontFamily: "Jost, sans-serif", fontSize: 12, letterSpacing: "0.3em" }}>
                <span style={{ color: "#5B6272", display: m ? "none" : undefined }}>SHINJUKU, TOKYO — 35.69°N 139.70°E</span>
                <span style={{ color: accent, display: "flex", alignItems: "center", gap: 12 }}>SCROLL
                    <motion.span animate={isCanvas ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: 18 }}>↓</motion.span></span>
            </motion.div>
        </div>
    )
}
VideoHeroB.defaultProps = { videoUrl: "", text: "Ignite\nAction.", sub: "意思ある行動に、火をつける。", accent: "#1B3B8F" }
addPropertyControls(VideoHeroB, {
    videoUrl: { type: ControlType.String, title: "Video" },
    text: { type: ControlType.String, title: "Text", displayTextArea: true },
    sub: { type: ControlType.String, title: "Sub" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#1B3B8F" },
})
