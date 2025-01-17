import { ActivityType, Difficulty, Level, GoalStatus } from "@prisma/client";

export type UserWithLanguages = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  languages: {
    language: {
      id: string;
      name: string;
      code: string;
    };
    id: string;
    level: Level;
  }[];
} | null;

export type GoalWithLanguage = {
  id: string;
  language: {
    id: string;
    name: string;
  };
  status: GoalStatus;
  target: number;
  progress: number;
  deadline: Date | null;
  activityType: ActivityType;
};

export type SessionWithLanguage = {
  id: string;
  date: Date;
  duration: number;
  type: ActivityType;
  description: string | null;
  difficulty: Difficulty | null;
  language: {
    id: string;
    name: string;
  };
};

export type DashboardData = {
  goals: GoalWithLanguage[];
  summary: {
    activeGoals: number;
    completedGoals: number;
    currentStreak: number;
    successRate: number;
  };
  recentSessions: {
    sessions: SessionWithLanguage[];
  };
  statistics: {
    totalMinutes: number;
    averageMinutesPerDay: number;
  };
  error?: string;
};

export type DashboardContentProps = {
  user: UserWithLanguages;
  userData: DashboardData;
}; 