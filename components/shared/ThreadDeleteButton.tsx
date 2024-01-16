"use client";

import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

const ThreadDeleteButton = ({ threadId }: { threadId: string }) => {
  threadId = JSON.parse(threadId);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteThread = async () => {
    setIsLoading(true);
    await deleteThread({ threadId, path: pathname });
    setIsLoading(false);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isLoading ? (
          <Image
            src="/assets/loaderSimple.svg"
            alt="delete"
            width={16}
            height={16}
            className="cursor-pointer object-contain"
          />
        ) : (
          <Trash
            size={16}
            color="rgb(248 113 113)"
            strokeWidth={1}
            className="cursor-pointer"
          />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            thread.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-400"
            onClick={handleDeleteThread}
          >
            {isLoading ? "please wait..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ThreadDeleteButton;
