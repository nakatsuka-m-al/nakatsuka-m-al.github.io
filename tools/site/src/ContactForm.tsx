import type { CSSProperties, ReactNode } from "react"
import { useState } from "react"

// 送信先は従来どおり Google Apps Script（Resend 経由でメール送信）。
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyEnHUOQwnJzWsEEwIhSg1JVwa4YCSlbn8Js24GdGFQ8CBj2uLtP5F96I_rUdk-0Qza/exec"
const INK = "#0B1020", SUB = "#5B6272", N = "'Noto Sans JP', sans-serif"
const MAILTO = <a href="mailto:info@blaze-ltd.com" style={{ color: "inherit" }}>info@blaze-ltd.com</a>

const inp: CSSProperties = { width: "100%", boxSizing: "border-box", border: 0, borderBottom: `1px solid ${INK}`, borderRadius: 0, padding: "12px 0", fontFamily: N, fontSize: 16, background: "transparent", outline: "none", color: INK }

const F = ({ id, label, req, children }: { id: string; label: string; req?: boolean; children: ReactNode }) => (
    <div style={{ display: "block", marginBottom: 28 }}>
        <label htmlFor={id} style={{ display: "block", fontFamily: N, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{label}{req && <span style={{ color: "#C8423B", marginLeft: 6 }}>*</span>}</label>{children}
    </div>)

export default function ContactForm({ options, m }: { options: string[]; m: boolean }) {
    const [err, setErr] = useState<ReactNode>(null)
    const [sending, setSending] = useState(false)
    const [done, setDone] = useState(false)

    async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        setErr(null)
        const form = ev.currentTarget
        const fd = new FormData(form)
        // 流入元（?from=oubopay 等）。指定がなければ corporate 扱い
        const from = new URLSearchParams(location.search).get("from") || "corporate"
        fd.append("source", from)
        const val = (k: string) => (fd.get(k) || "").toString().trim()
        if (!val("company") || !val("name") || !val("email") || !val("category") || !val("message")) { setErr("必須項目をすべてご入力ください。"); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("email"))) { setErr("メールアドレスの形式をご確認ください。"); return }
        if (!(form.querySelector("#f-agree") as HTMLInputElement).checked) { setErr("プライバシーポリシーへの同意にチェックをお願いします。"); return }
        setSending(true)
        try {
            const res = await fetch(ENDPOINT, { method: "POST", body: new URLSearchParams(fd as any) })
            const data = await res.json()
            if (!data.ok) throw new Error(data.error || "failed")
            setDone(true)
            const g = (window as any).gtag
            if (typeof g === "function") g("event", "contact_submit", { category: val("category"), source: from })
        } catch {
            setErr(<>送信に失敗しました。時間をおいて再度お試しいただくか、{MAILTO} まで直接ご連絡ください。</>)
            setSending(false)
        }
    }

    if (done) return (
        <div role="status" style={{ borderTop: `1px solid ${INK}`, paddingTop: 32 }}>
            <div style={{ fontFamily: N, fontSize: 24, fontWeight: 800, marginBottom: 16 }}>送信が完了しました</div>
            <p style={{ fontFamily: N, fontSize: 15, lineHeight: 2.1, color: SUB, margin: 0 }}>お問い合わせありがとうございます。<br />ご入力のメールアドレスへ確認メールをお送りしました。<br />担当者より2営業日以内にご連絡いたします。</p>
        </div>)

    return (
        <form id="cform" noValidate onSubmit={onSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: "0 32px" }}>
                <F id="f-company" label="会社名" req><input id="f-company" name="company" required autoComplete="organization" style={inp} /></F>
                <F id="f-name" label="お名前" req><input id="f-name" name="name" required autoComplete="name" style={inp} /></F>
                <F id="f-email" label="メールアドレス" req><input id="f-email" name="email" type="email" required autoComplete="email" style={inp} /></F>
                <F id="f-tel" label="電話番号（任意）"><input id="f-tel" name="tel" type="tel" autoComplete="tel" style={inp} /></F>
            </div>
            <F id="f-category" label="お問い合わせ内容" req><select id="f-category" name="category" required defaultValue="" style={{ ...inp, appearance: "none" }}><option value="">選択してください</option>{options.map((o) => <option key={o}>{o}</option>)}</select></F>
            <F id="f-message" label="詳細" req><textarea id="f-message" name="message" required rows={6} style={{ ...inp, border: `1px solid ${INK}`, padding: 14, resize: "vertical" }} /></F>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: N, fontSize: 13, marginBottom: 32 }}><input type="checkbox" id="f-agree" /><span><a href="/privacy/" target="_blank" rel="noopener" style={{ color: "inherit" }}>プライバシーポリシー</a>に同意のうえ送信します</span></label>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
            <button type="submit" disabled={sending} style={{ display: "inline-flex", gap: 16, background: INK, color: "#fff", border: 0, padding: "18px 40px", fontFamily: N, fontSize: 15, fontWeight: 700, cursor: sending ? "default" : "pointer", opacity: sending ? 0.6 : 1 }}>{sending ? "送信中..." : <>送信する <span style={{ fontFamily: "Jost" }}>→</span></>}</button>
            {err && <div role="alert" style={{ marginTop: 20, fontFamily: N, fontSize: 14, lineHeight: 1.9, color: "#C8423B" }}>{err}</div>}
        </form>)
}
