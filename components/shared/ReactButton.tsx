"use client";

import { likeThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface ReactButtonProps {
  threadId: string;
  userId: string;
  likes: string[];
}

const ReactButton = ({ threadId, userId, likes }: ReactButtonProps) => {
  threadId = JSON.parse(threadId);
  userId = JSON.parse(userId);

  const [isLiked, setIsLiked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLiked(likes?.includes(userId));
  }, [likes, userId]);

  const reactToThread = async () => {
    const currentState = isLiked;
    setIsLiked((prev) => !prev);

    await likeThread({
      userId,
      threadId,
      isLiked: currentState,
      path: pathname,
    });
  };

  return (
    <Image
      src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={reactToThread}
    />
  );
};

export default ReactButton;
