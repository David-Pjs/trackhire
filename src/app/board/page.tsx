import { Sidebar } from "@/components/sidebar";
import { KanbanBoard } from "@/components/kanban-board";
import { AddApplicationDialog } from "@/components/add-application-dialog";
import { getApplications, getDashboardStats } from "@/server/actions";
import { type ApplicationStatus } from "@/lib/constants";
import { Briefcase, TrendingUp, Zap, AlertTriangle } from "lucide-react";

export default async function BoardPage() {
  const [raw, stats] = await Promise.all([getApplications(), getDashboardStats()]);
  const applications = raw.map((a) => ({ ...a, status: a.status as ApplicationStatus }));

  const followUpCount = applications.filter((a) => {
    if (a.status === "OFFER" || a.status === "REJECTED") return false;
    return Math.floor((Date.now() - new Date(a.updatedAt).getTime()) / 86_400_000) >= 7;
  }).length;

  const STATS = [
    { icon: Briefcase,     label: "Total",      value: stats.total,              color: "#78716C" },
    { icon: Zap,           label: "Active",     value: stats.active,             color: "#F97316" },
    { icon: TrendingUp,    label: "Response",   value: `${stats.responseRate}%`, color: "#3B82F6" },
    { icon: AlertTriangle, label: "Due",        value: followUpCount,            color: followUpCount > 0 ? "#F59E0B" : "#A8A29E" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div className="block lg:hidden" style={{ height: 52 }} />

        {/* Header */}
        <header style={{
          padding: "20px 20px 0",
          borderBottom: "1px solid #EAE7E3",
          backgroundColor: "#FAFAF8",
        }}>
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            marginBottom: 14, gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", marginBottom: 2 }}>
                My Pipeline
              </h1>
              <p style={{ fontSize: 13, color: "#A8A29E" }}>
                Every job you applied to, organized by stage.
              </p>
            </div>
            <AddApplicationDialog />
          </div>

          {/* Stats — wraps on mobile, no horizontal scroll */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: 14, flexWrap: "wrap",
            paddingBottom: 14,
          }}>
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#FFFFFF", border: "1px solid #EAE7E3",
                padding: "5px 10px", borderRadius: 99,
              }}>
                <Icon style={{ width: 12, height: 12, color }} />
                <span style={{ fontSize: 11, color: "#78716C" }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Board area */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", padding: "18px 20px", minWidth: 0 }}>
          {applications.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 320, textAlign: "center", gap: 16,
              background: "#FFFFFF", border: "1px solid #EAE7E3", borderRadius: 14,
              padding: 28,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: "#F5F3EF", border: "1px solid #EAE7E3",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Briefcase style={{ width: 20, height: 20, color: "#A8A29E" }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", marginBottom: 5, letterSpacing: "-0.01em" }}>Start your pipeline</p>
                <p style={{ fontSize: 13, color: "#A8A29E", maxWidth: 280, lineHeight: 1.6 }}>
                  Add your first application and TrackHire will help you stay organized.
                </p>
              </div>
              <AddApplicationDialog />
            </div>
          ) : (
            <KanbanBoard initialApplications={applications} />
          )}
        </div>
      </main>
    </div>
  );
}
