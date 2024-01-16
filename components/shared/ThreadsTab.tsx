import ThreadCard from "../cards/ThreadCard";
import { ThreadsResponse } from "@/types";

export interface ThreadsTabProps {
  currentUserId: string;
  threads: ThreadsResponse[];
}

const ThreadsTab = async ({ currentUserId, threads }: ThreadsTabProps) => {
  if (!threads) return null;

  return (
    <section className="flex flex-col mt-9 gap-10">
      {threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={JSON.stringify(thread._id)}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={{
            name: thread.author.name,
            image: thread.author.image,
            id: thread.author.id,
            _id: thread.author._id,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          likes={thread.likes}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
