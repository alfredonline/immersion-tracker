import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import AddSessionForm from "@/components/forms/AddSessionForm";
import { auth } from "@/lib/auth";
import { getLanguages } from "@/app/actions/study-sessions";

const page = async () => {
  await auth({
    redirect: true,
  });

  const { languages } = await getLanguages();
  const hasLanguages = languages && languages?.length > 0;

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-8">
          <div className="space-y-6">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost" })}
            >
              <ArrowLeft className="h-4 w04 mr-2" />
              Back
            </Link>
            <div>
              <h1 className="font-bold text-4xl mb-3">New Study Session</h1>
              <p className="text-muted-foreground text-lg">
                Track your progress by adding a new study session.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur" />
            <div className="relative">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                {hasLanguages && languages ? (
                  <AddSessionForm usersLanguages={languages} />
                ) : (
                  <div>You have no languages. Please add some.</div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
