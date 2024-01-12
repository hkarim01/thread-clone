"use server";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { appRoutes } from "../route_map";
import mongoose, { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

export interface updateUserParams {
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export interface fetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function updateUser({
  id,
  username,
  name,
  bio,
  image,
  path,
}: updateUserParams): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id },
      {
        username,
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === appRoutes.editProfile(id)) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const response = await User.findOne({ id: userId })
      .populate({
        path: "followings",
        model: "User",
        select: "id name username image",
      })
      .populate({
        path: "followers",
        model: "User",
        select: "id name username image",
      });
    // .populate({
    //   path: "communities",
    //   model: "Community",
    // });
    return response;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await Thread.find({
      author: userId,
      parentId: { $exists: false },
    })
      .populate({
        path: "author",
        model: User,
        select: "name id image _id",
      })
      .populate({
        path: "community",
        model: Community,
        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
      })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id", // Select the "name" and "_id" fields from the "User" model
        },
      });

    return threads;
  } catch (error: any) {
    throw new Error(`Error fetching user threads: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: fetchUsersParams) {
  try {
    connectToDB();

    const skipAmmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch the users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch the activity: ${error.message}`);
  }
}

export async function followUser({
  currentUserId,
  followUserId,
  path,
}: {
  currentUserId: string;
  followUserId: string;
  path: string;
}) {
  try {
    if (currentUserId === followUserId) {
      throw new Error("Can't follow yourself.");
    }

    connectToDB();

    // Check if the follower and following users exist
    const followUserProfile = await User.findById(followUserId);
    const currentUser = await User.findById(currentUserId);

    if (!followUserProfile || !currentUser) {
      throw new Error("Follower or following user not found");
    }

    // Check if the follower is not already following the user
    if (currentUser.followings?.includes(followUserId)) {
      throw new Error("you are already following the user");
    }

    // Update the follower's followings and the following's followers
    currentUser.followings.push(followUserId);
    await currentUser.save();

    followUserProfile.followers.push(currentUserId);
    await followUserProfile.save();

    revalidatePath(path);
    console.log("User followed successfully");
  } catch (error) {
    console.log("Error following the user", error);
    throw error;
  }
}

export async function unfollowUser({
  currentUserId,
  unfollowUserId,
  path,
}: {
  currentUserId: string;
  unfollowUserId: string;
  path: string;
}) {
  try {
    if (currentUserId === unfollowUserId) {
      throw new Error("Can't unfollow yourself.");
    }

    connectToDB();

    // Check if the follower and following users exist
    const currentUser = await User.findById(currentUserId);
    const unfollowUserProfile = await User.findById(unfollowUserId);

    if (!unfollowUserProfile || !currentUser) {
      throw new Error("Follower or following user not found");
    }

    // Check if the follower is not already following the user
    if (!currentUser.followings.includes(unfollowUserId)) {
      throw new Error("you are not following the user");
    }

    // Update the follower's followings and the following's followers
    currentUser.followings.pull(unfollowUserId);
    await currentUser.save();

    unfollowUserProfile.followers.pull(currentUserId);
    await unfollowUserProfile.save();

    revalidatePath(path);
    console.log("User unfollowed successfully");
  } catch (error) {
    console.log("Error unfollowing the user", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    connectToDB();
    // Find the user to be deleted
    const userToDelete = await User.findById(userId);
    const userThreads = await Thread.find(
      { author: userId },
      { _id: 1, children: 1 }
    );

    const threadIdsToDelete: (string | mongoose.Types.ObjectId)[] = [];
    userThreads.forEach((thread) => {
      threadIdsToDelete.push(thread._id, ...(thread.children || []));
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Get the IDs of users who are following and followers
    const followingUserIds = userToDelete.followings;
    const followerUserIds = userToDelete.followers;

    // Update users who are following
    await User.updateMany(
      { _id: { $in: followingUserIds } },
      { $pull: { followers: userId } }
    );

    // Update users who are followers
    await User.updateMany(
      { _id: { $in: followerUserIds } },
      { $pull: { followings: userId } }
    );

    await Thread.updateMany(
      { children: { $in: threadIdsToDelete } },
      { $pull: { children: threadIdsToDelete } }
    );

    await Thread.deleteMany({
      $or: [
        { _id: { $in: threadIdsToDelete } },
        { parentId: threadIdsToDelete },
      ],
    });

    // Delete the user
    await User.deleteOne({ _id: userId });

    console.log("User deleted successfully");
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
}
