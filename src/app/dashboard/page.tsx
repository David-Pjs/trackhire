import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { getDashboardStats, getApplications } from "@/server/actions";
import { STATUS_CONFIG, type ApplicationStatus } from "@/lib/constants";
import { AddApplicationDialog } from "@/components/add-application-dialog";
import { LayoutGrid, TrendingUp, Zap, Gift, AlertTriangle, CheckCircle2 } from "lucide-react";

function daysAgo(date: Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
}

function MetricCard({ icon: Icon, label, value, helper, color, bg }: any) {
  return (
    <div style={{
      borderRadius: 12, backgroundColor: "#FFFFFF",
      border: "1px solid #EAE7E3", padding: "16px 18px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#A8A29E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          backgroundColor: bg, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon style={{ width: 13, height: 13, color }} strokeWidth={2.2} />
        </div>
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.03em", marginBottom: 3, lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: "#A8A29E" }}>{helper}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, applications] = await Promise.all([getDashboardStats(), getApplications()]);
  const offerRate = stats.total > 0 ? Math.round(((stats.byStatus.OFFER ?? 0) / stats.total) * 100) : 0;
  const statusEntries = Object.entries(stats.byStatus) as [ApplicationStatus, number][];
  const followUps = applications.filter(app => {
    if (app.status === "OFFER" || app.status === "REJECTED") return false;
    return daysAgo(app.updatedAt) >= 7;
  });

  const METRICS = [
    { icon: LayoutGrid, label: "Total",         value: stats.total,              helper: "All tracked",      color: "#78716C", bg: "#F5F3EF" },
    { icon: Zap,        label: "Active",        value: stats.active,             helper: "In pipeline",      color: "#F97316", bg: "#FFF7ED" },
    { icon: TrendingUp, label: "Response",      value: `${stats.responseRate}%`, helper: "Past Applied",     color: "#3B82F6", bg: "#EFF6FF" },
    { icon: Gift,       label: "Offers",        value: `${offerRate}%`,          helper: "Reached an Offer", color: "#22C55E", bg: "#F0FDF4" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="block lg:hidden" style={{ height: 52 }} />

        <header style={{
          padding: "20px 20px",
          borderBottom: "1px solid #EAE7E3",
          backgroundColor: "#FAFAF8",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em", marginBottom: 2 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: "#A8A29E" }}>Your job search at a glance.</p>
          </div>
          <AddApplicationDialog />
        </header>

        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Metrics — responsive grid */}
          <div className="metrics-grid" style={{ display: "grid", gap: 10 }}>
            {METRICS.map(m => <MetricCard key={m.label} {...m} />)}
          </div>

          {/* Follow-up panel */}
          <div style={{
            borderRadius: 12, backgroundColor: "#FFFFFF",
            border: "1px solid #EAE7E3", overflow: "hidden",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "13px 16px", borderBottom: "1px solid #F0EDE8",
            }}>
              <AlertTriangle style={{ width: 14, height: 14, color: "#F59E0B" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>Needs follow-up</span>
              {followUps.length > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#B45309",
                  backgroundColor: "#FEF3C7", border: "1px solid #FDE68A",
                  borderRadius: 99, padding: "1px 8px",
                }}>
                  {followUps.length}
                </span>
              )}
            </div>

            {followUps.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px" }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: "#22C55E", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#78716C" }}>Nothing needs follow-up. Pipeline is clean.</p>
              </div>
            ) : followUps.map((app) => {
              const cfg = STATUS_CONFIG[app.status as ApplicationStatus];
              return (
                <div key={app.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 16px", borderBottom: "1px solid #F5F3EF",
                  gap: 12, flexWrap: "wrap",
                }}>
                  <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.role}</p>
                    <p style={{ fontSize: 11, color: "#A8A29E", marginTop: 1 }}>{app.company}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: cfg.dot,
                      backgroundColor: `${cfg.dot}15`, border: `1px solid ${cfg.dot}25`,
                      borderRadius: 99, padding: "1px 7px",
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#B45309" }}>{daysAgo(app.updatedAt)}d</span>
                    <Link href="/board" style={{ fontSize: 12, color: "#1C1917", textDecoration: "none", fontWeight: 500 }}>Open →</Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pipeline breakdown */}
          <div style={{
            borderRadius: 12, backgroundColor: "#FFFFFF",
            border: "1px solid #EAE7E3", padding: 18,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginBottom: 16 }}>Pipeline breakdown</p>
            {stats.total === 0 ? (
              <p style={{ fontSize: 13, color: "#A8A29E", textAlign: "center", padding: "16px 0" }}>
                Add applications to see your breakdown.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {statusEntries.map(([status, count]) => {
                  const cfg = STATUS_CONFIG[status];
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <div key={status}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: cfg.dot }} />
                          <span style={{ fontSize: 12, color: "#44403C" }}>{cfg.label}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, color: "#A8A29E" }}>{pct}%</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1C1917", minWidth: 16, textAlign: "right" }}>{count}</span>
                        </div>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, backgroundColor: "#F5F3EF", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, backgroundColor: cfg.dot, width: `${pct}%`, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
