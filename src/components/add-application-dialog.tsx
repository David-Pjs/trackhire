"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createApplication } from "@/server/actions";
import { STATUS_ORDER, STATUS_CONFIG, type ApplicationStatus } from "@/lib/constants";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  background: "#FAFAF8", border: "1px solid #E8E4DF",
  color: "#1C1917", fontSize: 13, outline: "none",
  fontFamily: "inherit", transition: "border-color .15s",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#78716C", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function AddApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    company: "", role: "", status: "APPLIED" as ApplicationStatus,
    location: "", jobUrl: "", salary: "", notes: "",
    appliedAt: new Date().toISOString().split("T")[0],
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function reset() {
    setForm({ company: "", role: "", status: "APPLIED", location: "", jobUrl: "", salary: "", notes: "", appliedAt: new Date().toISOString().split("T")[0] });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.role) return;
    startTransition(async () => {
      await createApplication({ ...form, appliedAt: new Date(form.appliedAt) });
      setOpen(false);
      reset();
    });
  }

  const canSubmit = !!form.company && !!form.role && !isPending;

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 16px", borderRadius: 8,
        background: "#F97316", color: "#FFFFFF",
        fontSize: 13, fontWeight: 600, border: "none",
        cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
      }}>
        <Plus style={{ width: 14, height: 14 }} />
        Add application
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,25,23,0.5)", backdropFilter: "blur(4px)" }} onClick={() => { setOpen(false); reset(); }} />

          <div style={{ position: "relative", width: "100%", maxWidth: 520, background: "#FFFFFF", border: "1px solid #E8E4DF", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #F0EDE8" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>New application</p>
                <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 1 }}>Track a new job you applied to</p>
              </div>
              <button onClick={() => { setOpen(false); reset(); }} style={{ color: "#A8A29E", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Company *">
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Google" required style={inputStyle} />
                </Field>
                <Field label="Role *">
                  <input name="role" value={form.role} onChange={handleChange} placeholder="Frontend Engineer" required style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Status">
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                  </select>
                </Field>
                <Field label="Date applied">
                  <input type="date" name="appliedAt" value={form.appliedAt} onChange={handleChange} style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Location">
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Remote, Lagos…" style={inputStyle} />
                </Field>
                <Field label="Salary">
                  <input name="salary" value={form.salary} onChange={handleChange} placeholder="₦500k/mo" style={inputStyle} />
                </Field>
              </div>

              <Field label="Job URL">
                <input name="jobUrl" value={form.jobUrl} onChange={handleChange} placeholder="https://…" style={inputStyle} />
              </Field>

              <Field label="Notes">
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Anything to remember…" rows={3} style={{ ...inputStyle, resize: "none" }} />
              </Field>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingTop: 4, borderTop: "1px solid #F0EDE8", marginTop: 2 }}>
                <button type="button" onClick={() => { setOpen(false); reset(); }} style={{ padding: "9px 16px", borderRadius: 8, fontSize: 13, color: "#78716C", background: "none", border: "1px solid #E8E4DF", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button type="submit" disabled={!canSubmit} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "9px 20px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  background: canSubmit ? "#F97316" : "#F5F3EF",
                  color: canSubmit ? "#FFFFFF" : "#A8A29E",
                  border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
                  transition: "background .15s",
                }}>
                  {isPending && <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />}
                  Add application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
