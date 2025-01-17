"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import { isEqual, subYears, format } from "date-fns";
import { SessionWithLanguage } from "@/types/dashboard";
import { formatMinutes } from "@/lib/time";
import "react-calendar-heatmap/dist/styles.css";


interface ActivityHeatmapProps {
  sessions?: SessionWithLanguage[];
}

interface HeatmapValue {
  date: Date;
  count: number;
  minutes: number;
}

const ActivityHeatmap = ({
  sessions = [
    {
      date: new Date(),
      duration: 60,
      id: "123",
      type: "READING",
      description: "Practice session",
      difficulty: "EASY",
      language: {
        id: "en",
        name: "English",
      },
    },
  ],
}: ActivityHeatmapProps) => {
  const endDate = new Date();
  const startDate = subYears(endDate, 1);

  const sessionsByDate = sessions
    .filter((session) => {
      const date = new Date(session.date);
      return !isNaN(date.getTime()) && date <= endDate && date >= startDate;
    })
    .reduce((acc, session) => {
      const date = new Date(session.date);
      date.setHours(0, 0, 0, 0);

      const existing = acc.find((item: HeatmapValue) =>
        isEqual(item.date, date)
      );
      if (existing) {
        existing.count += 1;
        existing.minutes = Math.max(0, existing.minutes + session.duration);
      } else {
        acc.push({
          date,
          count: 1,
          minutes: Math.max(0, session.duration),
        });
      }

      return acc;
    }, [] as HeatmapValue[]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="pt-2">
            <ReactCalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={sessionsByDate}
              titleForValue={(value) => {
                if (!value) return "No sessions";
                return `${value.count} sessions (${formatMinutes(
                  value.minutes
                )}) on ${format(value.date, "MMM d, yyyy")}`;
              }}
              showWeekdayLabels
            />
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;
