"use client";

import { UserResponse } from "@/types";
import { ChangeEvent, FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { deleteUser, updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { appRoutes } from "@/lib/route_map";
import { useUser } from "@clerk/nextjs";

export interface AccountProfileProps {
  user: UserResponse;
  btnTitle: string;
  showDeleteButton?: boolean;
}

const AccountProfile: FC<AccountProfileProps> = ({
  user,
  btnTitle,
  showDeleteButton = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const filereader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      filereader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      filereader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    setIsLoading(true);
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    try {
      if (hasImageChanged) {
        const imgRes = await startUpload(files);
        await clerkUser?.setProfileImage({ file: blob });

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url;
        }
      }

      await updateUser({
        id: user.id as string,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
      });
    } catch (error) {
      console.log("Error saving the data: ", error);
      throw error;
    }
    //  finally {
    //   setIsLoading(false);
    // }

    if (pathname === appRoutes.editProfile(user.id)) {
      router.back();
    } else {
      router.push(appRoutes.home());
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    await deleteUser(JSON.parse(user._id));
    await clerkUser?.delete();
    router.push(appRoutes.signIn());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center w-fit gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-cover w-12 h-12 md:w-24 md:h-24"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500" isLoading={isLoading}>
          {btnTitle}
        </Button>
        {showDeleteButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} isLoading={isLoading}>
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and all the related data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-400"
                  onClick={handleDeleteUser}
                >
                  {isLoading ? "please wait..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </Form>
  );
};

export default AccountProfile;
