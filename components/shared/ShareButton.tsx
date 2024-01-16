"use client";

import { Copy } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ShareButton = ({ link }: { link: string }) => {
  const { toast } = useToast();
  const threadLink = process.env.NEXT_PUBLIC_HOSTNAME + link;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src="/assets/share.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this thread.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={threadLink} readOnly />
            </div>
            <Button
              size="sm"
              className="px-3"
              onClick={() => {
                navigator.clipboard.writeText(threadLink);
                toast({
                  description: "copied.",
                });
              }}
            >
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex mt-10 gap-2">
            <FacebookShareButton
              url={threadLink}
              quote={
                "next-share is a social share buttons for your next React apps."
              }
              hashtag={"#nextshare"}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={threadLink}
              title={
                "next-share is a social share buttons for your next React apps."
              }
              separator=":: "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={threadLink}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
