"use client";
import Link from "next/link";

const tools = [
  { icon: "✦", title: "AI Video Studio", text: "Turn a simple idea into a promotional video concept." },
  { icon: "▤", title: "Professional Timeline", text: "Arrange clips, text, music and transitions on a timeline." },
  { icon: "◈", title: "Brand Kit", text: "Keep your logo, colours and fonts ready for every project." },
];

export default function Home() {
  return <main className="shell">
    <header className="top">
      <div className="brand"><div className="mark">PS</div><span>Promo Studio</span></div>
      <nav className="nav"><a href="#features">Features</a><a href="#templates">Templates</a><a href="#pricing">Pricing</a></nav>
      <button className="avatar">Sign in</button>
    </header>
    <section className="hero">
      <div><div className="eyebrow">Create · Edit · Promote</div><h1>Make videos that make your brand <span style={{color:"#0e9f78"}}>stand out.</span></h1><p>Everything you need to create polished promotional videos for your business, products and social media — all in one studio.</p><div className="actions"><Link className="primary" href="/editor" style={{textDecoration:"none"}}>＋ Create a video</Link><Link className="secondary" href="/editor">Explore templates</Link></div></div>
      <div className="preview"><div className="video-card"><div className="video-art"><span>✦</span><div className="play">▶</div></div><h3>Make it memorable.</h3><small>YOUR BRAND · YOUR STORY</small></div></div>
    </section>
    <section id="features"><div className="section-head"><h2>Your creative workspace</h2><span>Everything in one place</span></div><div className="grid">{tools.map(t=><article className="tile" key={t.title}><div className="tile-icon">{t.icon}</div><h3>{t.title}</h3><p>{t.text}</p></article>)}</div></section>
    <section id="templates" style={{marginTop:48}}><div className="section-head"><h2>Start with a template</h2><span>Browse styles</span></div><div className="grid"><article className="tile"><div className="tile-icon">🛍️</div><h3>Product promotion</h3><p>Showcase products with bold titles and clean layouts.</p></article><article className="tile"><div className="tile-icon">📣</div><h3>Business promo</h3><p>Introduce your business with a professional story.</p></article><article className="tile"><div className="tile-icon">📱</div><h3>Social media reel</h3><p>Vertical-first videos for Reels, Shorts and Stories.</p></article></div></section>
    <footer className="bottom"><span>© 2026 Promo Studio · By PaliaAPK HUB</span><span>Free to start · Premium when you need more</span></footer>
  </main>;
}
