"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import mongoose from "mongoose";
import { ChatRoomType, MessageType } from "@/types";
import MessageCard from "../cards/MessageCard";
import MessageForm from "../forms/MessageForm";
import { JsonToPlainObject } from "@/lib/utils";
import UserCard from "../cards/UserCard";
import { animateScroll as scroll } from "react-scroll";

const Chat = ({
  chat,
  currentUserId,
}: {
  chat: ChatRoomType;
  currentUserId: mongoose.Schema.Types.ObjectId;
}) => {
  const [messages, setMessages] = useState<MessageType[]>(chat.messages);
  let pusher: any;
  let channel: any;

  const secondaryMember = chat.members.find(
    (member) => JSON.stringify(member._id) !== JSON.stringify(currentUserId)
  );
  if (!secondaryMember) return null;

  useEffect(() => {
    pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
    });

    channel = pusher?.subscribe(JsonToPlainObject(chat._id));

    scroll.scrollToBottom();

    return () => {
      pusher?.unsubscribe(JSON.parse(JSON.stringify(chat._id)));
    };
  }, []);

  useEffect(() => {
    channel?.bind("newMessage", (message: MessageType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      const isOwner =
        JsonToPlainObject(message.author) === JsonToPlainObject(currentUserId);
      if (isOwner) {
        scroll.scrollToBottom();
      }
    });
  }, [messages]);

  return (
    <section>
      <div className="sticky top-[70px] bg-dark-1 p-2 w-full">
        <UserCard
          accountIdObject={JSON.stringify(secondaryMember._id)}
          currentUserId={JSON.stringify(currentUserId)}
          id={secondaryMember.id}
          name={secondaryMember.name}
          username={secondaryMember.username}
          imgUrl={secondaryMember.image}
          personType="User"
          showButton={false}
        />
      </div>
      <div className="mt-10">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2">
            {messages.map((message) => {
              const isOwner =
                JsonToPlainObject(message.author) ===
                JsonToPlainObject(currentUserId);
              return (
                <MessageCard
                  key={JSON.stringify(message._id)}
                  message={message}
                  isOwner={isOwner}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-light-1">No messages</p>
        )}
      </div>
      <div className="sticky bottom-[70px] md:bottom-0 bg-dark-1">
        <MessageForm currentUserId={currentUserId} chatRoomId={chat._id} />
      </div>
    </section>
  );
};

export default Chat;
