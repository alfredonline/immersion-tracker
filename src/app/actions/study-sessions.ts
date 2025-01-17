"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ActivityType, Difficulty } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { checkAndUpdateGoalStatus } from "./goals";
import { StudySessionInput } from "@/lib/schemas/study-session";

export interface GetStudySessionsFilters {
  language?: string;
  activity?: ActivityType;
  search?: string;
  archived?: boolean;
}

export async function getStudySessions(
  page = 1,
  limit = 10,
  filters: GetStudySessionsFilters = {}
) {
  try {
    const user = await auth({ required: true });

    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
      archived: filters.archived ?? false,
      ...(filters.language ? { languageId: filters.language } : {}),
      ...(filters.activity ? { type: filters.activity } : {}),
    };

    const sessions = await prisma.studySession.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        duration: true,
        type: true,
        description: true,
        difficulty: true,
        language: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const total = await prisma.studySession.count({ where });

    return {
      sessions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    };
  } catch (error) {
    console.error("error getting study sessions", error);
    return {
      sessions: [],
      pagination: {
        total: 0,
        pages: 0,
        current: page,
      },
    };
  }
}

export async function getLanguages() {
  try {
    const user = await auth({ required: true });
    if (!user) {
      throw new Error("User not found");
    }

    const progress = await prisma.languageProgress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        language: true,
      },
    });

    const languages = progress.map((p) => p.language);

    return {
      languages,
    };
  } catch (error) {
    console.error("error getting languages", error);
    return {
      languages: [],
    };
  }
}

export async function createStudySession(data: {
  languageId: string;
  date: Date;
  duration: number;
  type: ActivityType;
  description: string | null;
  difficulty: Difficulty | null;
}) {
  try {
    const user = await auth({ required: true });
    if (!user) throw new Error("User not found");

    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        ...data,
      },
    });

    const affectedGoals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        languageId: data.languageId,
        activityType: data.type,
        archived: false,
      },
    });

    for (const goal of affectedGoals) {
      await checkAndUpdateGoalStatus(goal.id);
    }

    revalidatePath("/dashboard");
    return { session };
  } catch (error) {
    console.error("error creating session", error);
    return { error: "Failed to create session" };
  }
}

export async function toggleSessionArchive(sessionId: string) {
  try {
    const user = await auth({ required: true });
    if (!user) throw new Error("User not found");
    const session = await prisma.studySession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        userId: true,
        archived: true,
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    const updatedSession = await prisma.studySession.update({
      where: {
        id: sessionId,
      },
      data: {
        archived: !session.archived,
      },
    });

    revalidatePath("/dashboard/history");
    return { success: true, archived: updatedSession.archived };
  } catch (error) {
    console.error("error toggling session archive", error);
    return { error: "Failed to toggle archive" };
  }
}

export async function updateSession(
  sessionId: string,
  data: StudySessionInput & { duration: number }
) {
  try {
    const user = await auth({ required: true });
    if (!user) throw new Error("User not found");

    const existingSession = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!existingSession) {
      throw new Error("Session not found");
    }

    await prisma.studySession.update({
      where: {
        id: sessionId,
      },
      data: {
        languageId: data.languageId,
        date: data.date,
        duration: data.duration,
        type: data.type,
        description: data.description,
        difficulty: data.difficulty,
      },
    });


    const affectedGoals = await prisma.goal.findMany({
      where: {
        userId: user.id, 
        languageId: data.languageId,
        activityType: data.type,
        archived: false,
      }
    });

    for (const goal of affectedGoals) {
      await checkAndUpdateGoalStatus(goal.id);
    }

    revalidatePath("/dashboard/history")
    return { success: true}

  } catch (error) {
    console.error("error updating session", error);
    return { error: "Failed to update session" };
  }
}
