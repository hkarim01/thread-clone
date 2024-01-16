"use client";

import Image from "next/image";
import { useToast } from "../ui/use-toast";

const RepostButton = () => {
  const { toast } = useToast();
  return (
    <Image
      src="/assets/repost.svg"
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={() => {
        toast({
          description: "This feature is not functional for now...",
        });
      }}
    />
  );
};

export default RepostButton;
