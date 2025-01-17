"use client";

import { useEffect, useState } from "react";
import {
  CalendarIcon,
  Loader2,
  Book,
  Headphones,
  Mic,
  Pencil,
  BookOpen,
  School,
  Globe,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { ActivityType, Difficulty, Language } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertToMinutes } from "@/lib/time";
import {
  StudySessionInput,
  studySessionInputSchema,
} from "@/lib/schemas/study-session";
import { Calendar } from "../ui/calendar";
import { createStudySession } from "@/app/actions/study-sessions";

const activityIcons: Record<ActivityType, React.ReactNode> = {
  READING: <Book />,
  LISTENING: <Headphones />,
  SPEAKING: <Mic />,
  WRITING: <Pencil />,
  VOCABULARY: <BookOpen />,
  GRAMMAR: <School />,
  IMMERSION: <Globe />,
  OTHER: <MoreHorizontal />,
};

const AddSessionForm = ({ usersLanguages }: { usersLanguages: Language[] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Language[]>(usersLanguages);

  useEffect(() => {
    setLanguages(usersLanguages);
  }, [usersLanguages]);

  const form = useForm<StudySessionInput>({
    resolver: zodResolver(studySessionInputSchema),
    defaultValues: {
      date: new Date(),
      hours: 0,
      minutes: 0,
      type: ActivityType.READING,
      description: "",
      difficulty: Difficulty.EASY,
      languageId: undefined,
    },
  });

  const onSubmit = async (data: StudySessionInput) => {
    const duration = convertToMinutes(data.hours, data.minutes);
    setIsLoading(true);

    try {
      const result = await createStudySession({
        languageId: data.languageId,
        date: data.date,
        duration,
        type: data.type,
        description: data.description || null,
        difficulty: data.difficulty || null,
      });

      if (result.error) {
        console.error("Error creating study session", result.error);
        toast({
          title: "An error occurred",
          description: "Something went wrong!",
        });
        return;
      }

      toast({
        title: "Study session added!",
        description: "Your study session has been successfully added.",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating study session", error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
      });
      console.log("There is an error!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-background/60">
      <CardHeader className="border-b bg-muted/50 pb-8">
        <h2 className="text-2xl font-bold">Add Study Session</h2>
        <p className="text-sm text-muted-foreground">
          Record your language learning activity.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="languageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="w-full justify-start text-left"
                    >
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2023-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={24}
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Activity Type</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(ActivityType).map(([key, value]) => (
                      <Button
                        key={key}
                        type="button"
                        variant={field.value === value ? "default" : "outline"}
                        onClick={() => field.onChange(value)}
                      >
                        {activityIcons[value]}
                        <span className="ml-2">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).toLowerCase()}
                        </span>
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Difficulty</FormLabel>
                  <div className="flex gap-2">
                    {(
                      Object.keys(Difficulty) as Array<keyof typeof Difficulty>
                    ).map((key) => (
                      <Button
                        key={Difficulty[key]}
                        type="button"
                        variant={
                          field.value === Difficulty[key]
                            ? "default"
                            : "outline"
                        }
                        onClick={() => field.onChange(Difficulty[key])}
                      >
                        {key
                          .split("_")
                          .map(
                            (word) =>
                              word?.charAt(0) + word?.slice(1)?.toLowerCase()
                          )
                          .join(" ")}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <Textarea
                      placeholder="What did you learn? Any challenges or achievements?"
                      {...field}
                      className="resize-none"
                      maxLength={250}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Add any notes about your study session.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding
                  Session...
                </>
              ) : (
                "Add Session"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddSessionForm;
