"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ActivityType, Difficulty } from "@prisma/client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { convertFromMinutes, convertToMinutes } from "@/lib/time";
import {
  StudySessionInput,
  studySessionInputSchema,
} from "@/lib/schemas/study-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { FormDescription } from "./ui/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { updateSession } from "@/app/actions/study-sessions";

interface EditSessionDialogProps {
  session: {
    id: string;
    date: Date;
    duration: number;
    type: ActivityType;
    description?: string | null;
    difficulty?: Difficulty | null;
    language: {
      id: string;
      name: string;
    };
  };
  languages: {
    id: string;
    name: string;
  }[];
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

const EditSessionDialog = ({
  session,
  languages,
  trigger,
  onSuccess,
}: EditSessionDialogProps) => {
  const { toast } = useToast();
  const { hours, minutes } = convertFromMinutes(session.duration);

  const form = useForm<StudySessionInput>({
    resolver: zodResolver(studySessionInputSchema),
    defaultValues: {
      languageId: session.language.id,
      date: new Date(session.date),
      hours,
      minutes,
      type: session.type,
      description: session.description || undefined,
      difficulty: session.difficulty || undefined,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: StudySessionInput) {
    try {
      setIsLoading(true);
      const duration = convertToMinutes(data.hours, data.minutes);
      const result = await updateSession(session.id, {
        ...data,
        duration,
      });
      if (result.error) {
        toast({
          title: "An error occurred",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Session updated",
        description: "Your session has been updated successfully.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Failed to update session", error);
      toast({
        title: "An error occurred",
        description: "An error occurred while updating the session.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit study session</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="languageId"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
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
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormItem className="mt-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full mt-4">
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ActivityType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type?.charAt(0) + type?.slice(1)?.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                  <span>Adding session...</span>
                </>
              ) : (
                <span>Add Session</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSessionDialog;
