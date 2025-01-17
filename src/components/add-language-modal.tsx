"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import React from "react";
import AddLanguageForm from "./forms/AddLanguageForm";

const AddLanguageModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
      >
        <Button variant={"outline"} size={"sm"}>
          <Plus className="h-4 w-4" />
          Add language
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new language</DialogTitle>
          <DialogDescription>
            Add a new language to your learning list.
          </DialogDescription>
        </DialogHeader>
        <AddLanguageForm 
            onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLanguageModal;
