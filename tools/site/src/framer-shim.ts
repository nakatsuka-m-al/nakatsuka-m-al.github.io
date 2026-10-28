// Framer の "framer" パッケージの代わり。コード部品を Framer 外でそのまま動かすための最小実装。
export const RenderTarget = { canvas: "canvas", preview: "preview", current: () => "preview" }
export const ControlType = new Proxy({}, { get: (_t, k) => String(k) }) as any
export function addPropertyControls(_c: unknown, _p: unknown) {}
