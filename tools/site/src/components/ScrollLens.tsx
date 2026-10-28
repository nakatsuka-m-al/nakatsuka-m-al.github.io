import { useRef, useState, useEffect } from "react"
import type { CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props {
    videoUrl: string; intro: string
    leftTag: string; leftTitle: string; leftText: string; leftHref: string
    rightTag: string; rightTitle: string; rightText: string; rightHref: string
    accent: string; style?: CSSProperties
}

const useW = (ref: any) => {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => { const el = ref.current; if (!el) return; setW(el.offsetWidth); const ro = new ResizeObserver((e) => setW(e[0].contentRect.width)); ro.observe(el); return () => ro.disconnect() }, [])
    return w
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function ScrollLens(props: Props) {
    const { videoUrl, intro, leftTag, leftTitle, leftText, leftHref, rightTag, rightTitle, rightText, rightHref, accent = "#1F5FE0", style } = props
    const ref = useRef<HTMLDivElement>(null)
    const w = useW(ref), m = w < 760
    const endR = useRef(15); endR.current = m ? 11 : 15
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })
    const oct = (r: number) => "polygon(" + Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `calc(50% + ${(r * Math.cos(a)).toFixed(3)}vmax) calc(50% + ${(r * Math.sin(a)).toFixed(3)}vmax)` }).join(", ") + ")"
    const radius = useTransform(p, (v: number) => 95 + (endR.current - 95) * Math.min(Math.max(v / 0.45, 0), 1))
    const clip = useTransform(radius, (r) => oct(r))
    const draw = useTransform(p, [0.42, 0.7], [0, 1])
    const vScale = useTransform(p, [0, 0.45, 1], [1.15, 1, 1.05])
    const introO = useTransform(p, [0, 0.12, 0.3], [1, 1, 0])
    const introY = useTransform(p, [0, 0.3], [0, -60])
    const sideO = useTransform(p, [0.4, 0.6], [0, 1])
    const leftX = useTransform(p, [0.4, 0.62], [-28, 0])
    const rightX = useTransform(p, [0.4, 0.62], [28, 0])
    const ringO = useTransform(p, [0.38, 0.5], [0, 1])
        const lineH = useTransform(p, [0.45, 0.95], ["0%", "100%"])

    const side = (tag: string, title: string, text: string, href: string, right: boolean, x: any) => (
        <motion.a href={href} style={{ position: "absolute", ...(m ? (right ? { bottom: "6%", left: 20, right: 20 } : { top: "10%", left: 20, right: 20 }) : { top: "50%", [right ? "right" : "left"]: "6%", width: "28%", translateY: "-50%" }), x, opacity: isCanvas ? 1 : sideO, textAlign: right ? "right" : "left", textDecoration: "none", color: "#0B1020" } as any}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14, flexDirection: right ? "row-reverse" : "row", fontFamily: "Jost, sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: accent, marginBottom: m ? 12 : 26 }}><span style={{ width: 40, height: 1, background: accent }} />{tag}</span>
            <div style={{ fontFamily: "Jost, 'Noto Sans JP', sans-serif", fontWeight: 600, fontSize: m ? 34 : "clamp(36px, 4.6vw, 72px)", lineHeight: 1.08, paddingBottom: "0.12em", letterSpacing: "-0.03em", whiteSpace: "pre-line" }}>
                {title.split("\n").map((l, i) => <div key={i} style={{ color: i === 1 ? accent : "#0B1020" }}>{l}</div>)}
            </div>
            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: m ? 13 : 14, lineHeight: 1.9, color: "#6B7282", margin: m ? "10px 0 16px" : "18px 0 30px", letterSpacing: "0.04em", whiteSpace: "pre-line" }}>{text}</p>
            <span style={{ fontFamily: "Jost, sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 12, paddingBottom: 8, borderBottom: "1px solid #0B1020" }}>View Details <span style={{ fontSize: 15 }}>→</span></span>
        </motion.a>
    )

    return (
        <div ref={ref} style={{ ...style, position: "relative", background: "#FFFFFF" }}>
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
                <motion.div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: lineH, background: "rgba(11,16,32,0.18)" }} />
                <motion.div style={{ position: "absolute", inset: 0, clipPath: isCanvas ? oct(m ? 11 : 15) : clip }}>
                    <motion.video src={videoUrl} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", scale: vScale }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(11,16,32,0.12)" }} />
                </motion.div>
                <motion.svg viewBox="-100 -100 200 200" style={{ position: "absolute", left: "50%", top: "50%", width: m ? "28vmax" : "38vmax", height: m ? "28vmax" : "38vmax", marginLeft: m ? "-14vmax" : "-19vmax", marginTop: m ? "-14vmax" : "-19vmax", overflow: "visible", opacity: isCanvas ? 1 : ringO }}>
                    <motion.polygon points={Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `${(92 * Math.cos(a)).toFixed(2)},${(92 * Math.sin(a)).toFixed(2)}` }).join(" ")}
                        fill="none" stroke="rgba(11,16,32,0.35)" strokeWidth={0.5} vectorEffect="non-scaling-stroke" style={{ pathLength: isCanvas ? 1 : draw }} />
                    <circle cx={0} cy={-92} r={1.6} fill={accent} />
                </motion.svg>
                {!isCanvas && <motion.div style={{ position: "absolute", left: "6%", bottom: "10%", opacity: introO, y: introY, color: "#fff", fontFamily: "Jost, sans-serif", fontWeight: 700, fontSize: "clamp(56px, 9vw, 150px)", lineHeight: 0.95, letterSpacing: "-0.04em", whiteSpace: "pre-line", textShadow: "0 10px 40px rgba(0,0,0,0.25)" }}>{intro}</motion.div>}
                {side(leftTag, leftTitle, leftText, leftHref, false, leftX)}
                {side(rightTag, rightTitle, rightText, rightHref, true, rightX)}
            </div>
        </div>
    )
}
ScrollLens.defaultProps = { videoUrl: "", intro: "Connect\nPeople.", leftTag: "For Companies", leftTitle: "Hire with\nPerformance", leftText: "", leftHref: "#", rightTag: "For People", rightTitle: "Career by\nDesign", rightText: "", rightHref: "#", accent: "#1F5FE0" }
addPropertyControls(ScrollLens, {
    videoUrl: { type: ControlType.String, title: "Video" },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true },
    leftTag: { type: ControlType.String, title: "L Tag" }, leftTitle: { type: ControlType.String, title: "L Title", displayTextArea: true },
    leftText: { type: ControlType.String, title: "L Text", displayTextArea: true }, leftHref: { type: ControlType.String, title: "L Link" },
    rightTag: { type: ControlType.String, title: "R Tag" }, rightTitle: { type: ControlType.String, title: "R Title", displayTextArea: true },
    rightText: { type: ControlType.String, title: "R Text", displayTextArea: true }, rightHref: { type: ControlType.String, title: "R Link" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#1F5FE0" },
})
