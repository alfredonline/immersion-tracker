import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import GoalsOverview from "@/components/dashboard/goals-overview";
import { auth } from "@/lib/auth";
import { getGoals } from "@/app/actions/goals";

const page = async () => {
  await auth({
    redirect: true,
  });

  const { goals, summary } = await getGoals();

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl mb-3">Language learning goals</h1>
            <p className="text-muted-foreground">
              Set goals, track progress, and stay motivated on your language
              learning journey.
            </p>
          </div>
          <Link href="/dashboard/goals/new" className={buttonVariants()}>
            <Plus className="h-4 w-4" />
            Add new goal
          </Link>
        </div>
        <div className="grid gap-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active Goals
                </h3>
                <div className="text-2xl font-bold">{summary?.activeGoals}</div>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Completed Goals
                </h3>
                <div className="text-2xl font-bold">
                  {summary?.completedGoals}
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </h3>
                <div className="text-2xl font-bold">
                  {summary?.currentStreak}
                </div>
              </div>
            </div>
          </div>
        </div>
        <GoalsOverview goals={goals ? goals : []} />
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
