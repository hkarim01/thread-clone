"use server";

import mongoose from "mongoose";
import ChatRoom from "../models/chatRoom.model";
import Message from "../models/message.model";
import { connectToDB } from "../mongoose";
import Pusher from "pusher";
import { JsonToPlainObject } from "../utils";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
});

export async function createMessage({
  content,
  author,
  chatRoomId,
}: {
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  chatRoomId: mongoose.Schema.Types.ObjectId;
}) {
  try {
    connectToDB();

    const chat = await ChatRoom.findById(chatRoomId);

    if (!chat) {
      throw new Error(`Invalid chat Id: ${chatRoomId}`);
    }

    const createdMessage = await Message.create({
      content,
      author,
      chatRoom: chatRoomId,
    });

    chat.messages.push(createdMessage._id);
    await chat.save();

    pusher.trigger(JsonToPlainObject(chatRoomId), "newMessage", createdMessage);
  } catch (error) {
    console.log("Error creating the message: ", error);
    throw error;
  }
}
