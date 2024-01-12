import MessageForm from "@/components/forms/MessageForm";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const currentUserInfo = await fetchUser(user.id);

  const userInfo = await fetchUser(params.id);

  return (
    <section>
      <div className="flex flex-col gap-10">
        <p className="text-light-2">{userInfo.name}</p>
        <MessageForm
          currentUserId={currentUserInfo._id}
          secondaryUserId={userInfo._id}
        />
      </div>
    </section>
  );
};

export default page;
