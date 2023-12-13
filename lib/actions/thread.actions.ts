"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose";

export interface createThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export interface addCommentToThreadParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: createThreadParams) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update user
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB();

    // TODO: Populate community
    const threadQuery = Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({ path: "community", model: Community })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      });

    const thread = await threadQuery.exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch the thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalThreads = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreads > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch the threads: ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: addCommentToThreadParams) {
  try {
    connectToDB();

    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add the comment: ${error.message}`);
  }
}

export async function likeThread({
  userId,
  threadId,
  isLiked,
  path,
}: {
  userId: string;
  threadId: string;
  isLiked: boolean;
  path: string;
}) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId);

    if (userId) {
      isLiked ? thread.likes.pull(userId) : thread.likes.push(userId);
      await thread.save();
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Failed to like the thread: ", error);
    throw error;
  }
}
