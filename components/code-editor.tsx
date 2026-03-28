"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { codeToHtml } from "shiki";
import { Code2, Eye, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { value: "python",     label: "Python" },
  { value: "java",       label: "Java" },
  { value: "cpp",        label: "C++" },
  { value: "c",          label: "C" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "go",         label: "Go" },
  { value: "rust",       label: "Rust" },
  { value: "kotlin",     label: "Kotlin" },
  { value: "swift",      label: "Swift" },
  { value: "csharp",     label: "C#" },
] as const;

type Lang = (typeof LANGUAGES)[number]["value"];

interface Props {
  value: string;
  lang: string;
  onChange: (value: string) => void;
  onLangChange: (lang: string) => void;
}

export function CodeEditor({ value, lang, onChange, onLangChange }: Props) {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [highlighted, setHighlighted] = useState<string>("");
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.value === lang) ?? LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Render highlighted HTML whenever code/lang/theme changes (only when in preview)
  useEffect(() => {
    if (mode !== "preview") return;
    if (!value.trim()) {
      setHighlighted("");
      return;
    }
    const shikiTheme = resolvedTheme === "dark" ? "github-dark-dimmed" : "github-light";
    codeToHtml(value, {
      lang: lang as Lang,
      theme: shikiTheme,
    }).then(html => {
      // Strip any <script> tags Shiki may include — React warns about them in dangerouslySetInnerHTML
      setHighlighted(html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""));
    }).catch(() => {
      setHighlighted(`<pre style="padding:1rem;font-size:0.8rem">${value.replace(/</g, "&lt;")}</pre>`);
    });
  }, [mode, value, lang, resolvedTheme]);

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Solution Code</label>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangOpen(v => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {currentLang.label}
              <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-popover shadow-md py-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => { onLangChange(l.value); setLangOpen(false); }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs font-mono transition-colors hover:bg-accent",
                      l.value === lang ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edit / Preview toggle */}
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs transition-colors",
                mode === "edit"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Code2 className="h-3 w-3" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs transition-colors border-l border-border",
                mode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Eye className="h-3 w-3" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Edit pane */}
      {mode === "edit" && (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`# paste your ${currentLang.label} solution here...`}
          className="w-full min-h-[280px] rounded-lg border border-input bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          rows={14}
          spellCheck={false}
        />
      )}

      {/* Preview pane */}
      {mode === "preview" && (
        <div className="min-h-[280px] rounded-lg border border-border overflow-hidden">
          {!value.trim() ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground font-mono">
              No code to preview
            </div>
          ) : highlighted ? (
            <div
              className="shiki-preview text-sm overflow-auto"
              // Shiki generates fully self-contained HTML with inline styles
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center text-xs text-muted-foreground">
              Rendering…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
