"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

const MobileNav = ({
  navLinks,
}: {
  navLinks: { href: string; label: string }[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant={"ghost"} size={"icon"}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Lingua</span>
              <span className="text-2xl font-bold text-primary/90">Track</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
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
          <LoginLink
            className={buttonVariants({ variant: "ghost" })}
          >
            Sign In
          </LoginLink>
          <RegisterLink
            className={buttonVariants({ variant: "default" })}
          >
            Sign Up
          </RegisterLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
