"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addLanguage } from "@/app/actions/languages";
import { COMMON_LANGUAGES } from "../../../data/languages";

const formSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  code: z.string().min(2, "Language code is required"),
  level: z.enum([
    "BEGINNER",
    "ELEMENTARY",
    "INTERMEDIATE",
    "UPPER_INTERMEDIATE",
    "ADVANCED",
    "MASTERY",
  ]),
});

type FormValues = z.infer<typeof formSchema>;

const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "ELEMENTARY", label: "Elementary" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "UPPER_INTERMEDIATE", label: "Upper Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "MASTERY", label: "Mastery" },
] as const;

const AddLanguageForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "BEGINNER",
      code: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await addLanguage(data);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `${data.name} has been added to your languages`,
        });
        form.reset();
        onSuccess?.();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={() => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedLanguage = COMMON_LANGUAGES.find( lang => lang.name === value);
                  if (selectedLanguage) {
                    form.setValue("name", selectedLanguage.name);
                    form.setValue("code", selectedLanguage.code);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    COMMON_LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.name}>
                        {language.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding
              language...
            </>
          ) : (
            "Add language"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddLanguageForm;
