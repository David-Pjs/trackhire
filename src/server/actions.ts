"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ApplicationStatus } from "@/lib/constants";

async function requireUser(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function getApplications() {
  const userId = await requireUser();
  return db.application.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
  });
}

export async function createApplication(data: {
  company: string;
  role: string;
  status?: ApplicationStatus;
  location?: string;
  jobUrl?: string;
  salary?: string;
  notes?: string;
  appliedAt?: Date;
}) {
  const userId = await requireUser();
  await db.application.create({
    data: {
      userId,
      company: data.company,
      role: data.role,
      status: (data.status as any) ?? "APPLIED",
      location: data.location,
      jobUrl: data.jobUrl,
      salary: data.salary,
      notes: data.notes,
      appliedAt: data.appliedAt ?? new Date(),
    },
  });
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  const userId = await requireUser();
  await db.application.update({
    where: { id, userId },
    data: { status: status as any },
  });
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function updateApplication(
  id: string,
  data: {
    company?: string;
    role?: string;
    status?: ApplicationStatus;
    location?: string;
    jobUrl?: string;
    salary?: string;
    notes?: string;
    appliedAt?: Date;
  }
) {
  const userId = await requireUser();
  await db.application.update({
    where: { id, userId },
    data: {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.status !== undefined && { status: data.status as string }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
      ...(data.salary !== undefined && { salary: data.salary }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.appliedAt !== undefined && { appliedAt: data.appliedAt }),
    },
  });
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function deleteApplication(id: string) {
  const userId = await requireUser();
  await db.application.delete({ where: { id, userId } });
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function getDashboardStats() {
  const userId = await requireUser();
  const apps = await db.application.findMany({
    where: { userId },
    select: { status: true, appliedAt: true },
  });

  const total = apps.length;
  const byStatus = apps.reduce(
    (acc, a) => {
      const key = a.status as string;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const active =
    (byStatus.APPLIED ?? 0) +
    (byStatus.SCREENING ?? 0) +
    (byStatus.INTERVIEW ?? 0);
  const offers = byStatus.OFFER ?? 0;
  const rejected = byStatus.REJECTED ?? 0;
  const responseRate =
    total > 0
      ? Math.round(((total - (byStatus.APPLIED ?? 0)) / total) * 100)
      : 0;

  return { total, active, offers, rejected, responseRate, byStatus };
}
