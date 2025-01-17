import { getLanguages } from "@/app/actions/study-sessions";
import AddLanguageModal from "@/components/add-language-modal";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import LanguagesList from "@/components/dashboard/languages-list";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {

  await auth({
    redirect: true
  })

  const { languages } = await getLanguages()
 
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-8">
        <div className="space-y-6">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-4xl mb-3">Languages</h1>
              <p className="text-muted-foreground text-lg">
                Manage the languages you are learning and add new ones.
              </p>
            </div>
            <AddLanguageModal />
          </div>
        </div>
        <LanguagesList
          languages={languages || []}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
