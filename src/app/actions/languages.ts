"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const languageSchema = z.object({
  name: z.string(),
  code: z.string().length(2),
  level: z.enum([
    "BEGINNER",
    "ELEMENTARY",
    "INTERMEDIATE",
    "UPPER_INTERMEDIATE",
    "ADVANCED",
    "MASTERY",
  ]),
});

export async function addLanguage(values: z.infer<typeof languageSchema>) {
  try {
    const user = await auth({ required: true });
    if (!user) {
      throw new Error("User not found");
    }

    const validatedFields = languageSchema.parse(values);

    let language = await prisma.language.findUnique({
      where: {
        code: validatedFields.code,
      },
    });

    if (!language) {
      language = await prisma.language.create({
        data: {
          name: validatedFields.name,
          code: validatedFields.code,
        },
      });
    }

    const existingProgress = await prisma.languageProgress.findUnique({
      where: {
        userId_languageId: {
          userId: user.id,
          languageId: language.id,
        },
      },
    });

    if (existingProgress) {
      return {
        error: "You are already learning this language",
      };
    }

    const progress = await prisma.languageProgress.create({
      data: {
        userId: user.id,
        languageId: language.id,
        level: validatedFields.level,
        totalMinutes: 0,
        targetLevel: validatedFields.level,
      },
      include: {
        language: true,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      progress,
    };
  } catch (error) {
    console.error(error)
    return {
      error: "Failed to add language",
    };
  }
}

export async function removeLanguage(
  languageId: string,
  archive: boolean = false
) {
  try {
    const user = await auth({ required: true });
    if (!user) {
      throw new Error("User not found");
    }

    await prisma.$transaction(async (tx) => {
      if (archive) {
        // Archive all associated goals
        await tx.goal.updateMany({
          where: {
            userId: user.id,
            languageId,
          },
          data: {
            archived: true,
          },
        });

        // Archive all associated study sessions
        await tx.studySession.updateMany({
          where: {
            userId: user.id,
            languageId,
          },
          data: {
            archived: true,
          },
        });
      }

      await tx.languageProgress.deleteMany({
        where: {
          userId: user.id,
          languageId,
        },
      });
    });

    revalidatePath("/dashboard/languages");
    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to remove language",
    };
  }
}
