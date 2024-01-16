import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { appRoutes } from "@/lib/route_map";
import { Pencil } from "lucide-react";
import ProfileEditButton from "./ProfileEditButton";

export interface ProfileHeaderProps {
  accountId: string;
  currentUserIdObject: string;
  currentUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  isFollowed?: boolean;
  type?: "User" | "Community";
}

const ProfileHeader = ({
  accountId,
  currentUserIdObject,
  currentUserId,
  name,
  username,
  imgUrl,
  bio,
  isFollowed,
  type,
}: ProfileHeaderProps) => {
  const isOwner = accountId === currentUserIdObject;

  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl border border-gray-800"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        {isOwner && <ProfileEditButton currentUserId={currentUserId} />}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      {type !== "Community" && !isOwner && (
        <FollowButton
          currentUserId={currentUserIdObject}
          accountId={accountId}
          isFollowed={isFollowed as boolean}
        />
      )}

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
