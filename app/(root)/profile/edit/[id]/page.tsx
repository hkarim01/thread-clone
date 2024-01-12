import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserResponse } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  if (user.id !== params.id) {
    redirect("/");
  }

  const userInfo = await fetchUser(user.id);

  const userData: UserResponse = {
    id: user?.id,
    _id: JSON.stringify(userInfo?._id),
    username: userInfo?.username || user?.username || "",
    name: userInfo?.name || `${user?.firstName}${user?.lastName}` || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <section className="mt-9 bg-dark-2 p-10">
      <AccountProfile user={userData} btnTitle="Save" showDeleteButton={true} />
    </section>
  );
};

export default page;
