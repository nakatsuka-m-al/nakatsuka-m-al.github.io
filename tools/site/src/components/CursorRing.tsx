import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Props { color: string; style?: CSSProperties }

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CursorRing(props: Props) {
    const { color = "#1F5FE0", style } = props
    const x = useMotionValue(-100), y = useMotionValue(-100)
    const sx = useSpring(x, { stiffness: 260, damping: 28 }), sy = useSpring(y, { stiffness: 260, damping: 28 })
    const [hover, setHover] = useState(false)
    const [on, setOn] = useState(false)
    useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (!window.matchMedia("(pointer: fine)").matches) return
        setOn(true)
        const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setHover(!!(e.target as Element)?.closest?.("a, button")) }
        window.addEventListener("pointermove", move)
        return () => window.removeEventListener("pointermove", move)
    }, [])
    if (!on) return <div style={{ ...style, width: 1, height: 1 }} />
    return (
        <div style={{ ...style, width: 1, height: 1, pointerEvents: "none" }}>
            <motion.div style={{ position: "fixed", left: 0, top: 0, x: sx, y: sy, zIndex: 9999, pointerEvents: "none" }}>
                <motion.div animate={{ width: hover ? 52 : 32, height: hover ? 52 : 32, backgroundColor: hover ? "rgba(31,95,224,0.12)" : "rgba(31,95,224,0)" }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    style={{ translateX: "-50%", translateY: "-50%", borderRadius: "50%", border: `1.5px solid ${color}`, mixBlendMode: "multiply" as any }} />
            </motion.div>
        </div>
    )
}
CursorRing.defaultProps = { color: "#1F5FE0" }
addPropertyControls(CursorRing, { color: { type: ControlType.Color, title: "Color", defaultValue: "#1F5FE0" } })
