#!/usr/bin/env python3
"""
blaze-ltd.com コラム生成スクリプト

  tools/articles/*.json  →  column/<slug>/index.html
                            column/index.html          （全件一覧）
                            column/<category>/index.html（カテゴリ別一覧）
                            sitemap.xml                （コラム分を差し替え）

実行:  python3 tools/gen_column.py
"""
import json, pathlib, re, sys, html
from datetime import date

ROOT = pathlib.Path(__file__).resolve().parent.parent
ARTS = ROOT / 'tools' / 'articles'
OUT  = ROOT / 'column'
SITE = 'https://blaze-ltd.com'

# ── セグメント定義 ────────────────────────────────────────
# 各カテゴリの記事末尾に、対応するサービスへの導線を出す
CATEGORIES = {
    'recruit': {
        'label': '採用・組織',
        'en': 'Recruiting',
        'desc': '経営視点での採用設計、人事制度、組織づくりに関する記事です。',
        'cta_title': '採用コストを、成果報酬型に',
        'cta_text': '有効応募1件ごとの課金で、掲載費・初期費用は0円。求人情報を渡すだけで媒体運用まで一貫対応します。',
        'cta_label': 'Oubo Pay を見る',
        'cta_href': 'https://oubopay.blaze-ltd.com/?utm_source=blaze-column',
        'cta_external': True,
    },
    'sales': {
        'label': '営業育成・事業成長',
        'en': 'Sales Leadership',
        'desc': '営業組織のマネジメント、部下育成、事業成長に関する記事です。',
        'cta_title': '営業管理職の育成について相談する',
        'cta_text': 'プレイングマネージャーの時間配分から部下育成の型まで、営業組織を率いる立場に必要なスキルを体系化した研修プログラムをご案内します。',
        'cta_label': '営業管理職研修を相談する',
        'cta_href': '/contact/?from=column-sales',
        'cta_external': False,
    },
    'career': {
        'label': 'キャリア・転職',
        'en': 'Career',
        'desc': '働き方やキャリア形成、転職活動の進め方に関する記事です。',
        'cta_title': '自分に合うエージェントを見つける',
        'cta_text': 'AI診断で転職可能性を可視化し、実績・専門領域から最適なエージェントをマッチング。登録は無料です。',
        'cta_label': 'Cocopath を見る',
        'cta_href': 'https://cocopath.blaze-ltd.com/?utm_source=blaze-column',
        'cta_external': True,
    },
    'ai': {
        'label': 'AI・業務自動化',
        'en': 'AI Automation',
        'desc': 'AIによる業務自動化、生成AIの実務活用に関する記事です。',
        'cta_title': '自社の業務をAIで自動化する',
        'cta_text': 'ヒアリングから開発・運用まで一気通貫。既存システムはそのままに、御社の業務に合わせたAIツールを設計・導入します。',
        'cta_label': 'Hakadoru AI を見る',
        'cta_href': 'https://hakadoruai.blaze-ltd.com/?utm_source=blaze-column',
        'cta_external': True,
    },
}

E = lambda s: html.escape(str(s), quote=True)


# ── 共通パーツ ───────────────────────────────────────────
def head(title, desc, canonical, extra_ld=''):
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-H67Y48Q10E"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-H67Y48Q10E');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="{E(canonical)}">
<meta property="og:image" content="{SITE}/ogp.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE}/ogp.png">
<meta name="robots" content="index, follow">
<title>{E(title)}</title>
<link rel="canonical" href="{E(canonical)}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
{extra_ld}<style>{CSS}</style>
</head>
<body>
{NAV}
"""

NAV = """<nav id="nav">
  <a href="/" class="logo"><img src="/logo.png" alt="BLAZE"></a>
  <ul class="nav-links">
    <li><a href="/service/">Service</a></li>
    <li><a href="/company/">Company</a></li>
    <li><a href="/column/">Column</a></li>
    <li><a href="/news/">News</a></li>
    <li><a href="/contact/">Contact</a></li>
  </ul>
  <div class="ham" id="ham" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>

<div class="mob-menu" id="mobMenu">
  <button class="mob-close" onclick="toggleMenu()">✕</button>
  <a href="/service/" onclick="toggleMenu()">Service</a>
  <a href="/company/" onclick="toggleMenu()">Company</a>
  <a href="/column/"  onclick="toggleMenu()">Column</a>
  <a href="/news/"    onclick="toggleMenu()">News</a>
  <a href="/contact/" onclick="toggleMenu()">Contact</a>
</div>"""

FOOT = """<footer>
  <p class="f-copy">&copy; 2026 BLAZE Inc. ALL RIGHTS RESERVED.</p>
</footer>

<script>
window.addEventListener('scroll', function(){
  document.getElementById('nav').classList.toggle('s', window.scrollY > 40);
});
function toggleMenu(){
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('mobMenu').classList.toggle('open');
}
</script>
</body>
</html>
"""

# 記事は長文を読ませるため、トップページのキャンバス演出は載せない。
# 可読性（本文コントラスト・行長・行間）を最優先した設計にしている。
CSS = """
:root{
  --bg:#03050f; --surface:#080c1c; --accent:#4DFFDF; --white:#fff;
  --tx:rgba(255,255,255,.92); --tx2:rgba(255,255,255,.72);
  --w5:rgba(255,255,255,.5); --w3:rgba(255,255,255,.3);
  --w15:rgba(255,255,255,.15); --w08:rgba(255,255,255,.08); --w04:rgba(255,255,255,.04);
  --ff-j:'Jost',sans-serif; --ff-n:'Noto Sans JP',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--tx);font-family:var(--ff-n);font-weight:400;line-height:1.9;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{color:inherit}

/* ヘッダーは #nav に限定して指定する。
   目次も意味的に <nav> で書いているため、型セレクタにすると巻き込まれる */
#nav{position:fixed;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:0 52px;height:72px;z-index:200;transition:background .4s}
#nav.s{background:rgba(3,5,15,.9);backdrop-filter:blur(24px);border-bottom:1px solid var(--w15)}
.logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0}
.logo img{height:72px;width:auto;display:block}
.nav-links{display:flex;gap:30px;list-style:none;align-items:center}
.nav-links a{font-family:var(--ff-j);font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--w5);text-decoration:none;transition:color .3s}
.nav-links a:hover{color:var(--white)}
.ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;z-index:300}
.ham span{display:block;width:22px;height:1.5px;background:var(--white);transition:transform .3s,opacity .3s}
.ham.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.ham.open span:nth-child(2){opacity:0}
.ham.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.mob-menu{position:fixed;inset:0;background:rgba(0,0,8,.97);z-index:250;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;opacity:0;pointer-events:none;transition:opacity .3s}
.mob-menu.open{opacity:1;pointer-events:all}
.mob-menu a{font-family:var(--ff-j);font-size:21px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--white);text-decoration:none}
.mob-close{position:absolute;top:26px;right:26px;background:none;border:1px solid var(--w3);color:var(--white);font-size:18px;width:44px;height:44px;cursor:pointer}

/* ── 記事 ── */
.wrap{max-width:760px;margin:0 auto;padding:130px 24px 90px}
.crumb{font-size:12px;color:var(--w5);margin-bottom:22px;line-height:1.7}
.crumb a{color:var(--w5);text-decoration:none}
.crumb a:hover{color:var(--white)}
.a-cat{display:inline-block;font-family:var(--ff-j);font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);border:1px solid rgba(77,255,223,.35);padding:5px 11px;margin-bottom:18px}
h1{font-size:clamp(24px,3.4vw,34px);font-weight:700;line-height:1.5;letter-spacing:.01em;margin-bottom:18px;text-wrap:balance}
.a-meta{font-size:12px;color:var(--w5);letter-spacing:.04em;padding-bottom:26px;border-bottom:1px solid var(--w15)}
.a-lead{font-size:15px;line-height:2.05;color:var(--tx2);margin:30px 0 0}

.toc{background:var(--surface);border:1px solid var(--w15);padding:24px 26px;margin:38px 0}
.toc-t{font-family:var(--ff-j);font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--w5);margin-bottom:14px}
.toc ol{list-style:none;counter-reset:t}
.toc li{counter-increment:t;font-size:14px;line-height:1.9;padding-left:30px;position:relative}
.toc li::before{content:counter(t,decimal-leading-zero);position:absolute;left:0;font-family:var(--ff-j);font-size:11px;font-weight:600;color:var(--w3);top:4px}
.toc a{color:var(--tx2);text-decoration:none}
.toc a:hover{color:var(--accent)}

article h2{font-size:21px;font-weight:700;line-height:1.6;margin:56px 0 20px;padding-left:14px;border-left:3px solid var(--accent);scroll-margin-top:90px}
article h3{font-size:17px;font-weight:600;line-height:1.6;margin:36px 0 14px;color:var(--white)}
article p{font-size:15px;line-height:2.05;margin-bottom:20px;color:var(--tx)}
article ul,article ol{margin:0 0 22px 1.4em}
article li{font-size:15px;line-height:1.95;margin-bottom:9px}
article strong{font-weight:700;color:var(--white)}
article a.plink{color:var(--accent);text-decoration:underline;text-underline-offset:3px}

.tbl{width:100%;border-collapse:collapse;margin:8px 0 26px;font-size:14px;display:block;overflow-x:auto}
.tbl th,.tbl td{border:1px solid var(--w15);padding:11px 13px;text-align:left;line-height:1.7}
.tbl th{background:var(--w04);font-weight:600;white-space:nowrap}

.note{background:var(--w04);border-left:3px solid var(--w3);padding:18px 20px;margin:26px 0;font-size:14px;line-height:1.95;color:var(--tx2)}

.faq{margin:50px 0 0}
.faq-i{border-bottom:1px solid var(--w15);padding:20px 0}
.faq-q{font-size:15px;font-weight:600;margin-bottom:10px;line-height:1.7}
.faq-q::before{content:'Q.';font-family:var(--ff-j);color:var(--accent);margin-right:8px;font-weight:700}
.faq-a{font-size:14px;line-height:1.95;color:var(--tx2)}

.recap{background:var(--surface);border:1px solid var(--w15);padding:26px 28px;margin:50px 0 0}
.recap-t{font-family:var(--ff-j);font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--w5);margin-bottom:14px}
.recap ul{margin:0 0 0 1.2em}
.recap li{font-size:14px;line-height:1.9;margin-bottom:10px;color:var(--tx2)}

/* ── セグメント別CTA ── */
.cta{border:1px solid rgba(77,255,223,.3);background:linear-gradient(180deg,rgba(77,255,223,.05),transparent);padding:34px 30px;margin:56px 0 0;text-align:center}
.cta-t{font-family:var(--ff-j);font-size:19px;font-weight:700;line-height:1.5;margin-bottom:12px}
.cta-s{font-size:14px;line-height:1.95;color:var(--tx2);margin-bottom:22px}
.cta-b{display:inline-block;font-family:var(--ff-j);font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--bg);background:var(--white);text-decoration:none;padding:14px 34px;transition:background .3s,transform .2s}
.cta-b:hover{background:var(--accent);transform:translateY(-2px)}

.rel{margin:60px 0 0;border-top:1px solid var(--w15);padding-top:34px}
.rel-t{font-family:var(--ff-j);font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--w5);margin-bottom:16px}
.rel a{display:block;font-size:14px;line-height:1.75;color:var(--tx2);text-decoration:none;padding:11px 0;border-bottom:1px solid var(--w08)}
.rel a:hover{color:var(--accent)}

/* ── 一覧ページ ── */
.hd{max-width:1000px;margin:0 auto;padding:140px 24px 0}
.hd .s-lbl{font-family:var(--ff-j);font-size:10px;font-weight:600;letter-spacing:.35em;text-transform:uppercase;color:var(--w5);margin-bottom:12px}
.hd h1{font-family:var(--ff-j);font-size:clamp(26px,3.8vw,46px);line-height:1.15}
.hd p{font-size:14px;line-height:1.95;color:var(--tx2);margin-top:18px;max-width:600px}
.cats{max-width:1000px;margin:44px auto 0;padding:0 24px;display:flex;flex-wrap:wrap;gap:10px}
.cats a{font-family:var(--ff-j);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--tx2);text-decoration:none;border:1px solid var(--w15);padding:9px 18px;transition:all .3s}
.cats a:hover,.cats a.on{background:var(--white);color:var(--bg);border-color:var(--white)}
.list{max-width:1000px;margin:0 auto;padding:46px 24px 100px;display:grid;gap:1px;background:var(--w15);border:1px solid var(--w15);border-radius:0}
.list{background:transparent;border:none;gap:0}
.card{display:block;text-decoration:none;padding:26px 4px;border-bottom:1px solid var(--w15);transition:background .3s}
.card:hover{background:var(--w04)}
.card-c{font-family:var(--ff-j);font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:9px}
.card-t{font-size:16px;font-weight:600;line-height:1.65;margin-bottom:9px;color:var(--white)}
.card-d{font-size:13px;line-height:1.85;color:var(--tx2)}
.empty{padding:60px 4px;color:var(--w5);font-size:14px}

footer{padding:30px 52px;border-top:1px solid var(--w15);text-align:center}
.f-copy{font-family:var(--ff-j);font-size:10px;font-weight:300;color:var(--w3);letter-spacing:.18em}

@media(max-width:768px){
  #nav{padding:0 20px;height:64px}
  .logo img{height:48px}
  .nav-links{display:none}
  .ham{display:flex}
  .wrap{padding:110px 20px 70px}
  .hd{padding:110px 20px 0}
  .cats,.list{padding-left:20px;padding-right:20px}
  article h2{font-size:19px;margin:44px 0 16px}
  footer{padding:26px 20px}
}
"""


# ── 記事HTML ─────────────────────────────────────────────
def render_article(a, all_by_cat):
    cat = CATEGORIES[a['category']]
    url = f"{SITE}/column/{a['slug']}/"

    # 目次（h2のみ）
    toc = ''.join(
        f'<li><a href="#s{i}">{E(s["h2"])}</a></li>'
        for i, s in enumerate(a['sections'], 1))

    # 本文
    body = []
    for i, s in enumerate(a['sections'], 1):
        body.append(f'<h2 id="s{i}">{E(s["h2"])}</h2>')
        for blk in s.get('body', []):
            body.append(render_block(blk))
        for h3 in s.get('h3s', []):
            body.append(f'<h3>{E(h3["h3"])}</h3>')
            for blk in h3.get('body', []):
                body.append(render_block(blk))
    body = '\n'.join(body)

    faq = ''
    if a.get('faq'):
        items = ''.join(
            f'<div class="faq-i"><p class="faq-q">{E(q["q"])}</p>'
            f'<p class="faq-a">{E(q["a"])}</p></div>' for q in a['faq'])
        faq = f'<div class="faq"><h2 id="faq">よくある質問</h2>{items}</div>'

    recap = ''
    if a.get('summary'):
        li = ''.join(f'<li>{E(x)}</li>' for x in a['summary'])
        recap = f'<div class="recap"><p class="recap-t">この記事のまとめ</p><ul>{li}</ul></div>'

    ext = ' target="_blank" rel="noopener"' if cat['cta_external'] else ''
    cta = (f'<div class="cta"><p class="cta-t">{E(cat["cta_title"])}</p>'
           f'<p class="cta-s">{E(cat["cta_text"])}</p>'
           f'<a class="cta-b" href="{E(cat["cta_href"])}"{ext}>{E(cat["cta_label"])}</a></div>')

    # 同カテゴリの関連記事（最大5本）
    rel_items = [x for x in all_by_cat[a['category']] if x['slug'] != a['slug']][:5]
    rel = ''
    if rel_items:
        links = ''.join(
            f'<a href="/column/{E(r["slug"])}/">{E(r["title"])}</a>' for r in rel_items)
        rel = f'<div class="rel"><p class="rel-t">関連記事</p>{links}</div>'

    ld = json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Article", "headline": a['title'], "description": a['description'],
             "datePublished": a['updated'], "dateModified": a['updated'],
             "mainEntityOfPage": url, "image": f"{SITE}/ogp.png",
             "author": {"@type": "Organization", "name": "株式会社BLAZE", "url": SITE},
             "publisher": {"@type": "Organization", "name": "株式会社BLAZE", "url": SITE,
                           "logo": {"@type": "ImageObject", "url": f"{SITE}/logo.png"}}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE},
                {"@type": "ListItem", "position": 2, "name": "コラム", "item": f"{SITE}/column/"},
                {"@type": "ListItem", "position": 3, "name": cat['label'],
                 "item": f"{SITE}/column/{a['category']}/"},
                {"@type": "ListItem", "position": 4, "name": a['title'], "item": url}]}
        ]}, ensure_ascii=False, separators=(',', ':'))

    if a.get('faq'):
        pass  # FAQPage は本文と重複するため付けない（構造化データの過剰付与を避ける）

    extra = f'<script type="application/ld+json">{ld}</script>\n'

    return head(a['title'], a['description'], url, extra) + f"""
<div class="wrap">
  <p class="crumb"><a href="/">ホーム</a> ／ <a href="/column/">コラム</a> ／ <a href="/column/{E(a['category'])}/">{E(cat['label'])}</a></p>
  <span class="a-cat">{E(cat['en'])}</span>
  <h1>{E(a['title'])}</h1>
  <p class="a-meta">最終更新 {E(a['updated'])}</p>
  <p class="a-lead">{E(a['lead'])}</p>

  <nav class="toc"><p class="toc-t">目次</p><ol>{toc}</ol></nav>

  <article>
{body}
{faq}
{recap}
  </article>

  {cta}
  {rel}
</div>

{FOOT}"""


def render_block(blk):
    """段落・リスト・表・注記を出し分ける"""
    if isinstance(blk, str):
        return f'<p>{inline(blk)}</p>'
    t = blk.get('type')
    if t == 'ul':
        return '<ul>' + ''.join(f'<li>{inline(x)}</li>' for x in blk['items']) + '</ul>'
    if t == 'ol':
        return '<ol>' + ''.join(f'<li>{inline(x)}</li>' for x in blk['items']) + '</ol>'
    if t == 'table':
        head_ = '<tr>' + ''.join(f'<th>{inline(h)}</th>' for h in blk['head']) + '</tr>'
        rows = ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>'
                       for r in blk['rows'])
        return f'<table class="tbl">{head_}{rows}</table>'
    if t == 'note':
        return f'<p class="note">{inline(blk["text"])}</p>'
    raise ValueError(f'未知のブロック種別: {t}')


def inline(s):
    """**強調** と [文言](url) を許可。それ以外はエスケープする"""
    s = E(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\[(.+?)\]\((/[^)]+|https?://[^)]+)\)',
               r'<a class="plink" href="\2">\1</a>', s)
    return s


# ── 一覧ページ ───────────────────────────────────────────
def render_list(arts, cat_key=None):
    if cat_key:
        c = CATEGORIES[cat_key]
        title, desc = f"{c['label']}｜コラム | 株式会社BLAZE", c['desc']
        canon, h1 = f"{SITE}/column/{cat_key}/", c['label']
    else:
        title = 'コラム | 株式会社BLAZE'
        desc = '採用・組織、営業育成、キャリア、AI業務自動化に関する実務記事を掲載しています。'
        canon, h1 = f'{SITE}/column/', 'コラム'

    tabs = f'<a href="/column/"{"" if cat_key else " class=on"}>すべて</a>' + ''.join(
        f'<a href="/column/{k}/"{" class=on" if cat_key == k else ""}>{E(v["label"])}</a>'
        for k, v in CATEGORIES.items())

    if arts:
        cards = ''.join(
            f'<a class="card" href="/column/{E(a["slug"])}/">'
            f'<p class="card-c">{E(CATEGORIES[a["category"]]["label"])}</p>'
            f'<p class="card-t">{E(a["title"])}</p>'
            f'<p class="card-d">{E(a["description"])}</p></a>' for a in arts)
    else:
        cards = '<p class="empty">この分類の記事は準備中です。</p>'

    return head(title, desc, canon) + f"""
<div class="hd">
  <p class="s-lbl">Column</p>
  <h1>{E(h1)}</h1>
  <p>{E(desc)}</p>
</div>
<div class="cats">{tabs}</div>
<div class="list">{cards}</div>

{FOOT}"""


# ── sitemap ─────────────────────────────────────────────
def update_sitemap(arts):
    """固定ページは温存し、コラム分のURLだけを入れ替える"""
    p = ROOT / 'sitemap.xml'
    xml = p.read_text(encoding='utf-8')
    xml = re.sub(r'\s*<url>\s*<loc>https://blaze-ltd\.com/column/.*?</url>', '', xml, flags=re.S)

    blocks = [f"""
  <url>
    <loc>{SITE}/column/</loc>
    <lastmod>{date.today()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""]
    for k in CATEGORIES:
        blocks.append(f"""
  <url>
    <loc>{SITE}/column/{k}/</loc>
    <lastmod>{date.today()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")
    for a in arts:
        blocks.append(f"""
  <url>
    <loc>{SITE}/column/{a['slug']}/</loc>
    <lastmod>{a['updated']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

    xml = xml.replace('</urlset>', ''.join(blocks) + '\n</urlset>')
    p.write_text(xml, encoding='utf-8')
    return len(blocks)


# ── 検証 ────────────────────────────────────────────────
REQUIRED = ('slug', 'category', 'title', 'description', 'updated', 'lead', 'sections')
MIN_CHARS = 5000

def validate(a, seen):
    errs = []
    for k in REQUIRED:
        if not a.get(k):
            errs.append(f'必須項目 {k} がありません')
    if a.get('category') not in CATEGORIES:
        errs.append(f'未知のカテゴリ: {a.get("category")}')
    if a.get('slug') in seen:
        errs.append(f'slug が重複: {a["slug"]}')
    if not re.fullmatch(r'[a-z0-9-]+', a.get('slug', '')):
        errs.append(f'slug は英小文字・数字・ハイフンのみ: {a.get("slug")}')
    n = count_chars(a)
    if n < MIN_CHARS:
        errs.append(f'本文が {n} 字。{MIN_CHARS} 字以上が必要')
    return errs, n


def count_chars(a):
    """本文の実文字数（空白を除く）"""
    buf = [a.get('lead', '')]
    for s in a.get('sections', []):
        buf.append(s['h2'])
        buf += flatten(s.get('body', []))
        for h3 in s.get('h3s', []):
            buf.append(h3['h3'])
            buf += flatten(h3.get('body', []))
    for q in a.get('faq', []):
        buf += [q['q'], q['a']]
    buf += a.get('summary', [])
    return len(re.sub(r'\s', '', ''.join(buf)))


def flatten(blocks):
    out = []
    for b in blocks:
        if isinstance(b, str):
            out.append(b)
        elif b.get('type') in ('ul', 'ol'):
            out += b['items']
        elif b.get('type') == 'table':
            out += b['head'] + [c for r in b['rows'] for c in r]
        elif b.get('type') == 'note':
            out.append(b['text'])
    return out


# ── main ────────────────────────────────────────────────
def main():
    if not ARTS.exists():
        sys.exit(f'記事ディレクトリがありません: {ARTS}')

    arts, seen, failed = [], set(), 0
    for f in sorted(ARTS.glob('*.json')):
        a = json.loads(f.read_text(encoding='utf-8'))
        errs, n = validate(a, seen)
        if errs:
            failed += 1
            print(f'  ✗ {f.name}')
            for e in errs:
                print(f'      {e}')
            continue
        seen.add(a['slug'])
        a['_chars'] = n
        arts.append(a)

    if failed:
        sys.exit(f'\n{failed} 件の記事に問題があります。修正してください。')

    arts.sort(key=lambda x: (x['updated'], x['slug']), reverse=True)
    by_cat = {k: [a for a in arts if a['category'] == k] for k in CATEGORIES}

    OUT.mkdir(exist_ok=True)
    for a in arts:
        d = OUT / a['slug']
        d.mkdir(exist_ok=True)
        (d / 'index.html').write_text(render_article(a, by_cat), encoding='utf-8')

    (OUT / 'index.html').write_text(render_list(arts), encoding='utf-8')
    for k in CATEGORIES:
        d = OUT / k
        d.mkdir(exist_ok=True)
        (d / 'index.html').write_text(render_list(by_cat[k], k), encoding='utf-8')

    n_urls = update_sitemap(arts)

    print(f'\n✅ 生成完了: 記事 {len(arts)} 本 / sitemap {n_urls} URL 追加')
    for k, v in CATEGORIES.items():
        c = by_cat[k]
        avg = int(sum(x['_chars'] for x in c) / len(c)) if c else 0
        print(f'   {v["label"]:16} {len(c):4}本  平均 {avg:,}字')


if __name__ == '__main__':
    main()
