"use client";

import { ArrowRight, Clock, Flame, History, Plus, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ActivityDistributionChart from "./activity-distribution-chart";
import ActivityHeatmap from "./activity-heatmap";
import { formatMinutes } from "@/lib/time";
import { DashboardContentProps } from "@/types/dashboard";

const DashboardContent = ({ user, userData }: DashboardContentProps ) => {
  const activeGoals = userData?.goals?.filter((goal) => goal.status !== "COMPLETED");

  const [data, setData] = useState(userData);

  useEffect(() => {
    setData(userData);
  }, [userData])


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-4xl mb-3">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/new-session" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          New Session
        </Link>
        <Link
          href="/dashboard/goals/new"
          className={buttonVariants({ variant: "outline" })}
        >
          <Target className="h-4 w-4" />
          Set New Goal
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-4 md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Study Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.statistics.totalMinutes > 0
                    ? data.statistics.totalMinutes < 60
                      ? `${data.statistics.totalMinutes}m`
                      : `${Math.floor(data.statistics.totalMinutes / 60)}h`
                    : "0m"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.statistics.averageMinutesPerDay} mins/day average
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Goals
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.summary.activeGoals}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.summary.completedGoals} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Streak
                </CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.summary.currentStreak || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.summary.successRate?.toFixed(0)}% success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Activity
                </CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.recentSessions?.sessions?.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  sessions this week
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <ActivityDistributionChart 
          sessions={data?.recentSessions?.sessions}
        />
      </div>
      <ActivityHeatmap 
        sessions={data?.recentSessions?.sessions}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recommended Activities</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your recent study patterns
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeGoals?.slice(0, 3)?.map((goal) => {
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{goal.language.name}</span>{" "}
                      (
                      {goal?.activityType?.charAt(0) +
                        goal?.activityType?.slice(1)?.toLowerCase()}
                      )
                      <span className="text-sm text-muted-foreground">
                        • {formatMinutes(goal?.target)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((goal?.progress / goal?.target) * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
            {activeGoals?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No active goals
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Goals</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Your current language learning goals
            </p>
          </div>
          <Link
            href={"/dashboard/goals"}
            className={buttonVariants({ variant: "ghost" })}
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeGoals?.slice(0, 3).map((goal) => {
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{goal.language.name}</span>{" "}
                      (
                      {goal?.activityType?.charAt(0) +
                        goal?.activityType?.slice(1).toLowerCase()}
                      )
                      <span className="text-sm text-muted-foreground">
                        • {formatMinutes(goal.target)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((goal.progress / goal.target) * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
            {activeGoals?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No active goals
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Sessions</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Your latest study sessions
            </p>
          </div>
          <Link
            href={"/dashboard/history"}
            className={buttonVariants({ variant: "ghost" })}
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentSessions.sessions.map((session) => {
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between border border-b p-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {session.language.name}
                      </span>{" "}
                      <span className="text-sm text-muted-foreground">
                        • {formatMinutes(session.duration)}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{session.type}</div>
                </div>
              );
            })}
            {data?.recentSessions?.sessions?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No recent sessions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
