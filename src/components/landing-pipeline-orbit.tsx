"use client";

import { Send, Phone, Users, Gift, XCircle } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const PIPELINE_TIMELINE = [
  {
    id: 1, title: "Applied", date: "Stage 1",
    content: "Log every application instantly. Company, role, date, salary, and job URL all in one place.",
    category: "Pipeline", icon: Send, relatedIds: [2, 5],
    status: "completed" as const, energy: 100,
  },
  {
    id: 2, title: "Screening", date: "Stage 2",
    content: "Know when recruiters reach out. Move the card, stay on top of follow-ups automatically.",
    category: "Pipeline", icon: Phone, relatedIds: [1, 3],
    status: "completed" as const, energy: 80,
  },
  {
    id: 3, title: "Interview", date: "Stage 3",
    content: "Track interview rounds and prep notes. Never miss a scheduled call again.",
    category: "Pipeline", icon: Users, relatedIds: [2, 4],
    status: "in-progress" as const, energy: 60,
  },
  {
    id: 4, title: "Offer", date: "Stage 4",
    content: "You got an offer. Compare packages, track salary details, and make the right call.",
    category: "Pipeline", icon: Gift, relatedIds: [3],
    status: "pending" as const, energy: 30,
  },
  {
    id: 5, title: "Rejected", date: "Stage 5",
    content: "Track rejections too. Patterns in the data help you improve your approach over time.",
    category: "Pipeline", icon: XCircle, relatedIds: [1],
    status: "pending" as const, energy: 15,
  },
];

export function LandingPipelineOrbit() {
  return <RadialOrbitalTimeline timelineData={PIPELINE_TIMELINE} />;
}
