import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Book,
  Check,
  Flame,
  Languages,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features } from "../../data/features";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper
        className={cn(
          "min-h-[calc(100vh - 4rem)] overflow-hidden bg-secondary/50"
        )}
      >
        <section
          className={cn(
            "flex items-center",
            "min-h-[calc(100vh-4rem)]",
            "relative",
            "py-10"
          )}
        >
          <div
            className={cn(
              "absolute top-0 right-0",
              "w-2/3",
              "h-full",
              "bg-background transform",
              "skew-x-12",
              "translate-x-32",
              "z-0",
              "hidden md:block"
            )}
          />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
                <Badge
                  variant={"outline"}
                  className={cn(
                    "border-primary/20 bg-primary/10 hover:bg-primary/20",
                    "text-foreground"
                  )}
                >
                  Track your language journey
                </Badge>
                <h1
                  className={cn(
                    "text-4xl md:text-5xl lg:text-7xl font-bold leading-tight",
                    "text-foreground"
                  )}
                >
                  Master languages through
                  <span className="relative ml-2">
                    <span className="relative z-10">Immersion</span>
                    <span
                      className={cn(
                        "absolute bottom-2 left-0",
                        "w-full h-3 md:h-4 -rotate-2 bg-primary/20"
                      )}
                    />
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Track your progress, set goals, and stay motivated on your
                  language journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href="/register"
                    className={buttonVariants({
                      size: "lg",
                      className: "w-full sm:w-auto gap-2",
                    })}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>{" "}
                  <Link
                    href="/about"
                    className={buttonVariants({
                      size: "lg",
                      variant: "outline",
                      className: "w-full sm:w-auto gap-2",
                    })}
                  >
                    Read More <Book className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 relative w-full max-w-lg mx-auto">
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-lg blur-2xl" />{" "}
                  <div className="relative bg-background rounded-lg border shadow-2xl overflow-hidden">
                    <Image
                      src={"/hero.jpg"}
                      alt="Preview of dashboard"
                      width={800}
                      height={800}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t fron-background/80 to-background/0" />
                </div>

                <div className="absolute -top-4 -right-4 bg-background rounded-lg border p-4 shadow-lg hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Yearly target</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>1000 hours completed</span>{" "}
                        <Check className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-background rounded-lg border p-4 shadow-lg hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Languages className="w-4 h-4 text-primary text-orange-500" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">100 days</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>Streak</span> <Flame className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MaxWidthWrapper>
      <section id="features" className="py-16 md:py-20 bg-background">
        <MaxWidthWrapper>
          <div>
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
                Everything you need to track your progress
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Comprehensive tools designed for serious language learners.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 rounded-lg",
                    "border border-border",
                    "bg-card hover:bg-accent",
                    "transition-colors duration-300",
                    "group"
                  )}
                >
                  <div className="space-y-4">
                    <div
                      className={cn(
                        "w-12 h-12",
                        "rounded-lg",
                        "bg-primary/10 group-hover:bg-primary/20",
                        "flex items-center justify-center",
                        "transition-colors duration-300"
                      )}
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-sembiold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
