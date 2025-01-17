import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Nav from "@/components/dashboard/nav";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen space-y-6 flex-col md:pt-16">
      <MaxWidthWrapper className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Nav />
        </div>
      </MaxWidthWrapper>
      <main className="flex flex-1 w-full flex-col">{children}</main>
      <Toaster />
    </div>
  );
}
