"use client";
import { pipelineStages } from "@/lib/data";

const GRADIENTS = [
  "linear-gradient(90deg, #4f8cff, #06b6d4)",
  "linear-gradient(90deg, #a855f7, #4f8cff)",
  "linear-gradient(90deg, #ec4899, #a855f7)",
  "linear-gradient(90deg, #f59e0b, #ec4899)",
  "linear-gradient(90deg, #fbbf24, #f59e0b)",
  "linear-gradient(90deg, #10b981, #fbbf24)",
  "linear-gradient(90deg, #06b6d4, #10b981)",
  "linear-gradient(90deg, #6366f1, #06b6d4)",
];

export default function PipelineStages() {
  return (
    <div className="pipeline-grid">
      {pipelineStages.map((s, i) => (
        <div
          key={s.stage}
          className="glass pipeline-card fade-in"
          style={{
            animationDelay: `${i * 0.08}s`,
            // @ts-ignore
            "--stage-gradient": GRADIENTS[i],
          }}
        >
          <div className="stage-icon">{s.icon}</div>
          <div className="stage-number">{s.stage}</div>
          <div className="stage-title">{s.title}</div>
          <div className="stage-desc">{s.description}</div>
          <div className="stage-output">→ {s.output}</div>
        </div>
      ))}
    </div>
  );
}
