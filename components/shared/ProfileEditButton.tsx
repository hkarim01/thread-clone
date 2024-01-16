"use client";

import { appRoutes } from "@/lib/route_map";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const ProfileEditButton = ({ currentUserId }: { currentUserId: string }) => {
  const router = useRouter();

  return (
    <div>
      <Button
        className="bg-dark-2 text-light-2 border border-gray-800 rounded-full w-32"
        onClick={() => router.push(appRoutes.editProfile(currentUserId))}
      >
        <Pencil size={16} className="mr-2" />
        Edit
      </Button>
    </div>
  );
};

export default ProfileEditButton;
