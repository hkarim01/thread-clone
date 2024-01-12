"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import mongoose from "mongoose";
import { MessageValidation } from "@/lib/validations/message";
import { createMessage } from "@/lib/actions/message.actions";
import { createChatRoom } from "@/lib/actions/chatRoom.actions";
import { ChatRoomType } from "@/types";
import { appRoutes } from "@/lib/route_map";
import { JsonToPlainObject } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";

export interface MessageFormProps {
  currentUserId: mongoose.Schema.Types.ObjectId;
  chatRoomId?: mongoose.Schema.Types.ObjectId;
  secondaryUserId?: mongoose.Schema.Types.ObjectId;
}

const MessageForm = ({
  currentUserId,
  chatRoomId,
  secondaryUserId,
}: MessageFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof MessageValidation>>({
    resolver: zodResolver(MessageValidation),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof MessageValidation>) => {
    setIsLoading(true);
    try {
      if (!chatRoomId) {
        if (secondaryUserId) {
          const members = [currentUserId, secondaryUserId];
          const chatRoom = await createChatRoom(members);
          chatRoomId = chatRoom?._id;
        } else {
          throw new Error("Please select a user to send the message");
        }
      }
      if (chatRoomId) {
        await createMessage({
          content: values.content,
          author: currentUserId,
          chatRoomId,
        });
      }

      if (pathname.includes("/messages/new")) {
        router.push(appRoutes.messages(JsonToPlainObject(chatRoomId)));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="message-form">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-3">
              {/* <FormLabel>
                <div className="relative h-12 w-12">
                  <Image
                    src={currentUserImg}
                    alt="profile image"
                    fill
                    className="rounded-full avatar-image"
                  />
                </div>
              </FormLabel> */}
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Message..."
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
          className="message-form_btn"
          isLoading={isLoading}
        >
          <SendHorizonal size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default MessageForm;
