import { prisma } from "@/lib/db";
import { Goal } from "@prisma/client";

export async function calculateGoalProgress(goal: Goal) {
  const totalMinutes = await prisma.studySession.aggregate({
    where: {
      userId: goal.userId,
      languageId: goal.languageId,
      type: goal.activityType,
      archived: false,
      date: {
        ...(goal.deadline ? { lte: goal.deadline } : {}),
      },
    },
    _sum: {
      duration: true,
    },
  });

  return totalMinutes._sum.duration ?? 0;
} 