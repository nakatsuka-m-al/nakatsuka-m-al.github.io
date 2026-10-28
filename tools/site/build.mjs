// トップ＋下層5ページを生成する。
//   npm run build   （tools/site で実行）
// - src/components は Framer のコード部品をそのまま写したもの（"framer" は src/framer-shim.ts に置き換え）
// - heads/*.html は各ページの <head> 内のメタ情報（タイトル・説明・構造化データ・計測タグ）
import { build } from "esbuild"
import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, "../..")
const shim = { framer: join(HERE, "src/framer-shim.ts") }
const common = { bundle: true, jsx: "automatic", alias: shim, loader: { ".json": "json" }, logLevel: "warning" }

// 1) ブラウザ用バンドル
const client = await build({ ...common, entryPoints: [join(HERE, "src/client.tsx")], format: "iife", minify: true, write: false, define: { "process.env.NODE_ENV": '"production"' }, target: ["es2019"] })
const js = client.outputFiles[0].contents
const css = readFileSync(join(HERE, "src/site.css"))
const v = createHash("sha1").update(js).update(css).digest("hex").slice(0, 10)
mkdirSync(join(ROOT, "assets"), { recursive: true })
writeFileSync(join(ROOT, "assets/site.js"), js)
writeFileSync(join(ROOT, "assets/site.css"), css)

// 2) 静的HTML（検索エンジン向けの初期表示）
const tmp = join(HERE, ".server.mjs")
await build({ ...common, entryPoints: [join(HERE, "src/server.tsx")], platform: "node", format: "esm", outfile: tmp, packages: "external", define: { "process.env.NODE_ENV": '"production"' } })
const { render, KEYS, OUT } = await import(pathToFileURL(tmp).href + "?t=" + Date.now())

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">`

for (const key of KEYS) {
    const headFile = join(HERE, "heads", key + ".html")
    if (!existsSync(headFile)) throw new Error("missing " + headFile)
    const head = readFileSync(headFile, "utf8").trim()
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
${head}
${FONTS}
<link rel="stylesheet" href="/assets/site.css?v=${v}">
<script>document.documentElement.classList.add('js');setTimeout(function(){var r=document.getElementById('root');r&&r.classList.add('ready')},2500)</script>
</head>
<body>
<div id="root" data-page="${key}">${render(key)}</div>
<script src="/assets/site.js?v=${v}" defer></script>
</body>
</html>
`
    const out = join(ROOT, OUT[key])
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, html)
    console.log("wrote", OUT[key], (html.length / 1024).toFixed(1) + "KB")
}
console.log("assets/site.js", (js.length / 1024).toFixed(0) + "KB", "v=" + v)
