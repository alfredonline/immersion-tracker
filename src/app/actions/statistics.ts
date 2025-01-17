"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startOfDay, subDays, format, addDays } from "date-fns";
import { getGoalStreakWithCache } from "./goals";

export interface StatisticsData {
  dailyProgress: {
    date: string;
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  }[];
  summary: {
    averageMinutesPerDay?: number;
    totalMinutes: number;
    currentStreak: number;
  };
}

export async function getStatistics(
  timeframe: string = "week"
): Promise<StatisticsData> {
  try {
    const user = await auth({ required: true });
    if (!user) throw new Error("User not found");

    const today = startOfDay(new Date());
    const daysToLookBack =
      timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365;
    const startDate = subDays(today, daysToLookBack - 1);

    console.log("Query parameters:", {
      userId: user.id,
      startDate: startDate.toISOString(),
      endDate: today.toISOString(),
    });

    // Get all study sessions within the timeframe
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        archived: false,
        date: {
          gte: startDate,
          lte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log("Found sessions:", sessions);

    // Initialize daily progress data
    const dailyProgress: StatisticsData["dailyProgress"] = [];
    for (let i = 0; i < daysToLookBack; i++) {
      const date = format(addDays(startDate, i), "yyyy-MM-dd");
      dailyProgress.push({
        date,
        reading: 0,
        listening: 0,
        speaking: 0,
        writing: 0,
      });
    }

    console.log("Initial daily progress:", dailyProgress);

    // Calculate daily progress
    sessions.forEach((session) => {
      const dateStr = format(session.date, "yyyy-MM-dd");
      const dayData = dailyProgress.find((d) => d.date === dateStr);
      if (dayData) {
        switch (session.type) {
          case "READING":
            dayData.reading += session.duration;
            break;
          case "LISTENING":
            dayData.listening += session.duration;
            break;
          case "SPEAKING":
            dayData.speaking += session.duration;
            break;
          case "WRITING":
            dayData.writing += session.duration;
            break;
        }
      }
    });

    console.log("Final daily progress:", dailyProgress);

    // Calculate summary statistics
    const totalMinutes = sessions.reduce(
      (acc, session) => acc + session.duration,
      0
    );
    const averageMinutesPerDay = Math.round(totalMinutes / daysToLookBack);
    const currentStreak = await getGoalStreakWithCache(user.id);

    return {
      dailyProgress,
      summary: {
        totalMinutes,
        averageMinutesPerDay,
        currentStreak,
      },
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      dailyProgress: [],
      summary: {
        currentStreak: 0,
        totalMinutes: 0,
        averageMinutesPerDay: 0
    },
    };
  }
}
