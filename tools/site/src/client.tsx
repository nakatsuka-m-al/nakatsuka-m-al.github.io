import { createRoot } from "react-dom/client"
import { PAGES } from "./pages"

// 静的HTML（検索エンジン向け）を描き出したあと、ブラウザでは同じ内容を描き直して動きを付ける。
// 幅に応じたレイアウト切り替えが初回描画から正しく効くよう、hydrate ではなく描き直しにしている。
const root = document.getElementById("root")!
const key = root.dataset.page!
createRoot(root).render(PAGES[key].render())
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("ready")))
