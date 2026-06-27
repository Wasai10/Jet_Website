import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Search, Zap } from "lucide-react";
import type { SeoAnalysisResult } from "@/api/blogs.service";

interface Props {
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  canonicalIsManual: boolean;
  onCanonicalReset: () => void;
  noIndex: boolean;
  noFollow: boolean;
  analysis: SeoAnalysisResult | null;
  analyzeLoading: boolean;
  titleFallback: string;
  onChange: (field: string, value: string | boolean) => void;
  onAnalyze: () => void;
}

const GRADE_COLOR: Record<string, string> = {
  A: "#22C55E",
  B: "#0096FF",
  C: "#F59E0B",
  D: "#EF4444",
};

function ScoreBar({ score, grade, label }: { score: number; grade: string; label: string }) {
  const color = GRADE_COLOR[grade] ?? "#0096FF";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-muted-foreground text-xs">{label}</span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold"
            style={{ background: `${color}20`, color }}
          >
            {grade}
          </span>
          <span className="text-muted-foreground/60 text-xs">{score} / 100</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const ok = len >= min && len <= max;
  const over = len > max;
  return (
    <span className={`text-xs ${over ? "text-[#EF4444]" : ok ? "text-[#22C55E]" : "text-muted-foreground/50"}`}>
      {len} / {max}
    </span>
  );
}

export default function SeoPanel({
  focusKeyword, seoTitle, seoDescription, ogImage, ogTitle, ogDescription,
  canonicalUrl, canonicalIsManual, onCanonicalReset,
  noIndex, noFollow, analysis, analyzeLoading,
  titleFallback, onChange, onAnalyze,
}: Props) {
  const [checksOpen, setChecksOpen] = useState(false);
  const [ogOpen, setOgOpen] = useState(false);

  const inputCls = "w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs placeholder-muted-foreground/40 outline-none focus:border-primary/50 transition-colors resize-none";
  const labelCls = "block text-muted-foreground text-xs mb-1";

  return (
    <div className="space-y-4">
      {/* Focus keyword */}
      <div>
        <label className={labelCls}>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Search className="w-3 h-3" /> Focus keyword
          </span>
        </label>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => onChange("focusKeyword", e.target.value)}
          placeholder="e.g. church community"
          className={inputCls}
        />
        <p className="text-muted-foreground/60 text-xs mt-1">The primary phrase this post should rank for.</p>
      </div>

      {/* SEO title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-muted-foreground text-xs">SEO title</label>
          <CharCount value={seoTitle || titleFallback} min={40} max={70} />
        </div>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onChange("seoTitle", e.target.value)}
          placeholder={titleFallback || "Title shown in search results…"}
          className={inputCls}
        />
      </div>

      {/* Meta description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-muted-foreground text-xs">Meta description</label>
          <CharCount value={seoDescription} min={120} max={165} />
        </div>
        <textarea
          value={seoDescription}
          onChange={(e) => onChange("seoDescription", e.target.value)}
          placeholder="Short summary shown below the title in search results…"
          rows={3}
          className={inputCls}
        />
      </div>

      {/* Canonical URL */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>Canonical URL</label>
          {canonicalIsManual && (
            <button
              type="button"
              onClick={onCanonicalReset}
              className="text-primary text-[10px] hover:underline cursor-pointer"
            >
              Reset to auto
            </button>
          )}
        </div>
        <input
          type="url"
          value={canonicalUrl}
          onChange={(e) => onChange("canonicalUrl", e.target.value)}
          placeholder="Auto-generated from slug…"
          className={inputCls}
        />
      </div>

      {/* Open Graph (collapsible) */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setOgOpen(!ogOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-muted-foreground text-xs hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <span className="font-medium">Open Graph &amp; Social</span>
          {ogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {ogOpen && (
          <div className="px-3 pb-3 space-y-3 border-t border-border">
            <div className="pt-3">
              <label className={labelCls}>OG image URL</label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => onChange("ogImage", e.target.value)}
                placeholder="https://… (1200×630 recommended)"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>OG title</label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => onChange("ogTitle", e.target.value)}
                placeholder="Override for social sharing…"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>OG description</label>
              <textarea
                value={ogDescription}
                onChange={(e) => onChange("ogDescription", e.target.value)}
                placeholder="Override description for social sharing…"
                rows={2}
                className={inputCls}
              />
            </div>
          </div>
        )}
      </div>

      {/* Robots */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => onChange("noIndex", !noIndex)}
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer
              ${noIndex ? "bg-[#EF4444] border-[#EF4444]" : "bg-transparent border-white/20 group-hover:border-white/40"}`}
          >
            {noIndex && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-muted-foreground text-xs">noIndex</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => onChange("noFollow", !noFollow)}
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer
              ${noFollow ? "bg-[#EF4444] border-[#EF4444]" : "bg-transparent border-white/20 group-hover:border-white/40"}`}
          >
            {noFollow && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-muted-foreground text-xs">noFollow</span>
        </label>
      </div>

      {/* Analyze button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={analyzeLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF]/10 border border-[#0096FF]/20 text-[#0096FF] text-xs font-semibold hover:bg-[#0096FF]/20 hover:border-[#0096FF]/40 transition-all disabled:opacity-50 cursor-pointer"
      >
        {analyzeLoading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing…</>
          : <><Zap className="w-3.5 h-3.5" /> Analyze SEO</>
        }
      </button>

      {/* Score results */}
      {analysis && (
        <div className="space-y-4 pt-1">
          {/* Score bars */}
          <div className="bg-muted/20 border border-border rounded-xl p-3 space-y-3">
            <ScoreBar score={analysis.seo.score} grade={analysis.seo.grade} label="SEO Score" />
            <ScoreBar score={analysis.readability.score} grade={analysis.readability.grade} label="Readability" />
            <div className="flex items-center justify-between text-xs text-muted-foreground/50 pt-1 border-t border-border">
              <span>~{analysis.readingTime} min read</span>
              <span>{analysis.readability.stats.wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Checks list */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setChecksOpen(!checksOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-muted-foreground text-xs hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <span className="font-medium">
                SEO checks — {analysis.seo.passed} / {analysis.seo.total} passed
              </span>
              {checksOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {checksOpen && (
              <div className="border-t border-border divide-y divide-border/50 max-h-64 overflow-y-auto">
                {analysis.seo.checks.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 px-3 py-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${c.pass ? "bg-[#22C55E]/20" : "bg-[#EF4444]/20"}`}>
                      {c.pass
                        ? <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <svg className="w-2.5 h-2.5 text-[#EF4444]" fill="none" viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      }
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{c.message}</p>
                  </div>
                ))}
                {/* Readability checks */}
                {analysis.readability.checks.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 px-3 py-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${c.pass ? "bg-[#22C55E]/20" : "bg-[#F59E0B]/20"}`}>
                      {c.pass
                        ? <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <svg className="w-2.5 h-2.5 text-[#F59E0B]" fill="none" viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      }
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
