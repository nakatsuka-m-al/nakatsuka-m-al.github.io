import { useRef } from "react"
import type { CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props { color: string; lineColor: string; style?: CSSProperties }

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Connector(props: Props) {
    const { color = "#1B3B8F", lineColor = "rgba(11,16,32,0.18)", style } = props
    const ref = useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 95%", "end 55%"] })
    const h = useTransform(p, [0, 0.75], ["0%", "100%"])
    const s = useTransform(p, [0.7, 1], [0, 1])
    const pts = Array.from({ length: 8 }, (_, k) => { const a = (-90 + k * 45) * Math.PI / 180; return `${(50 + 50 * Math.cos(a)).toFixed(2)},${(50 + 50 * Math.sin(a)).toFixed(2)}` }).join(" ")
    return (
        <div ref={ref} style={{ ...style, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: 1, flex: 1, background: "transparent" }}>
                <motion.div style={{ position: "absolute", left: 0, top: 0, width: 1, height: isCanvas ? "100%" : h, background: lineColor }} />
            </div>
            <motion.svg viewBox="0 0 100 100" style={{ width: 18, height: 18, marginTop: 6, scale: isCanvas ? 1 : s }}>
                <polygon points={pts} fill={color} />
            </motion.svg>
        </div>
    )
}
Connector.defaultProps = { color: "#1B3B8F", lineColor: "rgba(11,16,32,0.18)" }
addPropertyControls(Connector, {
    color: { type: ControlType.Color, title: "Node", defaultValue: "#1B3B8F" },
    lineColor: { type: ControlType.Color, title: "Line", defaultValue: "rgba(11,16,32,0.18)" },
})
