"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "tour" | "ontology" | "unit";

const moments = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];

const amenityGroups = [
  {
    title: "Shared spaces",
    items: ["Clubhouse lounge", "Lobby", "Leasing center", "Resident lounge"],
  },
  {
    title: "Resident services",
    items: ["Mail room", "Bike storage", "Pet spa", "Wellness club"],
  },
  {
    title: "Amenities",
    items: ["Pool", "Conference room", "Media lounge", "The patio"],
  },
];

const analysisSteps = [
  "Reading video metadata",
  "Segmenting spaces",
  "Identifying materials & finishes",
  "Linking evidence to underwriting",
];

function Filmstrip({ videoSrc, onSeek }: { videoSrc: string; onSeek: (time: number) => void }) {
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    const renderFrame = async (time: number, index: number) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.src = videoSrc;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Video frame unavailable"));
      });
      video.currentTime = Math.min(time, Math.max(0, video.duration - 0.2));
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
      if (cancelled) return;
      const canvas = refs.current[index];
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    Promise.allSettled(moments.map(renderFrame));
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  return (
    <div className="filmstrip" aria-label="Tour moments">
      {moments.map((time, index) => (
        <button className={index === 4 ? "frame active" : "frame"} key={time} aria-label={`Jump to ${time} seconds`} onClick={() => onSeek(time)}>
          <canvas ref={(element) => { refs.current[index] = element; }} width="112" height="74" />
          <span>{String(time).padStart(2, "0")}s</span>
        </button>
      ))}
    </div>
  );
}

function Progress({ stage, onChange }: { stage: Stage; onChange: (stage: Stage) => void }) {
  const steps: { id: Stage; label: string; meta: string }[] = [
    { id: "tour", label: "Tour", meta: "source" },
    { id: "ontology", label: "Asset ontology", meta: "19 spaces" },
    { id: "unit", label: "Unit insights", meta: "31 findings" },
  ];
  const activeIndex = steps.findIndex((step) => step.id === stage);

  return (
    <nav className="progress" aria-label="Analysis progress">
      {steps.map((step, index) => (
        <button
          key={step.id}
          className={`progress-step ${index <= activeIndex ? "complete" : ""} ${step.id === stage ? "current" : ""}`}
          onClick={() => onChange(step.id)}
          aria-current={step.id === stage ? "step" : undefined}
        >
          <span className="step-dot">{index < activeIndex ? "✓" : index + 1}</span>
          <span><strong>{step.label}</strong><small>{step.meta}</small></span>
        </button>
      ))}
    </nav>
  );
}

function TourStage({ onAnalyze }: { onAnalyze: () => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const videoSrc = "./99-west-paces-tour.mov";

  useEffect(() => {
    if (!analyzing) return;
    const interval = window.setInterval(() => {
      setAnalysisIndex((value) => Math.min(value + 1, analysisSteps.length - 1));
    }, 520);
    const timeout = window.setTimeout(onAnalyze, 2450);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [analyzing, onAnalyze]);

  return (
    <main className="stage tour-stage">
      <section className="stage-heading">
        <div>
          <p className="eyebrow">Source record</p>
          <h1>99 West Paces</h1>
          <p className="subtitle">Asset tour · 309 units · Atlanta, GA</p>
        </div>
        <div className="source-meta">
          <span>Tour 01</span><span>1080p video</span><span>35.6 sec</span>
        </div>
      </section>

      <section className="tour-workspace">
        <div className="video-shell">
          <video controls preload="metadata" src={videoSrc} aria-label="Property tour video" />
          {analyzing && (
            <div className="analysis-overlay" role="status" aria-live="polite">
              <div className="scan-line" />
              <div className="analysis-status">
                <span className="status-pulse" />
                <div>
                  <strong>Analyzing asset tour</strong>
                  <p>{analysisSteps[analysisIndex]}</p>
                </div>
                <span className="analysis-count">{Math.min(19, 4 + analysisIndex * 5)} spaces</span>
              </div>
            </div>
          )}
        </div>
        <aside className="tour-summary">
          <p className="eyebrow">Ready for analysis</p>
          <h2>Turn a walkthrough into an underwriting record.</h2>
          <p>Identify spaces, finishes, condition signals and supporting moments from the tour.</p>
          <dl>
            <div><dt>File</dt><dd>99 West Paces Video.MOV</dd></div>
            <div><dt>Resolution</dt><dd>1920 × 1080</dd></div>
            <div><dt>Captured</dt><dd>Property walkthrough</dd></div>
          </dl>
          <button className="primary-action" onClick={() => setAnalyzing(true)} disabled={analyzing} data-testid="analyze-tour">
            {analyzing ? "Analyzing…" : "Analyze tour"}
          </button>
        </aside>
      </section>
    </main>
  );
}

function OntologyStage({ onUnit }: { onUnit: () => void }) {
  const [selected, setSelected] = useState("309 units");

  return (
    <main className="stage ontology-stage">
      <section className="stage-heading compact">
        <div>
          <p className="eyebrow">Analysis complete</p>
          <h1>Asset ontology</h1>
          <p className="subtitle">Every space grounded in source evidence</p>
        </div>
        <div className="analysis-stats"><span><strong>1</strong> asset</span><span><strong>19</strong> spaces</span><span><strong>31</strong> units observed</span><span><strong>1,244</strong> facts</span></div>
      </section>

      <section className="ontology-toolbar">
        <div className="filter-tabs"><button className="active">Graph</button><button>List</button></div>
        <label><span>Find an object</span><input placeholder="Search ontology" /></label>
      </section>

      <section className="ontology-canvas">
        <div className="asset-root"><span className="node-icon">A</span><strong>99 West Paces</strong><small>canonical asset</small></div>
        <div className="graph-trunk" />
        <div className="ontology-branches">
          {amenityGroups.map((group, groupIndex) => (
            <div className="branch" key={group.title} style={{ "--delay": `${groupIndex * 90}ms` } as React.CSSProperties}>
              <div className="branch-label">{group.title}<span>{group.items.length}</span></div>
              <div className="branch-items">
                {group.items.map((item) => (
                  <button key={item} onClick={() => setSelected(item)} className={selected === item ? "selected" : ""}>
                    <span className="space-glyph" />{item}<small>{item === "Clubhouse lounge" ? "4" : ""}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="branch units-branch">
            <div className="branch-label">Residential inventory<span>309</span></div>
            <button className="units-node selected" onClick={() => setSelected("309 units")}>
              <span className="unit-glyph">U</span><strong>309 units</strong><span className="warning">1 flag</span><small>31 observed</small>
            </button>
            <button className="secondary-action" onClick={onUnit} data-testid="open-unit">Open unit insights <span>→</span></button>
          </div>
        </div>
        <div className="canvas-footnote"><span className="legend-dot green" /> Confirmed space <span className="legend-dot blue" /> Selected object</div>
      </section>
    </main>
  );
}

function Delta({ label, before, after, tone }: { label: string; before: string; after: string; tone: string }) {
  return (
    <div className="delta-row">
      <span>{label}</span>
      <div><s>{before}</s><strong className={tone}>{after}</strong></div>
    </div>
  );
}

function UnitStage() {
  const videoSrc = "./99-west-paces-tour.mov";
  const evidenceVideo = useRef<HTMLVideoElement | null>(null);
  const [finding, setFinding] = useState("kitchen");
  const [applied, setApplied] = useState(true);
  const findingCopy = useMemo(() => finding === "kitchen" ? {
    title: "Updated kitchen finishes",
    body: "Dark shaker cabinets, light stone-look counters, stainless steel appliances and white tile backsplash.",
    confidence: "96% confidence",
  } : {
    title: "Standard bathroom condition",
    body: "Clean, serviceable fixtures with no visible deferred maintenance. Cosmetic refresh only.",
    confidence: "91% confidence",
  }, [finding]);

  return (
    <main className="stage unit-stage">
      <section className="stage-heading compact unit-heading">
        <div><p className="eyebrow">Residential inventory / observed unit</p><h1>Unit interiors</h1><p className="subtitle">31 observations · 15 evidence moments</p></div>
        <span className="review-state">Review complete</span>
      </section>

      <section className="unit-grid">
        <aside className="evidence-rail">
          <div className="evidence-summary">
            <span className="spark">✦</span>
            <div><p className="eyebrow">Synthesis</p><strong>Renovated finishes support a moderate rent premium.</strong></div>
          </div>
          <p className="rail-label">Tour moments</p>
          <Filmstrip videoSrc={videoSrc} onSeek={(time) => {
            if (!evidenceVideo.current) return;
            evidenceVideo.current.currentTime = time;
            evidenceVideo.current.play().catch(() => undefined);
          }} />
          <div className="finding-list">
            <button className={finding === "kitchen" ? "active" : ""} onClick={() => setFinding("kitchen")}>
              <span>05s</span><div><strong>Updated kitchen</strong><small>8 supporting frames</small></div><b>96%</b>
            </button>
            <button className={finding === "bath" ? "active" : ""} onClick={() => setFinding("bath")}>
              <span>28s</span><div><strong>Standard bathroom</strong><small>4 supporting frames</small></div><b>91%</b>
            </button>
          </div>
        </aside>

        <section className="finding-focus">
          <div className="focus-video"><video ref={evidenceVideo} controls preload="metadata" src={videoSrc} aria-label="Evidence moment from unit tour" /></div>
          <div className="finding-copy">
            <div><p className="eyebrow">Finding · {findingCopy.confidence}</p><h2>{findingCopy.title}</h2><p>{findingCopy.body}</p></div>
            <span className="verified">Evidence linked</span>
          </div>
          <div className="evidence-note">
            <span className="quote-mark">“</span>
            <p>The unit interior consistently shows a basic-to-standard finish package with recently updated kitchen millwork and appliances.</p>
            <small>Transcript · 00:04–00:18</small>
          </div>
        </section>

        <aside className="impact-rail">
          <div className="impact-head"><div><p className="eyebrow">Underwriting impact</p><h2>Assumptions updated</h2></div><span className="live-dot">3 changes</span></div>
          <Delta label="Renovation budget" before="$18,500 / unit" after="$12,800 / unit" tone="positive" />
          <Delta label="Market rent" before="$1,925 / mo" after="$2,015 / mo" tone="positive" />
          <Delta label="Finish quality" before="6.2 / 10" after="7.8 / 10" tone="quality" />
          <div className="impact-total">
            <span>Modeled NOI impact</span><strong>+$284K</strong><small>annualized · observed units extrapolated</small>
          </div>
          <label className="apply-toggle"><input type="checkbox" checked={applied} onChange={(event) => setApplied(event.target.checked)} /><span /><div><strong>Apply to underwriting</strong><small>{applied ? "Changes included in scenario" : "Changes held for review"}</small></div></label>
          <div className="method-note"><strong>Basis</strong><p>31 observed units · 15 evidence moments · 3 finish categories</p></div>
        </aside>
      </section>
    </main>
  );
}

export default function TourIntelligence() {
  const [stage, setStage] = useState<Stage>("tour");
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wordmark"><span className="mark">E</span><span>Asset intelligence</span></div>
        <Progress stage={stage} onChange={setStage} />
        <div className="header-status"><span /> Analysis workspace</div>
      </header>
      {stage === "tour" && <TourStage onAnalyze={() => setStage("ontology")} />}
      {stage === "ontology" && <OntologyStage onUnit={() => setStage("unit")} />}
      {stage === "unit" && <UnitStage />}
    </div>
  );
}
