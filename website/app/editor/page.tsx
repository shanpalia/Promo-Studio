"use client";
import "./editor.css";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type MediaItem = { id: string; file: File; url: string; kind: "video" | "image" | "audio"; duration: number };
type PromoTemplate = { id: string; name: string; category: string; title: string; ratio: string; duration: number; accent: string; background: string; description: string };
const promoTemplates: PromoTemplate[] = [
  { id: "product", name: "Product Launch", category: "PRODUCT", title: "Meet Your New Favourite", ratio: "9:16", duration: 10, accent: "#fff1d6", background: "linear-gradient(145deg,#f1b76c,#b65c48 55%,#243d35)", description: "Bold product reveal" },
  { id: "business", name: "Business Promo", category: "BUSINESS", title: "Your Trusted Local Partner", ratio: "16:9", duration: 15, accent: "#d7ffe9", background: "linear-gradient(145deg,#b5e8d0,#4e947c 55%,#1e493e)", description: "Clean professional look" },
  { id: "sale", name: "Sale & Offer", category: "OFFER", title: "MEGA SALE · UP TO 50% OFF", ratio: "9:16", duration: 10, accent: "#ffe2e2", background: "linear-gradient(145deg,#ff8a7a,#c73551 58%,#581d42)", description: "High-impact offer" },
  { id: "reel", name: "Social Media Reel", category: "SOCIAL", title: "Stop Scrolling. Watch This!", ratio: "9:16", duration: 15, accent: "#e7ddff", background: "linear-gradient(145deg,#bda5ff,#6654a5 55%,#272443)", description: "Vertical creator style" },
  { id: "event", name: "Event Invitation", category: "EVENT", title: "You Are Invited!", ratio: "1:1", duration: 10, accent: "#ffe8c8", background: "linear-gradient(145deg,#e9c38e,#a56b55 55%,#473447)", description: "Elegant announcement" },
  { id: "food", name: "Food & Restaurant", category: "FOOD", title: "Fresh Taste. Great Moments.", ratio: "1:1", duration: 10, accent: "#e4f4c9", background: "linear-gradient(145deg,#d8a15e,#7c984b 55%,#314a34)", description: "Appetising food promo" },
  { id: "fashion", name: "Fashion & Boutique", category: "PRODUCT", title: "Wear Your Confidence", ratio: "9:16", duration: 15, accent: "#f8dce8", background: "linear-gradient(145deg,#edb4c9,#a34e76 55%,#40243b)", description: "Style and collection showcase" },
  { id: "beauty", name: "Beauty & Salon", category: "BUSINESS", title: "Your Glow Starts Here", ratio: "9:16", duration: 15, accent: "#ffe0ec", background: "linear-gradient(145deg,#f7b6cb,#bd6c91 55%,#633b59)", description: "Beauty service promotion" },
  { id: "realestate", name: "Real Estate", category: "BUSINESS", title: "Find Your Dream Home", ratio: "16:9", duration: 15, accent: "#e0f0ff", background: "linear-gradient(145deg,#9fc9e8,#477c9b 55%,#233b50)", description: "Property listing showcase" },
  { id: "app", name: "App & Website", category: "TECH", title: "Smarter. Faster. Better.", ratio: "9:16", duration: 15, accent: "#d8f7ff", background: "linear-gradient(145deg,#73d7d4,#367eaa 55%,#25345c)", description: "App launch and feature demo" },
  { id: "tech", name: "Tech Product", category: "TECH", title: "Innovation in Your Hands", ratio: "16:9", duration: 15, accent: "#d8e8ff", background: "linear-gradient(145deg,#91b8f4,#4a5e9e 55%,#202747)", description: "Gadget and technology reveal" },
  { id: "youtube", name: "YouTube Intro", category: "SOCIAL", title: "Welcome to My Channel", ratio: "16:9", duration: 10, accent: "#ffe0df", background: "linear-gradient(145deg,#ff9b8e,#d14a50 55%,#522638)", description: "Channel opener and branding" },
  { id: "story", name: "Instagram Story", category: "SOCIAL", title: "A Little Update for You", ratio: "9:16", duration: 10, accent: "#f1e4ff", background: "linear-gradient(145deg,#d7a9ff,#8660b7 55%,#382d59)", description: "Story announcement layout" },
  { id: "festival", name: "Festival Greeting", category: "FESTIVAL", title: "Wishing You Joy & Happiness", ratio: "9:16", duration: 10, accent: "#ffebc4", background: "linear-gradient(145deg,#f3bd68,#bd7545 55%,#58334a)", description: "Festive wishes and greetings" },
  { id: "eid", name: "Eid Greeting", category: "FESTIVAL", title: "Eid Mubarak", ratio: "1:1", duration: 10, accent: "#e2f5d8", background: "linear-gradient(145deg,#a6d9a9,#43866f 55%,#1d4544)", description: "Elegant festive greeting" },
  { id: "diwali", name: "Diwali Greeting", category: "FESTIVAL", title: "Light Up Every Moment", ratio: "1:1", duration: 10, accent: "#ffe5b0", background: "linear-gradient(145deg,#ffc36d,#d36b38 55%,#582d3d)", description: "Festival of lights design" },
  { id: "wedding", name: "Wedding Invitation", category: "EVENT", title: "Together Forever", ratio: "9:16", duration: 15, accent: "#ffe9d8", background: "linear-gradient(145deg,#e8c5a7,#aa7772 55%,#55404c)", description: "Romantic invitation video" },
  { id: "birthday", name: "Birthday Wishes", category: "EVENT", title: "Make a Wish!", ratio: "1:1", duration: 10, accent: "#ffe2ef", background: "linear-gradient(145deg,#f5a8c9,#9d75c7 55%,#3c426e)", description: "Birthday celebration card" },
  { id: "music", name: "Music Promotion", category: "SOCIAL", title: "Feel the Beat", ratio: "9:16", duration: 15, accent: "#e7ddff", background: "linear-gradient(145deg,#ad9bff,#5c4d9d 55%,#201f39)", description: "Track and artist promo" },
  { id: "education", name: "Education & Course", category: "BUSINESS", title: "Learn Skills. Build Your Future.", ratio: "16:9", duration: 15, accent: "#dff4ff", background: "linear-gradient(145deg,#8bc9e8,#417fa2 55%,#24465b)", description: "Course and coaching ad" },
  { id: "fitness", name: "Gym & Fitness", category: "BUSINESS", title: "Stronger Every Day", ratio: "9:16", duration: 15, accent: "#e2f5d8", background: "linear-gradient(145deg,#9fcb86,#4b7951 55%,#233c34)", description: "Fitness and gym campaign" },
  { id: "travel", name: "Travel & Tourism", category: "SOCIAL", title: "Your Next Adventure Awaits", ratio: "16:9", duration: 15, accent: "#d8f5f3", background: "linear-gradient(145deg,#8bd6cb,#397f91 55%,#25404f)", description: "Destination highlight reel" },
  { id: "restaurant", name: "Restaurant Menu", category: "FOOD", title: "Delicious Deals Just for You", ratio: "9:16", duration: 10, accent: "#ffe4c4", background: "linear-gradient(145deg,#f0b66f,#bc603e 55%,#542d29)", description: "Menu and special dishes" },
  { id: "bakery", name: "Bakery & Cafe", category: "FOOD", title: "Baked Fresh Every Day", ratio: "1:1", duration: 10, accent: "#f9e7cf", background: "linear-gradient(145deg,#e5bd8d,#a97954 55%,#4b3a35)", description: "Fresh bakery and cafe promo" },
  { id: "discount", name: "Flash Discount", category: "OFFER", title: "LIMITED TIME · SHOP NOW", ratio: "9:16", duration: 10, accent: "#ffe0df", background: "linear-gradient(145deg,#ff9c7e,#d34848 55%,#60273c)", description: "Urgency-led discount offer" },
  { id: "newyear", name: "New Year Offer", category: "FESTIVAL", title: "New Year. New Beginnings.", ratio: "1:1", duration: 10, accent: "#fff0c9", background: "linear-gradient(145deg,#f4d48a,#a87b59 55%,#39435b)", description: "Seasonal campaign greeting" },
  { id: "testimonial", name: "Customer Testimonial", category: "BUSINESS", title: "Loved by Our Customers", ratio: "16:9", duration: 15, accent: "#e0f8ed", background: "linear-gradient(145deg,#9ad8bd,#438c79 55%,#23483f)", description: "Review and trust builder" },
  { id: "sale-square", name: "Square Sale Post", category: "OFFER", title: "SPECIAL PRICE · TODAY ONLY", ratio: "1:1", duration: 10, accent: "#ffe5d8", background: "linear-gradient(145deg,#ffb17c,#d45b50 55%,#62334a)", description: "Square social offer creative" },
  { id: "portfolio", name: "Creator Portfolio", category: "SOCIAL", title: "This Is My Creative World", ratio: "16:9", duration: 15, accent: "#e8e5ff", background: "linear-gradient(145deg,#b3b0ee,#7166a9 55%,#34304c)", description: "Showreel and personal brand" }
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return m + ":" + s;
};

export default function EditorPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("Your brand. Your story.");
  const [ratio, setRatio] = useState("9:16");
  const [status, setStatus] = useState("Import media to start your first project");
  const [exporting, setExporting] = useState(false);
  const [duration, setDuration] = useState(5);
  const [activeTemplate, setActiveTemplate] = useState("reel");
  const [templateCategory, setTemplateCategory] = useState("ALL");
  const categories = ["ALL", "PRODUCT", "BUSINESS", "OFFER", "SOCIAL", "EVENT", "FOOD", "FESTIVAL", "TECH"];
  const visibleTemplates = promoTemplates.filter((template) => templateCategory === "ALL" || template.category === templateCategory);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const importFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const added = files.map((file) => {
      const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : null;
      if (!kind) return null;
      return { id: crypto.randomUUID(), file, url: URL.createObjectURL(file), kind, duration: kind === "image" ? 5 : 0 } as MediaItem;
    }).filter((item): item is MediaItem => item !== null);
    if (!added.length) {
      setStatus("Please choose video, image or audio files.");
      return;
    }
    setItems((current) => [...current, ...added]);
    setSelectedId((current) => current || added.find((item) => item.kind !== "audio")?.id || added[0].id);
    setStatus(added.length + " media file(s) imported successfully.");
    event.target.value = "";
  };

  const removeItem = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (item) URL.revokeObjectURL(item.url);
    const next = items.filter((entry) => entry.id !== id);
    setItems(next);
    if (selectedId === id) setSelectedId(next.find((entry) => entry.kind !== "audio")?.id || "");
    setStatus("Clip removed from timeline.");
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, source: HTMLVideoElement | HTMLImageElement, width: number, height: number) => {
    ctx.fillStyle = "#101b18";
    ctx.fillRect(0, 0, width, height);
    const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
    if (!sw || !sh) return;
    const scale = Math.max(width / sw, height / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
    if (title.trim()) {
      const fontSize = Math.round(width * 0.055);
      ctx.font = "700 " + fontSize + "px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.shadowColor = "rgba(0,0,0,.65)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = promoTemplates.find((template) => template.id === activeTemplate)?.accent || "#ffffff";
      const words = title.trim().split(/\s+/);
      const lines: string[] = [];
      let line = "";
      words.forEach((word) => {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > width * 0.84 && line) { lines.push(line); line = word; } else line = test;
      });
      if (line) lines.push(line);
      lines.slice(-3).forEach((text, index, arr) => ctx.fillText(text, width / 2, height - height * 0.09 - (arr.length - 1 - index) * fontSize * 1.2, width * 0.88));
      ctx.shadowBlur = 0;
    }
  };

  const exportVideo = async () => {
    if (!selected || selected.kind === "audio") {
      setStatus("Select a video or image clip before exporting.");
      return;
    }
    if (!canvasRef.current) return;
    if (typeof MediaRecorder === "undefined" || !canvasRef.current.captureStream) {
      setStatus("Video export is not supported in this browser. Try the latest Chrome or Edge.");
      return;
    }
    setExporting(true);
    setStatus("Preparing your video export…");
    const canvas = canvasRef.current;
    const [w, h] = ratio === "16:9" ? [1920, 1080] : ratio === "1:1" ? [1080, 1080] : [1080, 1920];
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setExporting(false); return; }
    const video = videoRef.current;
    const image = imageRef.current;
    const source = selected.kind === "video" ? video : image;
    if (!source) { setStatus("Preview is still loading. Please try again."); setExporting(false); return; }
    try {
      if (selected.kind === "video" && video) {
        if (video.readyState < 2) await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject(new Error("Video could not be loaded."));
        });
        video.currentTime = 0;
        await video.play();
      } else if (image && !image.complete) {
        await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Image could not be loaded.")); });
      }
      const stream = canvas.captureStream(30);
      if (selected.kind === "video" && video) {
        const capture = (video as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream });
        const mediaStream = capture.captureStream?.() || capture.mozCaptureStream?.();
        mediaStream?.getAudioTracks().forEach((track) => stream.addTrack(track));
      }
      const mime = ["video/mp4;codecs=h264,aac", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 5_000_000 } : undefined);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { setStatus("Export failed. Please try another browser or a shorter clip."); setExporting(false); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "promo-studio-export." + (blob.type.includes("mp4") ? "mp4" : "webm");
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        stream.getTracks().forEach((track) => track.stop());
        setExporting(false);
        setStatus("Export complete. Your video has been downloaded.");
      };
      recorder.start(250);
      const render = () => {
        if (selected.kind === "video" && video) drawFrame(ctx, video, w, h);
        else if (image) drawFrame(ctx, image, w, h);
        if (selected.kind === "video" && video && (video.ended || video.paused)) {
          if (recorder.state !== "inactive") recorder.stop();
          return;
        }
        rafRef.current = requestAnimationFrame(render);
      };
      render();
      if (selected.kind === "image") {
        window.setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, Math.max(2, duration) * 1000);
      } else if (video) {
        video.onended = () => { if (recorder.state !== "inactive") recorder.stop(); };
      }
      setStatus("Recording your edited preview…");
    } catch (error) {
      setExporting(false);
      setStatus(error instanceof Error ? error.message : "Could not export this media.");
    }
  };

  const audioItem = items.find((item) => item.kind === "audio");
  const applyTemplate = (template: PromoTemplate) => { setActiveTemplate(template.id); setTitle(template.title); setRatio(template.ratio); setDuration(template.duration); setStatus(template.name + " template selected. Import your own media to personalise it."); };

  return <main className="editorShell">
    <header className="editorTop">
      <Link href="/" className="editorBrand"><span className="editorMark">PS</span><span>Promo Studio</span></Link>
      <div className="editorTopRight"><span className="saveHint">Local project · Your files stay on this device</span><button className="exportBtn" onClick={exportVideo} disabled={exporting || !selected}>{exporting ? "Exporting…" : "Export video ↓"}</button></div>
    </header>
    <div className="editorLayout">
      <aside className="mediaPanel">
        <div className="panelTitle"><div><span className="panelKicker">WORKSPACE</span><h2>Media library</h2></div><button className="addMedia" onClick={() => fileInputRef.current?.click()}>＋ Add</button></div>
        <input ref={fileInputRef} type="file" accept="video/*,image/*,audio/*" multiple hidden onChange={importFiles} />
        <button className="uploadBox" onClick={() => fileInputRef.current?.click()}><span className="uploadIcon">↑</span><strong>Import your media</strong><small>Video, images and audio</small></button>
        <div className="mediaList">{items.map((item) => <div key={item.id} className={"mediaItem " + (selectedId === item.id ? "active" : "")} onClick={() => item.kind !== "audio" ? setSelectedId(item.id) : setStatus("Audio is imported. Audio mixing will be added in the next editor milestone.")}>
          <div className="mediaThumb">{item.kind === "image" ? <img src={item.url} alt="" /> : item.kind === "video" ? <span>▶</span> : <span>♫</span>}</div>
          <div className="mediaMeta"><strong>{item.file.name}</strong><small>{item.kind.toUpperCase()} · {(item.file.size / (1024 * 1024)).toFixed(1)} MB</small></div>
          <button className="removeMedia" aria-label="Remove media" onClick={(event) => { event.stopPropagation(); removeItem(item.id); }}>×</button>
        </div>)}</div>
        {audioItem && <div className="audioPreview"><small>IMPORTED AUDIO</small><audio controls src={audioItem.url} /></div>}
        <div className="panelFoot">Promo Studio · By PaliaAPK HUB</div>
      </aside>
      <section className="workArea">
        <div className="workHeading"><div><span className="panelKicker">VIDEO EDITOR</span><h1>Untitled project</h1></div><span className="localBadge">● Local editing</span></div>
        <section className="templatePicker">
          <div className="templatePickerHead"><div><span className="panelKicker">QUICK START</span><h2>Choose a video template</h2><p>Pick a style to set up your project instantly</p></div><span className="templateCount">{promoTemplates.length} ready-made styles</span></div>
          <div className="templateCategories">{categories.map((category) => <button key={category} className={templateCategory === category ? "categoryChip activeCategory" : "categoryChip"} onClick={() => setTemplateCategory(category)}>{category === "ALL" ? "All templates" : category[0] + category.slice(1).toLowerCase()}</button>)}</div>
          <div className="templateGrid">{visibleTemplates.map((template) => <button key={template.id} className={"templateCard " + (activeTemplate === template.id ? "selectedTemplate" : "")} onClick={() => applyTemplate(template)}><span className="templateArtwork" style={{ background: template.background }}><span className="templateArtworkTag">{template.category}</span><strong>{template.title}</strong><small>YOUR BRAND</small></span><span className="templateCardInfo"><strong>{template.name}</strong><small>{template.description} · {template.ratio}</small></span>{activeTemplate === template.id && <span className="templateCheck">✓ Selected</span>}</button>)}</div>
        </section>
        <div className="stage">
          <div className={"previewFrame ratio" + ratio.replace(":", "-")}>
            {selected?.kind === "video" ? <video ref={videoRef} key={selected.id} src={selected.url} controls playsInline /> : selected?.kind === "image" ? <img ref={imageRef} key={selected.id} src={selected.url} alt="Selected media preview" /> : <div className="emptyStage"><div className="emptyPlay">▶</div><strong>Your preview appears here</strong><span>Import a video or image to begin</span><button onClick={() => fileInputRef.current?.click()}>＋ Import media</button></div>}
            {selected && <div className={"titleOverlay templateTitle " + "title-" + activeTemplate}>{title}</div>}
          </div>
        </div>
        <div className="editControls">
          <label className="controlField">Canvas size<select value={ratio} onChange={(event) => setRatio(event.target.value)}><option>9:16</option><option>16:9</option><option>1:1</option></select></label>
          <label className="controlField titleField">Text overlay<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Type your promotional title" maxLength={90} /></label>
          <label className="controlField">Image length<select value={duration} onChange={(event) => setDuration(Number(event.target.value))}><option value={5}>5 sec</option><option value={10}>10 sec</option><option value={15}>15 sec</option><option value={30}>30 sec</option></select></label>
        </div>
        <section className="timelinePanel">
          <div className="timelineHead"><div><span className="panelKicker">SEQUENCE</span><h2>Timeline</h2></div><span>{items.filter((item) => item.kind !== "audio").length} visual clips</span></div>
          <div className="timelineRuler"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span><span>00:20</span></div>
          <div className="timelineTrack"><span className="trackLabel">MEDIA</span><div className="trackItems">{items.filter((item) => item.kind !== "audio").map((item, index) => <button key={item.id} className={"clipBlock " + (selectedId === item.id ? "chosen" : "")} onClick={() => setSelectedId(item.id)}><span>{index + 1}. {item.file.name}</span><small>{item.kind}</small></button>)}{!items.some((item) => item.kind !== "audio") && <span className="trackEmpty">Import media to populate your timeline</span>}</div></div>
          <div className="timelineTrack textTrack"><span className="trackLabel">TEXT</span><div className="textClip">{title || "Add a title using the text field above"}</div></div>
          <div className="statusLine"><span className={exporting ? "statusDot busy" : "statusDot"} />{status}</div>
        </section>
        <p className="editorNotice">Templates are selectable and automatically set the title, aspect ratio and image duration. Add your own photos or videos to personalise the design. Multi-clip transitions, audio mixing and cloud projects are next.</p>
      </section>
    </div>
    <canvas ref={canvasRef} className="exportCanvas" />
  </main>;
}
