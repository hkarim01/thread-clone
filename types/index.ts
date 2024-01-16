import mongoose from "mongoose";

export interface UserResponse {
  id: string;
  _id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  followers?: [{ id: string; name: string; username: string; image: string }];
  followings?: [{ id: string; name: string; username: string; image: string }];
}

export interface MessageType {
  _id: mongoose.Schema.Types.ObjectId;
  content: string;
  status: "unread" | "read";
  author: UserResponse;
  chatRoom: mongoose.Schema.Types.ObjectId;
  createdAt: string;
}

export interface ChatRoomType {
  _id: mongoose.Schema.Types.ObjectId;
  members: UserResponse[];
  messages: MessageType[];
  updatedAt: Date;
}

// export interface UserInfo extends User {
//   _id?: string;
// }

export interface ThreadType {
  _id: string;
  parentId?: string;
  text: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community?: {
    id: string;
    name: string;
    image: string;
  };
  children: ThreadType[];
  createdAt: Date;
}

export interface ThreadsResponse {
  _id: string;
  text: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
    _id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  likes: string[];
  children: {
    author: {
      image: string;
    };
  };
}
