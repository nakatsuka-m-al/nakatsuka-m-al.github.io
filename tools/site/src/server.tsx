import { renderToStaticMarkup } from "react-dom/server"
import { PAGES } from "./pages"

export function render(key: string) {
    return renderToStaticMarkup(PAGES[key].render())
}
export const KEYS = Object.keys(PAGES)
export const OUT = Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, v.out]))
