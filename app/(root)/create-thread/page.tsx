import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect(appRoutes.onboarding());

  return (
    <>
      <h1 className="head-text text-left">Create Thread</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
};

export default page;
