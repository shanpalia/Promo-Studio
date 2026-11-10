"use client";
import "./editor.css";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type MediaItem = { id: string; file: File; url: string; kind: "video" | "image" | "audio"; duration: number };

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
      ctx.fillStyle = "#ffffff";
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
        <div className="stage">
          <div className={"previewFrame ratio" + ratio.replace(":", "-")}>
            {selected?.kind === "video" ? <video ref={videoRef} key={selected.id} src={selected.url} controls playsInline /> : selected?.kind === "image" ? <img ref={imageRef} key={selected.id} src={selected.url} alt="Selected media preview" /> : <div className="emptyStage"><div className="emptyPlay">▶</div><strong>Your preview appears here</strong><span>Import a video or image to begin</span><button onClick={() => fileInputRef.current?.click()}>＋ Import media</button></div>}
            {selected && <div className="titleOverlay">{title}</div>}
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
        <p className="editorNotice">First working editor milestone: import, preview, title overlay and clip export. Multi-clip transitions, audio mixing, project cloud sync and advanced trimming are next.</p>
      </section>
    </div>
    <canvas ref={canvasRef} className="exportCanvas" />
  </main>;
}
