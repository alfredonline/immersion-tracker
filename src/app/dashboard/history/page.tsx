import { getStudySessions } from "@/app/actions/study-sessions";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import StudyHistoryTable from "@/components/dashboard/study-history-table";
import { auth } from "@/lib/auth";
import React from "react";

const page = async () => {
  await auth({
    redirect: true,
  });

  const initialData = await getStudySessions(1, 10)

  return (
    <MaxWidthWrapper className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-bold text-4xl mb-3">Study History</h1>
          <p className="text-muted-foreground text-lg">
            Track your learning history and see your progress.
          </p>
        </div>
        <StudyHistoryTable initialData={initialData}/>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
