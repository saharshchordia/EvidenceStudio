"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "tour" | "ontology" | "unit";

const moments = [2, 4, 6, 8, 11, 14, 17, 20, 23, 26, 29, 32];

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

const analysisFindings = [
  { object: "Appliances", finding: "High quality", confidence: "94%" },
  { object: "Cabinets", finding: "Update color", confidence: "91%" },
  { object: "Countertops", finding: "Further diligence", confidence: "87%" },
];

const kitchenDetections = [
  { label: "Fridge", confidence: "98%", track: { left: [0.8, 22], top: [34, 35], width: [9.2, 20], height: [40, 47] } },
  { label: "Oven", confidence: "97%", track: { left: [45.2, 85], top: [41, 43], width: [16.8, 18], height: [37, 41] } },
  { label: "Countertop", confidence: "94%", track: { left: [3.2, 38], top: [61.5, 66], width: [42, 60], height: [11, 15] } },
  { label: "Cabinets", confidence: "96%", track: { left: [5, 25], top: [12, 8], width: [56, 75], height: [38, 49] } },
];

const observedUnits = [
  "101", "102", "103", "104", "105", "106", "107", "108",
  "201", "202", "203", "204", "205", "206", "207", "208",
  "301", "302", "303", "304", "305", "306", "307", "308",
  "401", "402", "403", "404", "405", "406", "407",
];

function Filmstrip({ videoSrc }: { videoSrc: string }) {
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
        <div className={time === 4 ? "frame active" : "frame"} key={time} aria-label={`${time} second tour moment`}>
          <canvas ref={(element) => { refs.current[index] = element; }} width="112" height="74" />
          <span>{String(time).padStart(2, "0")}s</span>
        </div>
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
  const [visionTime, setVisionTime] = useState(0);
  const videoSrc = "./tour-clip-04-12.mp4";
  const trackingProgress = Math.min(visionTime / 1.3, 1);
  const visionVisible = visionTime <= 1.35;
  const interpolate = ([start, end]: number[]) => start + (end - start) * trackingProgress;

  useEffect(() => {
    if (!analyzing) return;
    const interval = window.setInterval(() => {
      setAnalysisIndex((value) => Math.min(value + 1, analysisFindings.length));
    }, 680);
    const timeout = window.setTimeout(onAnalyze, 3100);
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
          <span>Tour 01</span><span>1080p video</span><span>8.0 sec</span>
        </div>
      </section>

      <section className="tour-workspace">
        <div className="video-shell">
          <video controls preload="metadata" poster="./unit-evidence-04s.jpg" src={videoSrc} aria-label="Property tour video" onTimeUpdate={(event) => setVisionTime(event.currentTarget.currentTime)} onSeeked={(event) => setVisionTime(event.currentTarget.currentTime)} />
          {!analyzing && (
            <div className={`vision-overlay ${visionVisible ? "visible" : ""}`} aria-label="Computer vision detections" aria-hidden={!visionVisible}>
              <div className="vision-status"><span /> Kitchen detected <strong>4 objects tracked</strong></div>
              {kitchenDetections.map((detection) => (
                <div
                  className="detection-box"
                  key={detection.label}
                  style={{
                    left: `${interpolate(detection.track.left)}%`,
                    top: `${interpolate(detection.track.top)}%`,
                    width: `${interpolate(detection.track.width)}%`,
                    height: `${interpolate(detection.track.height)}%`,
                  }}
                >
                  <span>{detection.label}</span><small>{detection.confidence}</small>
                </div>
              ))}
            </div>
          )}
          {analyzing && (
            <div className="analysis-overlay" role="status" aria-live="polite">
              <div className="scan-line" />
              <div className="analysis-findings">
                <div className="analysis-findings-head"><span>Live findings</span><strong>{Math.min(analysisIndex, analysisFindings.length)} / {analysisFindings.length}</strong></div>
                {analysisFindings.map((finding, index) => (
                  <div className={`analysis-finding ${index < analysisIndex ? "visible" : ""}`} key={finding.object}>
                    <span className="finding-check">✓</span>
                    <div><small>{finding.object}</small><strong>{finding.finding}</strong></div>
                    <b>{finding.confidence}</b>
                  </div>
                ))}
              </div>
              <div className="analysis-status">
                <span className="status-pulse" />
                <div>
                  <strong>Analyzing asset tour</strong>
                  <p>{analysisIndex < analysisFindings.length ? `Classifying ${analysisFindings[analysisIndex].object.toLowerCase()}` : "Linking findings to asset ontology"}</p>
                </div>
                <span className="analysis-count">{Math.min(12, 3 + analysisIndex * 3)} objects</span>
              </div>
            </div>
          )}
        </div>
        <aside className="tour-summary">
          <p className="eyebrow">Ready for analysis</p>
          <h2>Turn a walkthrough into an underwriting record.</h2>
          <p>Identify spaces, finishes, condition signals and supporting moments from the tour.</p>
          <dl>
            <div><dt>Source</dt><dd>Tour excerpt · 00:04–00:12</dd></div>
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
  const [inventoryView, setInventoryView] = useState<"summary" | "coverage" | "observed">("summary");

  const openInventory = () => {
    setSelected("309 units");
    setInventoryView("coverage");
  };

  const openObserved = () => {
    setSelected("31 observed");
    setInventoryView("observed");
  };

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
            <button className={`units-node ${selected === "309 units" ? "selected" : ""}`} onClick={openInventory} aria-expanded={inventoryView !== "summary"}>
              <span className="unit-glyph">U</span><strong>309 units</strong><span className="warning">1 flag</span><small>31 observed</small>
            </button>
            {inventoryView !== "summary" && (
              <div className="inventory-breakdown">
                <button className={`coverage-node observed ${selected === "31 observed" ? "selected" : ""}`} onClick={openObserved} aria-expanded={inventoryView === "observed"}>
                  <span className="coverage-count">31</span><span><strong>Observed units</strong><small>Evidence available</small></span><b>10%</b>
                </button>
                <div className="coverage-node unobserved">
                  <span className="coverage-count">278</span><span><strong>Not observed</strong><small>Coverage gap</small></span><b>90%</b>
                </div>
              </div>
            )}
            {inventoryView === "observed" && (
              <div className="observed-units" aria-label="31 observed units">
                <div className="observed-units-head"><strong>31 observed</strong><span>Select a unit</span></div>
                <div className="unit-chip-grid">
                  {observedUnits.map((unit, index) => index === 0 ? (
                    <button key={unit} className="unit-chip first" onClick={onUnit} aria-label="Unit 101, open insights" data-testid="open-unit">
                      <span>U</span>{unit}<b>→</b>
                    </button>
                  ) : (
                    <div key={unit} className="unit-chip" aria-label={`Unit ${unit}, observed`}>
                      <span>U</span>{unit}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="canvas-footnote"><span className="legend-dot green" /> Observed / evidence linked <span className="legend-dot gray" /> Not observed <span className="legend-dot blue" /> Selected object</div>
      </section>
    </main>
  );
}

function Delta({ label, before, after, tone, reason }: { label: string; before: string; after: string; tone: string; reason?: React.ReactNode }) {
  return (
    <div className="delta-row">
      <span>{label}</span>
      <div><s>{before}</s><strong className={tone}>{after}</strong></div>
      {reason && <div className="delta-reason">{reason}</div>}
    </div>
  );
}

function UnitStage() {
  const videoSrc = "./99-west-paces-tour.mov";
  const [applied, setApplied] = useState(true);

  return (
    <main className="stage unit-stage">
      <section className="stage-heading compact unit-heading">
        <div><p className="eyebrow">Residential inventory / observed unit</p><h1>Unit 101 interiors</h1><p className="subtitle">31 observations · 15 evidence moments</p></div>
        <span className="review-state">Review complete</span>
      </section>

      <section className="unit-grid">
        <aside className="evidence-rail">
          <div className="evidence-summary">
            <span className="spark">✦</span>
            <div><p className="eyebrow">Synthesis</p><strong>Renovated finishes support a moderate rent premium.</strong></div>
          </div>
          <p className="rail-label">Tour moments</p>
          <Filmstrip videoSrc={videoSrc} />
          <div className="finding-list">
            <div className="finding-item active">
              <span>04s</span><div><strong>Updated kitchen</strong><small>8 supporting frames</small></div><b>96%</b>
            </div>
          </div>
        </aside>

        <section className="finding-focus">
          <figure className="focus-image"><img src="./unit-evidence-04s.jpg" alt="Observed kitchen finishes at 4 seconds in the unit tour" /><figcaption>Source frame · 00:04</figcaption></figure>
          <div className="finding-copy">
            <div><p className="eyebrow">Finding · 96% confidence</p><h2>Updated kitchen finishes</h2><p>Dark shaker cabinets, light stone-look counters, stainless steel appliances and white tile backsplash.</p></div>
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
          <Delta label="Renovation budget" before="$18,500 / unit" after="$15,250 / unit" tone="positive" reason={<><strong>Scope refined</strong><p>Repaint cabinets; do not replace the observed stainless steel appliances.</p></>} />
          <Delta label="Market rent" before="$1,925 / mo" after="$2,015 / mo" tone="positive" reason={<><strong>Comp set adjusted</strong><p>Mark to a slightly higher-quality comp supported by the observed finish package.</p></>} />
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
