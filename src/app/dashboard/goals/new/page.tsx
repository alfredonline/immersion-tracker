import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import AddGoalForm from "@/components/forms/AddGoalForm";
import { auth } from "@/lib/auth";
import { getLanguages } from "@/app/actions/study-sessions";
const page = async () => {
  await auth({
    redirect: true,
  });

  const { languages } = await getLanguages();

  return (
    <MaxWidthWrapper className="py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-background/60">
          <CardHeader className="border-b bg-muted/50 pb-8">
            <h1 className="text-2xl font-bold">Set new goal</h1>
            <p className="text-sm text-muted-foreground">
              Define a new goal to track your language learning progress.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <AddGoalForm languages={languages}/>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
