import React from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import MobileNav from "./MobileNav";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const user = await auth({ required: false, redirect: false });
  console.log(`user`, user);

  const navLinks = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "about",
      label: "About",
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/50 backdrop-blur-xl">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Lingua</span>
            <span className="text-2xl font-bold text-primary/90">Track</span>
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={cn(
                  "text-muted-foreground hover:text-primary",
                  "transition-colors duration-300"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center space-x-4">
                <Link href={"/dashboard"} className={cn(
                  "text-muted-foreground hover:text-primary",
                  "transition-colors duration-300"
                )}>
                  Dashboard
                </Link>
                {" "}
                <LogoutLink className={buttonVariants({ variant: "secondary" })}>
                  Logout
                </LogoutLink>
              </div>
            )}
            {!user && (
              <>
                <LoginLink className={buttonVariants({ variant: "ghost" })}>
                  Sign In
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({ variant: "default" })}
                >
                  Sign Up
                </RegisterLink>{" "}
              </>
            )}
          </div>
          <MobileNav navLinks={navLinks} />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
