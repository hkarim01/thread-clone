import Chat from "@/components/shared/Chat";
import { fetchChat } from "@/lib/actions/chatRoom.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  const chat = JSON.parse(JSON.stringify(await fetchChat(params.id)));

  return (
    <section>
      <Chat chat={chat} currentUserId={userInfo._id} />
    </section>
  );
};

export default page;
