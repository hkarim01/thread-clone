import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  let threadLevel = 2;
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect(appRoutes.onboarding());

  const thread = await fetchThreadById(params.id);

  threadLevel = !thread.parentId ? 0 : 2;

  if (threadLevel === 2) {
    const parentThread = await fetchThreadById(thread.parentId);
    threadLevel = !parentThread.parentId ? 1 : 2;
  }

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={JSON.stringify(thread._id)}
          currentUserId={JSON.stringify(userInfo._id)}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          likes={thread.likes}
          comments={thread.children}
          isComment={threadLevel > 0}
          allowComments={threadLevel < 2}
        />
      </div>

      {threadLevel < 2 && (
        <div className="mt-7">
          <Comment
            threadId={params.id}
            currentUserImg={userInfo.image}
            currentUserId={JSON.stringify(userInfo._id)}
          />
        </div>
      )}

      <div className="mt-10">
        {thread.children.map((childThread: any) => (
          <ThreadCard
            key={childThread._id}
            id={JSON.stringify(childThread._id)}
            currentUserId={JSON.stringify(userInfo._id)}
            parentId={childThread.parentId}
            content={childThread.text}
            author={childThread.author}
            community={childThread.community}
            createdAt={childThread.createdAt}
            likes={childThread.likes}
            comments={childThread.children}
            isComment={true}
            allowComments={threadLevel === 0}
          />
        ))}
      </div>
    </section>
  );
};

export default page;
