import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  LayoutGrid,
  TrendingUp,
  PlusCircle,
  FileText,
  Sparkles,
  Bell,
} from "lucide-react";

const FEATURES = [
  { icon: LayoutGrid, color: "#3B82F6", title: "Visual board",       desc: "See every application across five stages, all on one screen." },
  { icon: TrendingUp, color: "#A855F7", title: "Response rate",      desc: "Know what percentage of jobs you applied to got a reply." },
  { icon: PlusCircle, color: "#22C55E", title: "Add in seconds",     desc: "Company, role, date, link, salary. Done in one form." },
  { icon: Bell,       color: "#F59E0B", title: "Follow-up reminders",desc: "Get notified when an application has been quiet too long." },
  { icon: FileText,   color: "#6366F1", title: "Notes per role",     desc: "Keep context on every job in one place." },
  { icon: Sparkles,   color: "#F97316", title: "AI follow-up writer",desc: "Generate a clean follow-up message in one click." },
];

const PREVIEW_COLUMNS = [
  {
    label: "Applied", color: "#3B82F6", count: 8,
    cards: [
      { company: "Linear",  role: "Frontend Engineer", days: "2d" },
      { company: "Vercel",  role: "Platform Engineer", days: "3d" },
    ],
  },
  {
    label: "Screening", color: "#A855F7", count: 3,
    cards: [
      { company: "Stripe",  role: "Product Engineer", days: "5d" },
    ],
  },
  {
    label: "Interview", color: "#F59E0B", count: 2,
    cards: [
      { company: "Notion",  role: "Senior Engineer", days: "1d" },
    ],
  },
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/board");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#1C1917", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>

      {/* Nav */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>T</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>TrackHire</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/sign-in" style={{ fontSize: 13, color: "#78716C", textDecoration: "none" }}>Log in</Link>
            <Link href="/sign-up" style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, backgroundColor: "#1C1917", color: "white", fontWeight: 500, textDecoration: "none" }}>
              Sign up free
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <div className="hero-grid" style={{ display: "grid", gap: 40, alignItems: "center", paddingTop: 32, paddingBottom: 56 }}>

          {/* Copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, backgroundColor: "#FFF7ED", border: "1px solid #FDBA74", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#F97316" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#C2410C", letterSpacing: "0.05em" }}>Built for the #BuildQuik Challenge</span>
            </div>

            <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14, color: "#111110" }}>
              Track every job<br />
              you apply to.
            </h1>

            <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.65, maxWidth: 420, marginBottom: 28 }}>
              Stop losing applications in spreadsheets. TrackHire shows where every job stands, from first apply to final offer.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Link href="/sign-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 20px", borderRadius: 8, backgroundColor: "#F97316", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Start tracking free
              </Link>
              <Link href="/sign-in" style={{ display: "inline-flex", alignItems: "center", padding: "11px 20px", borderRadius: 8, backgroundColor: "transparent", color: "#78716C", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid #E5E3DF" }}>
                Sign in
              </Link>
            </div>

            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 14 }}>
              Free. No credit card. Built on QuikDB.
            </p>
          </div>

          {/* Static board preview */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #EAE7E3",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 24px 64px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
            }}>
              {/* Browser chrome */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #F0EDE8" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5F3EF" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5F3EF" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5F3EF" }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: "#A8A29E" }}>My Pipeline</span>
              </div>

              {/* Mini columns */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {PREVIEW_COLUMNS.map(col => (
                  <div key={col.label} style={{ background: "#FAFAF8", border: "1px solid #EAE7E3", borderRadius: 10, padding: 8, minHeight: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8, padding: "0 2px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: col.color }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#44403C", textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>{col.label}</span>
                      <span style={{ fontSize: 10, color: "#A8A29E", fontWeight: 600 }}>{col.count}</span>
                    </div>
                    {col.cards.map((c, i) => (
                      <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E4DF", borderRadius: 7, padding: "8px 9px", marginBottom: 5 }}>
                        <p style={{ fontSize: 9, color: "#A8A29E", marginBottom: 3 }}>{c.company}</p>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#1C1917", lineHeight: 1.3 }}>{c.role}</p>
                        <p style={{ fontSize: 9, color: "#A8A29E", marginTop: 6 }}>{c.days}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 64px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#A8A29E", textTransform: "uppercase", marginBottom: 18 }}>
          Everything in one place
        </p>
        <div className="features-grid" style={{ display: "grid", gap: 10 }}>
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} style={{ borderRadius: 14, backgroundColor: "#F5F3EF", padding: "18px 16px" }}>
              <Icon style={{ color, width: 17, height: 17, marginBottom: 10, display: "block" }} strokeWidth={1.75} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: 12.5, color: "#78716C", lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #EEEBE6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#C8C0B8", fontSize: 11 }}>TrackHire</span>
          <span style={{ color: "#C8C0B8", fontSize: 11 }}>Built on QuikDB · #BuildQuik 2026</span>
        </div>
      </div>
    </div>
  );
}
