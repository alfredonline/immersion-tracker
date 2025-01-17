"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { SessionWithLanguage } from "@/types/dashboard";
import { ActivityType } from "@prisma/client";

const COLORS = {
  READING: "#22c55e", // green
  LISTENING: "#3b82f6", // blue
  SPEAKING: "#f97316", // orange
  WRITING: "#8b5cf6", // purple
  VOCABULARY: "#ec4899", // pink
  GRAMMAR: "#f43f5e", // red
  IMMERSION: "#06b6d4", // cyan
  OTHER: "#64748b", // slate
};

interface ActivityDistributionChartProps {
  sessions: SessionWithLanguage[];
}

const ActivityDistributionChart = ({
  sessions,
}: ActivityDistributionChartProps) => {
  const distribution = sessions.reduce((acc, session) => {
    const minutes = session.duration;
    acc[session.type] = (acc[session.type] || 0) + minutes;
    return acc;
  }, {} as Record<ActivityType, number>);

  const data = Object.entries(distribution)
    .map(([type, minutes]) => {
      return {
        name: type?.charAt(0) + type?.slice(1).toLowerCase(),
        value: minutes,
        color: COLORS[type as ActivityType],
      };
    })
    ?.filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Activity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                paddingAngle={2}
                dataKey={"value"}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${Math.round(value / 60)} hours`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityDistributionChart;
