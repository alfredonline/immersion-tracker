import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type AuthConfig = {
  redirect?: boolean;
  required?: boolean;
};

export async function auth(
  config: AuthConfig = { required: true, redirect: true }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log(user);

  if (!user || !user.id || !user.email) {
    if (!config.required) return null;
    if (config.redirect) {
      redirect("/");
    }
    redirect("/");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        languages: {
          select: {
            id: true,
            language: true,
            level: true,
          },
        },
      },
    });

    console.log(`dbUser`, dbUser);



    if (!dbUser) {
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user?.email || "",
          name: user?.given_name
            ? `${user.given_name} ${user.family_name}`
            : "John Doe",
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          languages: {
            select: {
              id: true,
              language: true,
              level: true,
            },
          },
        },
      });

      return newUser;
    }

    return dbUser;
  } catch (error) {
    console.error(error);
    if (!config.required) return null;
    redirect("/");
  }
}
