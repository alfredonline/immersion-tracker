import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ArchivedSessionsView from "@/components/dashboard/archived-sessions-view";
import { auth } from "@/lib/auth";

const Page = async () => {
  await auth({
    redirect: true,
  });



  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-8">
        <div>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "mb-6",
            })}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="font-bold text-4xl mb-3">Archived Sessions</h1>
          <p className="text-muted-foreground text-lg">
            View and manage your archived study sessions.
          </p>
        </div>
        <ArchivedSessionsView />
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
