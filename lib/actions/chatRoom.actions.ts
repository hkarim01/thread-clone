"use server";

import mongoose from "mongoose";
import ChatRoom from "../models/chatRoom.model";
import { connectToDB } from "../mongoose";
import Message from "../models/message.model";
import User from "../models/user.model";
import { JsonToPlainObject } from "../utils";

export async function fetchUserChats(userId: string) {
  try {
    connectToDB();

    const chats = await ChatRoom.find({ members: userId })
      .sort({ updatedAt: "desc" })
      .populate({
        path: "members",
        model: User,
        select: "id name username image",
      });

    return chats;
  } catch (error) {
    console.log("Error fetching the chats", error);
    throw error;
  }
}

export async function fetchChat(id: string) {
  try {
    connectToDB();

    const chat = await ChatRoom.findById(id)
      .populate({
        path: "messages",
        model: Message,
        options: { sort: { createdAt: "asc" } },
      })
      .populate({
        path: "members",
        model: User,
        select: "id name username image",
      });

    return chat;
  } catch (error) {
    console.log("Error fetching the chats", error);
    throw error;
  }
}

export async function createChatRoom(
  members: mongoose.Schema.Types.ObjectId[]
) {
  try {
    const chatRoom = await ChatRoom.create({
      members,
    });

    return JsonToPlainObject(chatRoom);
  } catch (error) {
    console.log("Error Creating the chatroom: ", error);
    throw error;
  }
}
