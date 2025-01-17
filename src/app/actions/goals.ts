"use server";

import { Goal, GoalStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { calculateGoalProgress } from "@/lib/utils/goal-progress";
import { auth } from "@/lib/auth";
import { isSameDay, startOfDay, subDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { GoalCreateInput } from "@/lib/schemas/goal";

interface GoalSummary {
  activeGoals: number;
  completedGoals: number;
  currentStreak: number;
  successRate: number;
}

function calculateSummary(goals: Goal[]): GoalSummary {
  const activeGoals = goals.filter(
    (goal) => goal.status !== "COMPLETED"
  ).length;
  const completedGoals = goals.filter(
    (goal) => goal.status === "COMPLETED"
  ).length;
  const totalGoals = goals.length;
  const successRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const currentStreak = 0;

  return {
    activeGoals,
    completedGoals,
    successRate,
    currentStreak,
  };
}

export async function checkAndUpdateGoalStatus(goalId: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
      },
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    const progress = await calculateGoalProgress(goal);
    let newStatus: GoalStatus = goal.status;

    if (progress >= goal.target) {
      newStatus = "COMPLETED";
    } else if (progress > 0) {
      newStatus = "IN_PROGRESS";
    } else {
      newStatus = "NOT_STARTED";
    }

    if (newStatus !== goal.status) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { status: newStatus },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error checking and updating goals", error);
    return {
      error: "Error checking and updating goals",
    };
  }
}

export async function calculateGoalStreak(userId: string) {
  try {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const recentSessions = await prisma.studySession.findMany({
      where: {
        userId,
        archived: false,
        date: {
          gte: yesterday,
          lte: today,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    console.log(`Recent sessions for user ${userId}`, recentSessions);

    if (!recentSessions.length) {
      return 0;
    }

    const hasToday = recentSessions.map((session) =>
      isSameDay(new Date(session.date), today)
    );
    const hasYesterday = recentSessions.map((session) =>
      isSameDay(new Date(session.date), yesterday)
    );

    if (!hasToday && !hasYesterday) {
      return 0;
    }

    let currentDate = hasToday ? today : yesterday;
    let streak = 1;

    while (true) {
      const checkDate = subDays(currentDate, 1);
      const hasActivity = await prisma.studySession.findFirst({
        where: {
          userId,
          archived: false,
          date: {
            gte: startOfDay(checkDate),
            lt: startOfDay(subDays(checkDate, -1)),
          },
        },
      });

      if (!hasActivity) {
        break;
      }

      streak++;
      currentDate = checkDate;

      if (streak > 365) {
        console.warn(`Streak is over 365 days for user ${userId}`);
        streak = 365;
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating goal streak", error);
    return 0;
  }
}

const streakCache = new Map<string, { streak: number; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60;

export async function getGoalStreakWithCache(userId: string) {
  const now = Date.now();
  const cached = streakCache.get(userId);

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.streak;
  }

  const streak = await calculateGoalStreak(userId);

  streakCache.set(userId, { streak, timestamp: now });

  return streak;
}

export async function getGoals(languageId?: string) {
  try {
    const user = await auth({ redirect: true });

    if (!user) {
      throw new Error("User not found");
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        archived: false,
        ...(languageId && languageId !== "all" ? { languageId } : {}),
      },
      include: {
        language: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progress = await calculateGoalProgress(goal);
        const status: GoalStatus =
          progress >= goal.target
            ? "COMPLETED"
            : progress > 0
            ? "IN_PROGRESS"
            : "NOT_STARTED";

        return {
          ...goal,
          progress,
          status,
        };
      })
    );

    const summary = calculateSummary(goalsWithProgress);

    summary.currentStreak = await getGoalStreakWithCache(user.id);

    return {
      goals: goalsWithProgress,
      summary,
    };
  } catch (error) {
    console.error("Error getting goals", error);
    return {
      error: "Error getting goals",
    };
  }
}

export async function deleteGoal(goalId: string) {
  try {
    const user = await auth({ required: true });
    if (!user) {
      throw new Error("User not found");
    }

    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: user.id,
      },
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    if (goal.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    revalidatePath("/dashboard/goals");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error)
    return {
      error: "Error deleting goal",
    };
  }
}

export async function createGoal(input: GoalCreateInput) {
  try {
    const user = await auth({ required: true });
    if (!user) {
      throw new Error("User not found");
    }

    const currentDate = new Date();

    const futureDate = new Date(currentDate);

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        languageId: input.languageId,
        target: input.target,
        deadline: input.deadline || futureDate.setFullYear(futureDate.getFullYear() + 10).toLocaleString(),
        activityType: input.activityType,
      }
    })

    return { 
      goal
    }
  } catch (error) {
    console.error("Error creating goal", error);
    return {
      error: "Error creating goal",
    };
  }
}