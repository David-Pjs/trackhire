export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    color: string;        // text color class
    bg: string;           // background color class
    dot: string;          // inline hex for the dot
    order: number;
  }
> = {
  APPLIED: {
    label: "Applied",
    color: "text-[#3B82F6]",
    bg: "bg-[#1D3461]",
    dot: "#3B82F6",
    order: 0,
  },
  SCREENING: {
    label: "Screening",
    color: "text-[#A855F7]",
    bg: "bg-[#3B1060]",
    dot: "#A855F7",
    order: 1,
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-[#F59E0B]",
    bg: "bg-[#451A03]",
    dot: "#F59E0B",
    order: 2,
  },
  OFFER: {
    label: "Offer",
    color: "text-[#22C55E]",
    bg: "bg-[#052E16]",
    dot: "#22C55E",
    order: 3,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-[#6B7280]",
    bg: "bg-[#1F2937]",
    dot: "#6B7280",
    order: 4,
  },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];
