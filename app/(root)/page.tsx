import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const { threads, isNext } = await fetchThreads(1, 20);

  return (
    <>
      <h1 className="head-text text-left">Welcome to Threads Clone</h1>

      <section className="flex flex-col mt-9 gap-10">
        {threads.length === 0 ? (
          <p className="no-result">Threads not found</p>
        ) : (
          <>
            {threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                isComment={false}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
