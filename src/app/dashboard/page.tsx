import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { auth } from "@/lib/auth";
import React from "react";
import { getGoals } from "../actions/goals";
import { getStudySessions } from "../actions/study-sessions";
import { DashboardData, GoalWithLanguage } from "@/types/dashboard";
import { getStatistics } from "../actions/statistics";

const Page = async () => {
  const user = await auth({
    redirect: true,
  });

  const [goalData, recentSessions, statistics] = await Promise.all([
    getGoals(),
    getStudySessions(1, 5),
    getStatistics(),
  ]);

  const dashboardData: DashboardData = {
    goals: goalData.goals as GoalWithLanguage[],
    summary: goalData.summary || { activeGoals: 0, completedGoals: 0, currentStreak: 0, successRate: 0 },
    recentSessions: recentSessions.sessions ? recentSessions : { sessions: [] },
    statistics: {
      totalMinutes: statistics.summary.totalMinutes,
      averageMinutesPerDay: statistics.summary.averageMinutesPerDay || 0,
    },
  };

  const fallbackData: DashboardData = {
    goals: [],
    summary: {
      activeGoals: 0,
      completedGoals: 0,
      currentStreak: 0,
      successRate: 0
    },
    recentSessions: { sessions: [] },
    statistics: { totalMinutes: 0, averageMinutesPerDay: 0 },
  };

  return (
    <MaxWidthWrapper>
      <DashboardContent 
        user={user}
        userData={dashboardData || fallbackData}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
