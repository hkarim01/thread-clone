export interface User {
  id?: string;
  objectId?: string;
  username?: string;
  name?: string;
  bio?: string;
  image?: string;
}

export interface UserInfo extends User {
  _id?: string;
}

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
