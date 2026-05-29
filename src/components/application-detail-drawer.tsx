"use client";

import { useState, useTransition } from "react";
import {
  X, ExternalLink, Copy, Trash2, Pencil, Loader2,
  Calendar, AlertTriangle, CheckCircle2, Sparkles, RotateCcw,
} from "lucide-react";
import { updateApplication, deleteApplication } from "@/server/actions";
import { STATUS_ORDER, STATUS_CONFIG, type ApplicationStatus } from "@/lib/constants";

type Application = {
  id: string; company: string; role: string; status: ApplicationStatus;
  location?: string | null; jobUrl?: string | null; salary?: string | null;
  notes?: string | null; appliedAt: Date; updatedAt: Date;
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  background: "#FAFAF8", border: "1px solid #E8E4DF",
  color: "#1C1917", fontSize: 13, outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#78716C",
  textTransform: "uppercase" as const, letterSpacing: "0.06em",
  marginBottom: 5, display: "block",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "#A8A29E",
  textTransform: "uppercase" as const, letterSpacing: "0.09em",
  marginBottom: 8,
};

function daysAgo(date: Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
}

function isFollowUpDue(app: Application) {
  if (app.status === "OFFER" || app.status === "REJECTED") return false;
  return daysAgo(app.updatedAt) >= 7;
}

export function ApplicationDetailDrawer({
  application,
  onClose,
  onDeleted,
}: {
  application: Application;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiCopied, setAiCopied] = useState(false);

  const [form, setForm] = useState({
    company: application.company,
    role: application.role,
    status: application.status,
    location: application.location ?? "",
    jobUrl: application.jobUrl ?? "",
    salary: application.salary ?? "",
    notes: application.notes ?? "",
    appliedAt: new Date(application.appliedAt).toISOString().split("T")[0],
  });

  const config = STATUS_CONFIG[application.status];
  const followUpDue = isFollowUpDue(application);
  const daysSinceUpdate = daysAgo(application.updatedAt);
  const initial = application.company.charAt(0).toUpperCase();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    startTransition(async () => {
      await updateApplication(application.id, {
        company: form.company,
        role: form.role,
        status: form.status as ApplicationStatus,
        location: form.location || undefined,
        jobUrl: form.jobUrl || undefined,
        salary: form.salary || undefined,
        notes: form.notes || undefined,
        appliedAt: new Date(form.appliedAt),
      });
      setEditing(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteApplication(application.id);
      onDeleted(application.id);
      onClose();
    });
  }

  function handleStageChange(status: ApplicationStatus) {
    startTransition(async () => {
      await updateApplication(application.id, { status });
    });
  }

  function handleCopyUrl() {
    if (application.jobUrl) {
      navigator.clipboard.writeText(application.jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  async function generateFollowUp() {
    setAiLoading(true);
    setAiError("");
    setAiMessage("");
    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: application.company,
          role: application.role,
          stage: STATUS_CONFIG[application.status].label,
          appliedDate: new Date(application.appliedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          }),
          notes: application.notes,
          salary: application.salary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setAiMessage(data.message);
    } catch (err: any) {
      setAiError(err.message || "Something went wrong. Try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function copyAiMessage() {
    navigator.clipboard.writeText(aiMessage);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 1500);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.4)", zIndex: 40 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100%",
        width: "100%", maxWidth: 480,
        background: "#FFFFFF",
        borderLeft: "1px solid #E8E4DF",
        zIndex: 50,
        display: "flex", flexDirection: "column",
        boxShadow: "-16px 0 40px rgba(0,0,0,0.08)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "20px 22px",
          borderBottom: "1px solid #F0EDE8",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0, paddingRight: 12 }}>
            {/* Avatar */}
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: "#F5F3EF", border: "1px solid #EAE7E3",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#57534E" }}>{initial}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.01em", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {application.role}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: "#78716C" }}>{application.company}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99,
                  background: `${config.dot}15`, color: config.dot,
                  border: `1px solid ${config.dot}25`,
                }}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "#A8A29E", background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Follow-up banner */}
        {followUpDue && (
          <div style={{
            margin: "14px 22px 0",
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: "#FEF3C7", border: "1px solid #FDE68A",
          }}>
            <AlertTriangle style={{ width: 14, height: 14, color: "#B45309", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              Follow-up recommended. No progress in {daysSinceUpdate} days.
            </p>
          </div>
        )}

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Stage selector */}
          <div>
            <p style={sectionLabelStyle}>Move stage</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {STATUS_ORDER.map((s) => {
                const c = STATUS_CONFIG[s];
                const active = application.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => !active && handleStageChange(s)}
                    disabled={isPending || active}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 11px", borderRadius: 99,
                      fontSize: 12, fontWeight: 500, fontFamily: "inherit",
                      border: active ? `1px solid ${c.dot}40` : "1px solid #E8E4DF",
                      background: active ? `${c.dot}12` : "#FFFFFF",
                      color: active ? c.dot : "#78716C",
                      cursor: active ? "default" : "pointer",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details — view or edit */}
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Company *</label><input name="company" value={form.company} onChange={handleChange} style={inputStyle} required /></div>
                <div><label style={labelStyle}>Role *</label><input name="role" value={form.role} onChange={handleChange} style={inputStyle} required /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Location</label><input name="location" value={form.location} onChange={handleChange} placeholder="Remote, Lagos…" style={inputStyle} /></div>
                <div><label style={labelStyle}>Salary</label><input name="salary" value={form.salary} onChange={handleChange} placeholder="₦500k/mo" style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Date applied</label><input type="date" name="appliedAt" value={form.appliedAt} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Job URL</label><input name="jobUrl" value={form.jobUrl} onChange={handleChange} placeholder="https://…" style={inputStyle} /></div>
              <div><label style={labelStyle}>Notes</label><textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Anything to remember…" style={{ ...inputStyle, resize: "none" }} /></div>
            </div>
          ) : (
            <div>
              <p style={sectionLabelStyle}>Details</p>
              <div style={{
                background: "#FAFAF8", border: "1px solid #F0EDE8",
                borderRadius: 10, overflow: "hidden",
              }}>
                {[
                  { label: "Applied", value: new Date(application.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                  application.location ? { label: "Location", value: application.location } : null,
                  application.salary ? { label: "Salary", value: application.salary } : null,
                ].filter(Boolean).map((row, i, arr) => (
                  <div key={(row as any).label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 14px",
                    borderBottom: i < arr.length - 1 ? "1px solid #F0EDE8" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "#78716C" }}>{(row as any).label}</span>
                    <span style={{ fontSize: 12, color: "#1C1917", fontWeight: 500 }}>{(row as any).value}</span>
                  </div>
                ))}
              </div>

              {application.notes && (
                <div style={{ marginTop: 16 }}>
                  <p style={sectionLabelStyle}>Notes</p>
                  <div style={{
                    background: "#FAFAF8", border: "1px solid #F0EDE8",
                    borderRadius: 10, padding: "12px 14px",
                  }}>
                    <p style={{ fontSize: 13, color: "#44403C", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {application.notes}
                    </p>
                  </div>
                </div>
              )}

              {application.jobUrl && (
                <div style={{ marginTop: 16 }}>
                  <p style={sectionLabelStyle}>Job posting</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <a href={application.jobUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "#F97316", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                      <ExternalLink style={{ width: 13, height: 13 }} />Open posting
                    </a>
                    <button onClick={handleCopyUrl} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#78716C" }}>
                      {copied ? <CheckCircle2 style={{ width: 13, height: 13, color: "#22C55E" }} /> : <Copy style={{ width: 13, height: 13 }} />}
                      {copied ? "Copied" : "Copy URL"}
                    </button>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 11, color: "#A8A29E", marginTop: 14 }}>
                Updated {daysSinceUpdate === 0 ? "today" : `${daysSinceUpdate}d ago`}
              </p>
            </div>
          )}

          {/* Follow-up Copilot */}
          {!editing && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <Sparkles style={{ width: 14, height: 14, color: "#F97316" }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917" }}>Follow-up Copilot</p>
              </div>
              <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 12, lineHeight: 1.5 }}>
                Generate a short, professional follow-up message based on this role.
              </p>

              {!aiMessage && !aiLoading && (
                <button onClick={generateFollowUp} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 8,
                  background: "#FFF7ED", border: "1px solid #FED7AA",
                  color: "#C2410C", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", width: "100%", fontFamily: "inherit",
                }}>
                  <Sparkles style={{ width: 13, height: 13 }} />
                  Generate follow-up
                </button>
              )}

              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", color: "#A8A29E" }}>
                  <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 13 }}>Writing your message…</span>
                </div>
              )}

              {aiError && (
                <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <p style={{ fontSize: 12, color: "#B91C1C" }}>{aiError}</p>
                </div>
              )}

              {aiMessage && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: "#FAFAF8", border: "1px solid #F0EDE8" }}>
                    <p style={{ fontSize: 13, color: "#44403C", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiMessage}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={copyAiMessage} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "7px 12px", borderRadius: 8,
                      background: "#F0FDF4", border: "1px solid #BBF7D0",
                      color: "#15803D", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {aiCopied ? <CheckCircle2 style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                      {aiCopied ? "Copied" : "Copy"}
                    </button>
                    <button onClick={generateFollowUp} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "7px 12px", borderRadius: 8,
                      background: "#FFFFFF", border: "1px solid #E8E4DF",
                      color: "#78716C", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      <RotateCcw style={{ width: 13, height: 13 }} />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: "14px 22px", borderTop: "1px solid #F0EDE8",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "#FFFFFF",
        }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} style={{ fontSize: 13, color: "#78716C", background: "none", border: "1px solid #E8E4DF", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending || !form.company || !form.role}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8,
                  background: isPending || !form.company || !form.role ? "#F5F3EF" : "#F97316",
                  color: isPending || !form.company || !form.role ? "#A8A29E" : "#FFFFFF",
                  fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  border: "none", cursor: isPending || !form.company || !form.role ? "not-allowed" : "pointer",
                }}
              >
                {isPending && <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />}
                Save changes
              </button>
            </>
          ) : (
            <>
              {confirmDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <span style={{ fontSize: 12, color: "#78716C", flex: 1 }}>Delete this application?</span>
                  <button onClick={() => setConfirmDelete(false)} style={{ fontSize: 13, color: "#78716C", background: "none", border: "none", cursor: "pointer", padding: "8px 12px", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={isPending} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 14px", borderRadius: 8,
                    background: "#EF4444", color: "#FFFFFF",
                    fontSize: 13, fontWeight: 600,
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {isPending ? <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} /> : <Trash2 style={{ width: 13, height: 13 }} />}
                    Delete
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => setConfirmDelete(true)} style={{ color: "#A8A29E", background: "none", border: "1px solid #E8E4DF", padding: "8px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                  <button onClick={() => setEditing(true)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 8,
                    background: "#1C1917", color: "#FFFFFF",
                    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                    border: "none", cursor: "pointer",
                  }}>
                    <Pencil style={{ width: 13, height: 13 }} />
                    Edit
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
