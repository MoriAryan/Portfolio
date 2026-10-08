"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Wrench,
  Trophy,
  Shield,
  LayoutGrid,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Star,
  Eye,
  EyeOff,
  Archive,
  Loader2,
  Menu,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabKey =
  | "profile"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "achievements"
  | "positions"
  | "sections";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  endpoint: string;
}

const TABS: TabConfig[] = [
  { key: "profile", label: "Profile", icon: <User size={18} />, endpoint: "/api/admin/profile" },
  { key: "education", label: "Education", icon: <GraduationCap size={18} />, endpoint: "/api/admin/education" },
  { key: "experience", label: "Experience", icon: <Briefcase size={18} />, endpoint: "/api/admin/experience" },
  { key: "projects", label: "Projects", icon: <FolderOpen size={18} />, endpoint: "/api/admin/projects" },
  { key: "skills", label: "Skills", icon: <Wrench size={18} />, endpoint: "/api/admin/skills" },
  { key: "achievements", label: "Achievements", icon: <Trophy size={18} />, endpoint: "/api/admin/achievements" },
  { key: "positions", label: "Positions", icon: <Shield size={18} />, endpoint: "/api/admin/positions" },
  { key: "sections", label: "Sections", icon: <LayoutGrid size={18} />, endpoint: "/api/admin/sections" },
];

/* ------------------------------------------------------------------ */
/*  API Fetch Helper                                                   */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Reusable UI Components                                             */
/* ------------------------------------------------------------------ */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full px-3 py-2 bg-[#121218] border border-slate-800 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d2a] focus:border-[#e11d2a] transition-all";
  return (
    <div>
      <label className="block text-xs font-mono font-medium text-slate-400 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} min-h-[80px] resize-y`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        className={`w-9 h-5 rounded-full transition-colors relative ${
          checked ? "bg-[#e11d2a]" : "bg-slate-800"
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs sm:text-sm text-slate-300 font-mono">{label}</span>
    </label>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer";
  const sizeStyles = size === "sm" ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm";
  const variants = {
    primary: "bg-[#e11d2a] hover:bg-[#ff2a3b] text-white shadow-[0_0_15px_rgba(225,29,42,0.35)]",
    danger: "bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/30",
    ghost: "bg-[#14141c] hover:bg-[#1a1a24] text-slate-300 border border-slate-800",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function StatusMsg({ msg, type }: { msg: string; type: "success" | "error" }) {
  if (!msg) return null;
  const styles =
    type === "success"
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-mono"
      : "bg-red-500/10 border-red-500/20 text-red-400 font-mono";
  return <div className={`text-xs px-3 py-2 rounded-lg border ${styles}`}>{msg}</div>;
}

/* ------------------------------------------------------------------ */
/*  Profile Editor                                                     */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfileEditor() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });

  useEffect(() => {
    apiFetch("/api/admin/profile").then(setData).catch(() => setData({}));
  }, []);

  const update = (key: string, value: string) =>
    setData((prev: Record<string, unknown>) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setStatus({ msg: "", type: "success" });
    try {
      await apiFetch("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setStatus({ msg: "Profile saved & website updated!", type: "success" });
    } catch (e) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
    setSaving(false);
  };

  if (!data) return <div className="text-slate-500 p-8 font-mono">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl bg-[#0e0e14] p-6 rounded-2xl border border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" value={data.name || ""} onChange={(v) => update("name", v)} />
        <Input label="Role" value={data.role || ""} onChange={(v) => update("role", v)} />
      </div>
      <Input label="Current Focus" value={data.currentFocus || ""} onChange={(v) => update("currentFocus", v)} />
      <Input label="Bio" value={data.bio || ""} onChange={(v) => update("bio", v)} textarea />
      <Input label="Contact Email" value={data.email || ""} onChange={(v) => update("email", v)} />
      <Input label="Resume URL (Google Drive / direct link)" value={data.resumeUrl || ""} onChange={(v) => update("resumeUrl", v)} />

      <div className="flex items-center gap-3 pt-2">
        <Btn onClick={save} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Profile
        </Btn>
        <StatusMsg {...status} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Field Definitions                                                  */
/* ------------------------------------------------------------------ */

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "toggle" | "number" | "array";
  placeholder?: string;
}

const EDUCATION_FIELDS: FieldDef[] = [
  { key: "institution", label: "Institution", type: "text" },
  { key: "degree", label: "Degree / Standard", type: "text" },
  { key: "field", label: "Field of Study", type: "text" },
  { key: "period", label: "Period", type: "text", placeholder: "2024 - 2028" },
  { key: "published", label: "Published", type: "toggle" },
];

const EXPERIENCE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title / Role", type: "text" },
  { key: "organization", label: "Organization / Dept", type: "text" },
  { key: "sponsor", label: "Sponsor (e.g. ISRO)", type: "text" },
  { key: "supervisor", label: "Supervisor", type: "text" },
  { key: "period", label: "Period", type: "text", placeholder: "Dec 2025 - Present" },
  { key: "researchTopic", label: "Research Topic", type: "text" },
  { key: "description", label: "Description Bullets (one per line)", type: "array" },
  { key: "isResearch", label: "Research Position", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

const PROJECT_FIELDS: FieldDef[] = [
  { key: "slug", label: "Slug", type: "text", placeholder: "lowercase-with-hyphens" },
  { key: "title", label: "Title", type: "text" },
  { key: "hook", label: "Hook (one-liner teaser)", type: "text" },
  { key: "cover", label: "Cover Image URL", type: "text" },
  { key: "tech", label: "Tech Stack (one per line)", type: "array" },
  { key: "year", label: "Year", type: "text" },
  { key: "status", label: "Status", type: "text", placeholder: "Live, Completed, In Progress" },
  { key: "liveUrl", label: "Live System URL", type: "text", placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", type: "text", placeholder: "https://github.com/..." },
  { key: "problem", label: "The Problem", type: "textarea" },
  { key: "howIBuiltIt", label: "Architecture & How I Built It", type: "textarea" },
  { key: "theHardParts", label: "Key Technical Challenges / Hard Parts", type: "textarea" },
  { key: "result", label: "Results & Impact", type: "textarea" },
  { key: "whatIdChange", label: "What I'd Do Differently", type: "textarea" },
  { key: "isFeatured", label: "Featured in Workshop (max 5)", type: "toggle" },
  { key: "isVault", label: "Included in Vault", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

const SKILL_FIELDS: FieldDef[] = [
  { key: "category", label: "Category Name", type: "text" },
  { key: "icon", label: "Icon Key (code, globe, cpu, database, wrench, book)", type: "text" },
  { key: "published", label: "Published", type: "toggle" },
];

const ACHIEVEMENT_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "result", label: "Result", type: "text", placeholder: "Winner, Finalist, Top 5..." },
  { key: "year", label: "Year", type: "text" },
  { key: "published", label: "Published", type: "toggle" },
];

const POSITION_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "organization", label: "Organization", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "since", label: "Since", type: "text", placeholder: "2025" },
  { key: "published", label: "Published", type: "toggle" },
];

const SECTION_FIELDS: FieldDef[] = [
  { key: "key", label: "Key", type: "text" },
  { key: "displayName", label: "Display Name", type: "text" },
  { key: "navLabel", label: "Nav Label", type: "text" },
  { key: "visible", label: "Visible", type: "toggle" },
];

/* ------------------------------------------------------------------ */
/*  Universal Collection & Card Editor                                 */
/* ------------------------------------------------------------------ */

function CollectionEditor({
  endpoint,
  fields,
  nameKey,
}: {
  endpoint: string;
  fields: FieldDef[];
  nameKey: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });
  const [newSkillText, setNewSkillText] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiFetch(endpoint)
      .then(setItems)
      .catch((e) => setStatus({ msg: (e as Error).message, type: "error" }))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setEditingId("new");
    setForm({ published: true, order: items.length, items: [] });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEdit = (item: any) => {
    setEditingId(item._id);
    const initial = { ...item };
    if (endpoint === "/api/admin/projects") {
      initial.howIBuiltIt = item.chapters?.howIBuiltIt || "";
      initial.theHardParts = item.chapters?.theHardParts || "";
      initial.result = item.chapters?.result || "";
      initial.whatIdChange = item.chapters?.whatIdChange || "";
      initial.liveUrl = item.links?.[0]?.url || "";
      initial.githubUrl = item.links?.[1]?.url || "";
    }
    setForm(initial);
  };

  const cancel = () => {
    setEditingId(null);
    setForm({});
    setStatus({ msg: "", type: "success" });
  };

  const save = async () => {
    setSaving(true);
    setStatus({ msg: "", type: "success" });
    try {
      const payload = { ...form };

      if (endpoint === "/api/admin/projects") {
        payload.chapters = {
          howIBuiltIt: form.howIBuiltIt || "",
          theHardParts: form.theHardParts || "",
          result: form.result || "",
          whatIdChange: form.whatIdChange || "",
        };
        const links = [];
        if (form.liveUrl) links.push({ label: "Live System", url: form.liveUrl });
        if (form.githubUrl) links.push({ label: "GitHub", url: form.githubUrl });
        payload.links = links;
      }

      if (editingId === "new") {
        await apiFetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`${endpoint}/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      cancel();
      load();
    } catch (e) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiFetch(`${endpoint}/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setStatus({ msg: (e as Error).message, type: "error" });
    }
  };

  const reorder = async (index: number, direction: -1 | 1) => {
    const newItems = [...items];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= newItems.length) return;
    [newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]];
    setItems(newItems);
    try {
      await apiFetch(`${endpoint}/reorder`, {
        method: "POST",
        body: JSON.stringify({ ids: newItems.map((i) => i._id) }),
      });
    } catch {
      load();
    }
  };

  const updateForm = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Skills item manipulation inside the category
  const addSkillToCategory = () => {
    if (!newSkillText.trim()) return;
    const current = Array.isArray(form.items) ? [...form.items] : [];
    current.push({
      name: newSkillText.trim(),
      isTopSkill: false,
      projectSlugs: [],
    });
    setForm((prev) => ({ ...prev, items: current }));
    setNewSkillText("");
  };

  const toggleTopSkill = (idx: number) => {
    const current = [...(form.items || [])];
    current[idx].isTopSkill = !current[idx].isTopSkill;
    setForm((prev) => ({ ...prev, items: current }));
  };

  const removeSkillFromCategory = (idx: number) => {
    const current = [...(form.items || [])];
    current.splice(idx, 1);
    setForm((prev) => ({ ...prev, items: current }));
  };

  if (loading) return <div className="text-slate-500 p-8 font-mono">Loading data...</div>;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">{items.length} items registered</span>
        <Btn onClick={startCreate} size="sm">
          <Plus size={14} /> Add Card
        </Btn>
      </div>

      {/* Editor Modal / Form Container */}
      {editingId && (
        <div className="bg-[#0e0e14] border border-[#e11d2a]/40 rounded-xl p-5 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(225,29,42,0.15)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e11d2a]" />
              {editingId === "new" ? "Create New Entry" : "Edit Entry"}
            </h3>
            <button onClick={cancel} className="text-slate-500 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => {
              if (f.type === "toggle") {
                return (
                  <Toggle
                    key={f.key}
                    label={f.label}
                    checked={Boolean(form[f.key])}
                    onChange={(v) => updateForm(f.key, v)}
                  />
                );
              }
              if (f.type === "array") {
                const arr = Array.isArray(form[f.key]) ? form[f.key] : [];
                return (
                  <div key={f.key} className="sm:col-span-2">
                    <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                      {f.label}
                    </label>
                    <textarea
                      value={arr.join("\n")}
                      onChange={(e) => updateForm(f.key, e.target.value.split("\n"))}
                      className="w-full px-3 py-2 bg-[#121218] border border-slate-800 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d2a] focus:border-[#e11d2a] transition-all min-h-[70px] resize-y font-mono"
                      placeholder={f.placeholder || "One per line"}
                    />
                  </div>
                );
              }
              return (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Input
                    label={f.label}
                    value={form[f.key] || ""}
                    onChange={(v) => updateForm(f.key, v)}
                    textarea={f.type === "textarea"}
                    placeholder={f.placeholder}
                  />
                </div>
              );
            })}
          </div>

          {/* DEDICATED SKILL ITEMS MANAGER */}
          {endpoint === "/api/admin/skills" && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white font-mono">
                  Skills In This Category ({(form.items || []).length})
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Click ★ to toggle Top Skill</span>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2">
                {(form.items || []).map((skill: any, sIdx: number) => (
                  <div
                    key={sIdx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      skill.isTopSkill
                        ? "bg-[#e11d2a]/20 border-[#e11d2a]/60 text-white"
                        : "bg-[#14141c] border-slate-800 text-slate-300"
                    }`}
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleTopSkill(sIdx)}
                      className={`cursor-pointer ml-1 text-sm ${
                        skill.isTopSkill ? "text-amber-400" : "text-slate-600 hover:text-slate-300"
                      }`}
                      title={skill.isTopSkill ? "Top Skill active" : "Mark as Top Skill"}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSkillFromCategory(sIdx)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer ml-1 text-base leading-none"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Type skill name (e.g. C++, Next.js, PyTorch)..."
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillToCategory();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#121218] border border-slate-800 rounded-lg text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d2a]"
                />
                <button
                  type="button"
                  onClick={addSkillToCategory}
                  className="px-4 py-2 rounded-lg bg-[#e11d2a] hover:bg-[#ff2a3b] text-white text-xs font-semibold cursor-pointer shadow-[0_0_12px_rgba(225,29,42,0.3)]"
                >
                  Add Skill
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Btn onClick={save} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editingId === "new" ? "Create Card" : "Save Changes"}
            </Btn>
            <Btn onClick={cancel} variant="ghost" size="sm">
              <X size={14} /> Cancel
            </Btn>
            <StatusMsg {...status} />
          </div>
        </div>
      )}

      {/* Cards List with Rearrange Controls */}
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={item._id}
            className={`group flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
              item.published === false
                ? "bg-[#0c0c11]/40 border-slate-900 opacity-60"
                : "bg-[#0e0e14] border-slate-800/80 hover:border-[#e11d2a]/40"
            }`}
          >
            {/* Reorder Up/Down */}
            <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
              <button
                onClick={() => reorder(idx, -1)}
                className="text-slate-600 hover:text-white transition-colors cursor-pointer p-0.5"
                disabled={idx === 0}
                title="Move Up"
              >
                <ChevronUp size={15} />
              </button>
              <button
                onClick={() => reorder(idx, 1)}
                className="text-slate-600 hover:text-white transition-colors cursor-pointer p-0.5"
                disabled={idx === items.length - 1}
                title="Move Down"
              >
                <ChevronDown size={15} />
              </button>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white truncate">
                  {item[nameKey] || item.title || item.category || item.institution || "Untitled"}
                </span>
                {item.year && (
                  <span className="text-[10px] font-mono text-slate-500">({item.year})</span>
                )}
              </div>

              {/* Sub-details (e.g. hook or degree) */}
              {(item.hook || item.degree || item.result || item.organization) && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {item.hook || item.degree || item.result || item.organization}
                </p>
              )}

              {/* Skills preview on category cards */}
              {endpoint === "/api/admin/skills" && Array.isArray(item.items) && item.items.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.items.map((s: any, sIdx: number) => (
                    <span
                      key={sIdx}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        s.isTopSkill
                          ? "bg-[#e11d2a]/20 text-white border border-[#e11d2a]/40"
                          : "bg-[#14141d] text-slate-400 border border-slate-800"
                      }`}
                    >
                      {s.name} {s.isTopSkill && "★"}
                    </span>
                  ))}
                </div>
              )}

              {/* Status Badges */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {item.isFeatured && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full flex items-center gap-0.5 border border-amber-500/30">
                    <Star size={9} /> Featured
                  </span>
                )}
                {item.isVault && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded-full flex items-center gap-0.5 border border-purple-500/30">
                    <Archive size={9} /> Vault
                  </span>
                )}
                {item.published === false ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full flex items-center gap-0.5">
                    <EyeOff size={9} /> Draft
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center gap-0.5 border border-emerald-500/20">
                    <Eye size={9} /> Live
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Delete Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(item)}
                className="p-1.5 rounded-lg bg-[#14141c] hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-800"
                title="Edit Entry"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => remove(item._id)}
                className="p-1.5 rounded-lg bg-[#14141c] hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition-all cursor-pointer border border-slate-800"
                title="Delete Entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-xs font-mono text-slate-500 text-center py-12 border border-dashed border-slate-800 rounded-xl">
            No entries found. Click &ldquo;Add Card&rdquo; above to create one.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin Dashboard Page                                          */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center font-mono text-sm text-slate-400">
        <Loader2 size={24} className="text-[#e11d2a] animate-spin mr-2" />
        Authenticating...
      </div>
    );
  }

  if (!session) return null;

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-200 selection:bg-[#e11d2a]/30">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#08080a]/95 sticky top-0 z-50 backdrop-blur-md">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#14141c] text-slate-300"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xs font-bold text-white font-mono">ADMIN CONSOLE</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-lg hover:bg-[#14141c] text-slate-400"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 left-0 z-40 w-64 h-screen border-r border-slate-800/80 bg-[#0a0a0f] transition-transform md:transition-none flex flex-col`}
        >
          {/* Brand Logo in Sidebar */}
          <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_8px_rgba(225,29,42,0.4)]"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-mono">MORI ARYAN</h1>
              <p className="text-[10px] text-slate-500 font-mono">Portfolio Control Panel</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#e11d2a]/15 text-white border border-[#e11d2a]/30 shadow-[0_0_12px_rgba(225,29,42,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-[#14141c]"
                  }`}
                >
                  <span className={isActive ? "text-[#ff4d5a]" : "text-slate-500"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#14141c] transition-all font-mono"
            >
              <ExternalLink size={14} />
              View Live Website
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all font-mono cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-h-screen p-4 md:p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#e11d2a]/10 text-[#ff4d5a] border border-[#e11d2a]/20">
                {currentTab.icon}
              </span>
              <span>{currentTab.label} Control</span>
            </h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <span>Preview Live Site</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {activeTab === "profile" && <ProfileEditor />}

          {activeTab === "education" && (
            <CollectionEditor
              endpoint="/api/admin/education"
              fields={EDUCATION_FIELDS}
              nameKey="institution"
            />
          )}

          {activeTab === "experience" && (
            <CollectionEditor
              endpoint="/api/admin/experience"
              fields={EXPERIENCE_FIELDS}
              nameKey="title"
            />
          )}

          {activeTab === "projects" && (
            <CollectionEditor
              endpoint="/api/admin/projects"
              fields={PROJECT_FIELDS}
              nameKey="title"
            />
          )}

          {activeTab === "skills" && (
            <CollectionEditor
              endpoint="/api/admin/skills"
              fields={SKILL_FIELDS}
              nameKey="category"
            />
          )}

          {activeTab === "achievements" && (
            <CollectionEditor
              endpoint="/api/admin/achievements"
              fields={ACHIEVEMENT_FIELDS}
              nameKey="title"
            />
          )}

          {activeTab === "positions" && (
            <CollectionEditor
              endpoint="/api/admin/positions"
              fields={POSITION_FIELDS}
              nameKey="title"
            />
          )}

          {activeTab === "sections" && (
            <CollectionEditor
              endpoint="/api/admin/sections"
              fields={SECTION_FIELDS}
              nameKey="displayName"
            />
          )}
        </main>
      </div>
    </div>
  );
}
