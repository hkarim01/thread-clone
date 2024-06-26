"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { appRoutes } from "@/lib/route_map";
import FollowButton from "../shared/FollowButton";

export interface UserCardProps {
  currentUserId: string;
  accountIdObject: string;
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
  showButton?: boolean;
  showUnfollow?: boolean;
}

const UserCard = ({
  currentUserId,
  accountIdObject,
  id,
  name,
  username,
  imgUrl,
  personType,
  showButton = true,
  showUnfollow = false,
}: UserCardProps) => {
  const router = useRouter();

  const isCommunity = personType === "Community";

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      {showButton &&
        (showUnfollow ? (
          <FollowButton
            accountId={accountIdObject}
            isFollowed={true}
            currentUserId={currentUserId}
          />
        ) : (
          <Button
            className="user-card_btn"
            onClick={() => {
              if (isCommunity) {
                router.push(appRoutes.communities());
              } else {
                router.push(appRoutes.profile(id));
              }
            }}
          >
            View
          </Button>
        ))}
    </article>
  );
};

export default UserCard;
