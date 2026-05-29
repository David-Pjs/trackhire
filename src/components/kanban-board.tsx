"use client";

import { useOptimistic, useTransition, useState, useEffect } from "react";
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors,
  useDroppable, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, Calendar, Plus } from "lucide-react";
import { updateApplicationStatus, deleteApplication } from "@/server/actions";
import { STATUS_ORDER, STATUS_CONFIG, type ApplicationStatus } from "@/lib/constants";
import { ApplicationDetailDrawer } from "@/components/application-detail-drawer";

type Application = {
  id: string; company: string; role: string; status: ApplicationStatus;
  location?: string | null; jobUrl?: string | null; salary?: string | null;
  notes?: string | null; appliedAt: Date; updatedAt: Date;
};

function daysAgo(d: Date) { return Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000); }
function followUpDue(a: Application) {
  if (a.status === "OFFER" || a.status === "REJECTED") return false;
  return daysAgo(a.updatedAt) >= 7;
}

function Card({ app, onOpen }: { app: Application; onOpen: (a: Application) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id });
  const due = followUpDue(app);
  const age = daysAgo(app.appliedAt);
  const initial = app.company.charAt(0).toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        marginBottom: 6,
      }}
    >
      <div
        onClick={() => onOpen(app)}
        {...attributes} {...listeners}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DF",
          borderRadius: 8,
          padding: "10px 12px",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          transition: "box-shadow .15s, border-color .15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
              background: "#F5F3EF", border: "1px solid #EAE7E3",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#78716C" }}>{initial}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#78716C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {app.company}
            </span>
          </div>
          {due && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: "#B45309",
              background: "#FEF3C7", borderRadius: 4,
              padding: "1px 5px", flexShrink: 0, letterSpacing: "0.02em",
            }}>
              {daysAgo(app.updatedAt)}D
            </span>
          )}
        </div>

        <p style={{
          fontSize: 13, fontWeight: 600, color: "#1C1917",
          letterSpacing: "-0.01em", lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {app.role}
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginTop: 8, paddingTop: 7, borderTop: "1px solid #F5F3EF",
        }}>
          <span style={{ fontSize: 10, color: "#A8A29E", display: "flex", alignItems: "center", gap: 3 }}>
            <Calendar style={{ width: 9, height: 9 }} strokeWidth={2} />
            {age === 0 ? "Today" : `${age}d`}
          </span>
          {app.salary && (
            <span style={{
              fontSize: 10, color: "#57534E",
              background: "#F5F3EF", borderRadius: 4,
              padding: "0 5px", fontWeight: 500,
              lineHeight: "16px",
            }}>
              {app.salary}
            </span>
          )}
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              style={{ marginLeft: "auto", color: "#F97316", display: "flex", alignItems: "center" }}
            >
              <ExternalLink style={{ width: 11, height: 11 }} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({ status, apps, onOpen }: { status: ApplicationStatus; apps: Application[]; onOpen: (a: Application) => void }) {
  const cfg = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 256, maxWidth: 256, flex: "0 0 256px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "10px 12px 8px",
        background: "#FAFAF8",
        borderRadius: "10px 10px 0 0",
        border: "1px solid #EAE7E3",
        borderBottom: "1px solid #F0EDE8",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#44403C",
          textTransform: "uppercase" as const, letterSpacing: "0.07em", flex: 1,
        }}>
          {cfg.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#A8A29E",
          minWidth: 16, textAlign: "center",
        }}>
          {apps.length}
        </span>
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1, minHeight: 200,
          padding: 6,
          background: isOver ? "#FFF7ED" : "#FAFAF8",
          borderLeft: isOver ? "1px solid #F97316" : "1px solid #EAE7E3",
          borderRight: isOver ? "1px solid #F97316" : "1px solid #EAE7E3",
          borderBottom: isOver ? "1px solid #F97316" : "1px solid #EAE7E3",
          borderRadius: "0 0 10px 10px",
          transition: "background .15s",
        }}
      >
        <SortableContext items={apps.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {apps.map(app => <Card key={app.id} app={app} onOpen={onOpen} />)}
        </SortableContext>

        {apps.length === 0 && !isOver && (
          <div style={{
            padding: "12px 8px", textAlign: "center",
            fontSize: 11, color: "#C4BFBA", fontStyle: "italic",
          }}>
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

function MobileBoard({ apps, onOpen }: { apps: Application[]; onOpen: (a: Application) => void }) {
  const [active, setActive] = useState<ApplicationStatus>("APPLIED");
  const filtered = apps.filter(a => a.status === active);

  return (
    <div>
      {/* Stage tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 14, marginBottom: 14 }}>
        {STATUS_ORDER.map(s => {
          const c = STATUS_CONFIG[s];
          const count = apps.filter(a => a.status === s).length;
          const isActive = s === active;
          return (
            <button key={s} onClick={() => setActive(s)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px", borderRadius: 99,
              flexShrink: 0, fontFamily: "inherit",
              border: isActive ? "1px solid #1C1917" : "1px solid #E4E0DB",
              background: isActive ? "#1C1917" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#57534E",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap" as const,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
              {c.label}
              {count > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  background: isActive ? "rgba(255,255,255,0.18)" : "#F0EDE8",
                  borderRadius: 99, padding: "0 6px",
                  color: isActive ? "#FFFFFF" : "#78716C",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "48px 16px",
          fontSize: 13, color: "#A8A29E",
          background: "#FAFAF8", border: "1px solid #EAE7E3", borderRadius: 12,
        }}>
          No applications in this stage yet.
        </div>
      ) : (
        filtered.map(app => <Card key={app.id} app={app} onOpen={onOpen} />)
      )}
    </div>
  );
}

export function KanbanBoard({ initialApplications }: { initialApplications: Application[] }) {
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [optimisticApps, updateOptimistic] = useOptimistic(
    initialApplications,
    (state: Application[], u: { id: string; status?: ApplicationStatus; deleted?: boolean }) => {
      if (u.deleted) return state.filter(a => a.id !== u.id);
      return state.map(a => a.id === u.id ? { ...a, ...(u.status && { status: u.status }) } : a);
    }
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const activeApp = activeId ? optimisticApps.find(a => a.id === activeId) : null;

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const drag = optimisticApps.find(a => a.id === active.id);
    if (!drag) return;
    const overId = over.id as string;
    const target: ApplicationStatus = STATUS_ORDER.includes(overId as ApplicationStatus)
      ? overId as ApplicationStatus
      : (optimisticApps.find(a => a.id === overId)?.status ?? drag.status);
    if (target === drag.status) return;
    startTransition(async () => {
      updateOptimistic({ id: drag.id, status: target });
      await updateApplicationStatus(drag.id, target);
    });
  }

  const grouped = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = optimisticApps.filter(a => a.status === s);
    return acc;
  }, {} as Record<ApplicationStatus, Application[]>);

  if (!mounted) {
    // Server/initial render: show static columns without DnD to avoid hydration mismatch
    return (
      <div className="hidden lg:block">
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, alignItems: "stretch" }}>
          {STATUS_ORDER.map(s => (
            <Column key={s} status={s} apps={grouped[s]} onOpen={() => {}} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <DndContext sensors={sensors} collisionDetection={closestCorners}
          onDragStart={({ active }) => setActiveId(active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, alignItems: "stretch" }}>
            {STATUS_ORDER.map(s => (
              <Column key={s} status={s} apps={grouped[s]} onOpen={app => setSelectedApp(app)} />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
            {activeApp && (
              <div style={{
                borderRadius: 8, background: "#FFFFFF",
                border: "1px solid #1C1917",
                padding: "10px 12px",
                boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
                width: 256, transform: "rotate(2deg)",
              }}>
                <p style={{ fontSize: 11, color: "#78716C", marginBottom: 4, fontWeight: 500 }}>{activeApp.company}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{activeApp.role}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="block lg:hidden">
        <MobileBoard apps={optimisticApps} onOpen={app => setSelectedApp(app)} />
      </div>

      {selectedApp && (
        <ApplicationDetailDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onDeleted={id => { updateOptimistic({ id, deleted: true }); setSelectedApp(null); }}
        />
      )}
    </>
  );
}
