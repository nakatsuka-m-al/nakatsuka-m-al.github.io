import { Page, Appear, HomeNews } from "./Shell"
import VideoHeroB from "./components/VideoHeroB"
import ScrollLens from "./components/ScrollLens"
import Connector from "./components/Connector"
import AccentHeading from "./components/AccentHeading"
import BusinessTabs from "./components/BusinessTabs"
import HoverIndex from "./components/HoverIndex"
import InnerPage from "./components/InnerPage"
import service from "./data/service.json"
import company from "./data/company.json"
import news from "./data/news.json"
import contact from "./data/contact.json"
import privacy from "./data/privacy.json"

// Framer では絶対URLで書いていた自サイト内リンクを相対パスにそろえる
const rel = (v: unknown) => JSON.stringify(v).split("https://blaze-ltd.com/").join("/")

const BUSINESS = [
    { word: "Recruit", label: "Oubo Pay — 成果報酬型の応募送客", desc: "求人情報を渡すだけ。媒体設計から運用・最適化まで一貫対応し、有効応募にだけ費用が発生します。", color: "#1B3B8F", href: "/service/#oubo-pay", stat: "¥0", statLabel: "初期費用・掲載費", points: "有効応募だけに課金|媒体設計から運用まで|取引社数50社突破" },
    { word: "Career", label: "Cocopath — AIキャリアアシスタント", desc: "AI診断で転職可能性を可視化し、実績と専門領域から最適なエージェントへマッチング。", color: "#1F7A57", href: "/service/#cocopath", stat: "AI", statLabel: "キャリア診断", points: "転職可能性を可視化|最適なエージェントを提案|登録無料" },
    { word: "Leader", label: "BLAZE Sales Leadership — 営業管理職研修", desc: "時間の使い方、部下育成の型、事業を伸ばす打ち手まで。営業組織を率いる力を体系化します。", color: "#C8423B", href: "/service/#sales-leadership", stat: "3", statLabel: "つの型で体系化", points: "時間の使い方|部下育成の型|事業を伸ばす打ち手" },
    { word: "Grid", label: "BLAZE Grid — ハイクラス人材コミュニティ", desc: "転職市場にいない優秀な人材のネットワーク。潜在層へ、直接アクセスできます。", color: "#E0A82E", href: "/service/#blaze-grid", stat: "1:1", statLabel: "潜在層へ直接アクセス", points: "転職市場にいない人材|ハイクラス限定|独自ネットワーク" },
]
const INDEX = [
    { no: "01", title: "Vision", sub: "ビジョン・理念", href: "/#vision", image: "" },
    { no: "02", title: "Service", sub: "事業一覧", href: "/service/", image: "" },
    { no: "03", title: "Column", sub: "コラム", href: "/column/", image: "" },
    { no: "04", title: "News", sub: "お知らせ・メディア掲載", href: "/news/", image: "" },
    { no: "05", title: "Company", sub: "会社概要・アクセス", href: "/company/", image: "" },
    { no: "06", title: "Contact", sub: "お問い合わせ", href: "/contact/", image: "" },
]

function Home() {
    return (
        <Page>
            <header className="hero">
                <h1 className="sr-only">株式会社BLAZE — 意思ある行動に、火をつける。</h1>
                <VideoHeroB videoUrl="https://assets.mixkit.co/videos/30139/30139-720.mp4" text={"Blaze\nYour Path."} sub="意思ある行動に、火をつける。" accent="#1B3B8F" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </header>
            <ScrollLens videoUrl="https://videos.pexels.com/video-files/18413834/18413834-hd_1920_1080_60fps.mp4" intro={"Connect\nPeople &\nCompanies."}
                leftTag="For Companies" leftTitle={"Hire with\nPerformance"} leftText="企業に「採用」を届ける。" leftHref="/service/#for-companies"
                rightTag="For People" rightTitle={"Career by\nDesign"} rightText="一人ひとりの理想のキャリアへ。" rightHref="/service/#for-people"
                accent="#1B3B8F" style={{ width: "100%", height: 2800 }} />
            <section className="stmt" id="vision">
                <Connector color="#1B3B8F" lineColor="rgba(11,16,32,0.18)" style={{ width: 40, height: 200, flex: "none" }} />
                <div className="stmt-in">
                    <AccentHeading text={"**採用**と**キャリア**を起点に、\n**人生の可能性**を\n前進させる。"} accent="#1B3B8F" color="#0B1020" size={50} align="center" style={{ width: "100%" }} />
                    <Appear className="stmt-body" x={40} stiffness={120} damping={30} delay={0.2} amount={0.3}>
                        <p>BLAZEは、企業の採用と個人のキャリアの両側から、<br />「意思ある行動」が報われる仕組みをつくります。<br />成果報酬の集客、AIによるキャリア支援、<br />営業組織の育成まで。点ではなく、線で伴走します。</p>
                    </Appear>
                </div>
            </section>
            <section className="biz">
                <BusinessTabs kicker="Our Business" heading={"Many ways\nto move forward."} data={JSON.stringify(BUSINESS)} interval={6} style={{ width: "100%" }} />
            </section>
            <section className="idx">
                <HoverIndex kicker="Index" heading={"Explore\nBLAZE."} data={JSON.stringify(INDEX)} accent="#1B3B8F" style={{ width: "100%" }} />
            </section>
            <HomeNews />
        </Page>)
}

const Inner = ({ data, from }: { data: unknown; from?: string }) => (
    <Page from={from}>
        <main className="body"><InnerPage data={rel(data)} style={{ width: "100%", maxWidth: 1240 }} /></main>
    </Page>)

export const PAGES: Record<string, { out: string; render: () => JSX.Element }> = {
    home: { out: "index.html", render: () => <Home /> },
    service: { out: "service/index.html", render: () => <Inner data={service} from="service" /> },
    company: { out: "company/index.html", render: () => <Inner data={company} from="company" /> },
    news: { out: "news/index.html", render: () => <Inner data={news} from="news" /> },
    contact: { out: "contact/index.html", render: () => <Inner data={contact} /> },
    privacy: { out: "privacy/index.html", render: () => <Inner data={privacy} from="privacy" /> },
}
