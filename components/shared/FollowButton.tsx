"use client";

import { useState } from "react";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
// import { useUserAuth } from "@/lib/contexts/UserAuthContext";

export interface FollowButtonProps {
  currentUserId: string;
  accountId: string;
  isFollowed: boolean;
}

const FollowButton = ({
  accountId,
  isFollowed,
  currentUserId,
}: FollowButtonProps) => {
  // const { authUser } = useUserAuth();
  currentUserId = JSON.parse(currentUserId);
  accountId = JSON.parse(accountId);

  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    if (isFollowed) {
      await unfollowUser({
        currentUserId: currentUserId,
        unfollowUserId: accountId,
        path: pathname,
      });
    } else {
      await followUser({
        currentUserId: currentUserId,
        followUserId: accountId,
        path: pathname,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-10">
      <Button
        className={`${
          isFollowed
            ? "bg-dark-2 text-light-2 border border-gray-800"
            : "bg-primary-500"
        } rounded-full w-32`}
        onClick={handleFollow}
        isLoading={isLoading}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowButton;
