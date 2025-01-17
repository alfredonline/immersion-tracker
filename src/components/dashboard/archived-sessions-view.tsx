"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { formatMinutes } from "@/lib/time";
import { format } from "date-fns";
import { Archive, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { SessionWithLanguage } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";
import {
  getStudySessions,
  toggleSessionArchive,
} from "@/app/actions/study-sessions";

interface ArchivedSessionsState {
  sessions: SessionWithLanguage[];
  pagination: {
    total: number;
    pages: number;
    current: number;
  };
}

const ArchivedSessionsView = () => {
  const [data, setData] = useState<ArchivedSessionsState>({
    sessions: [],
    pagination: {
      total: 0,
      pages: 0,
      current: 1,
    },
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const result = await getStudySessions(1, 100, { archived: true });
    setData(result);
    setLoading(false);
  }

  async function handleUnarchive(sessionId: string) {
    const result = await toggleSessionArchive(sessionId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Session unarchived successfully",
      });

      setData((prevData) => ({
        ...prevData,
        sessions: prevData.sessions.filter((s) => s.id !== sessionId),
      }));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archived Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.sessions?.map((session) => {
            return (
              <div
                key={session.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{session.language.name}</span>
                    <span className="text-sm text-muted-foreground">
                      • {formatMinutes(session.duration)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(session.date), "PPP")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleUnarchive(session.id);
                  }}
                >
                  <Archive className="h-4 w-4" />
                  Unarchive
                </Button>
              </div>
            );
          })}
        </div>
        {data?.sessions?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No archived sessions found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArchivedSessionsView;
