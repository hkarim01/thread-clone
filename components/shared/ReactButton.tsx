"use client";

import { likeThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";

export interface ReactButtonProps {
  threadId: string;
  userId: string;
  likes: string[];
}

const ReactButton = ({ threadId, userId, likes }: ReactButtonProps) => {
  const pathname = usePathname();
  threadId = JSON.parse(threadId);
  userId = JSON.parse(userId);

  const isAlreadyLiked = likes?.includes(userId);

  const reactToThread = async () => {
    await likeThread({ userId, threadId, isAlreadyLiked, path: pathname });
  };
  return (
    <Image
      src={
        isAlreadyLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"
      }
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={reactToThread}
    />
  );
};

export default ReactButton;
