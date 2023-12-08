"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

export interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setIsLoading(true);
    try {
      await addCommentToThread({
        threadId,
        commentText: values.thread,
        userId: JSON.parse(currentUserId),
        path: pathname,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-3">
              <FormLabel>
                <div className="relative h-12 w-12">
                  <Image
                    src={currentUserImg}
                    alt="profile image"
                    fill
                    className="rounded-full avatar-image"
                  />
                </div>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  autoComplete="off"
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type={"submit"}
          className="comment-form_btn"
          isLoading={isLoading}
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
