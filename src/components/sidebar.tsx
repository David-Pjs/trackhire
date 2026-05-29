"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BarChart2, LogOut, Menu, X } from "lucide-react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

const NAV = [
  { href: "/board", label: "Board", icon: LayoutGrid },
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
];

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} onClick={onClose} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, fontSize: 13,
            textDecoration: "none",
            fontWeight: active ? 600 : 400,
            color: active ? "#1C1917" : "#78716C",
            backgroundColor: active ? "#FFF3E8" : "transparent",
            borderLeft: active ? "2px solid #F97316" : "2px solid transparent",
            transition: "all .15s",
          }}>
            <Icon style={{ width: 15, height: 15, color: active ? "#F97316" : "#A8A29E" }} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex" style={{
        flexDirection: "column", width: 220, minHeight: "100vh",
        backgroundColor: "#FFFFFF", borderRight: "1px solid #ECEAE6",
        padding: "20px 12px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 28 }}>
          <div style={{ width: 24, height: 24, borderRadius: 5, backgroundColor: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>T</span>
          </div>
          <span style={{ color: "#1C1917", fontWeight: 700, fontSize: 14 }}>TrackHire</span>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <NavLinks pathname={pathname} />
        </nav>

        <div style={{ padding: "0 4px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#F97316" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#C2410C" }}>#BuildQuik on QuikDB</span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #ECEAE6", paddingTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            <span style={{ fontSize: 12, color: "#A8A29E" }}>My account</span>
          </div>
          <SignOutButton redirectUrl="/sign-in">
            <button style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 8, fontSize: 13, color: "#A8A29E", background: "none",
              border: "none", cursor: "pointer", width: "100%", fontFamily: "inherit",
            }}>
              <LogOut style={{ width: 14, height: 14 }} />Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex lg:hidden" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        backgroundColor: "#FFFFFF", borderBottom: "1px solid #ECEAE6",
        padding: "0 16px", height: 52, alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>T</span>
          </div>
          <span style={{ color: "#1C1917", fontWeight: 700, fontSize: 14 }}>TrackHire</span>
        </div>
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716C" }}>
          <Menu style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileOpen(false)} />
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 260,
            backgroundColor: "#FFFFFF", padding: "20px 12px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>T</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1C1917" }}>TrackHire</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <NavLinks pathname={pathname} onClose={() => setMobileOpen(false)} />
            </nav>
            <SignOutButton redirectUrl="/sign-in">
              <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "#A8A29E", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <LogOut style={{ width: 14, height: 14 }} />Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </>
  );
}
