import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  const { threads, isNext } = await fetchThreads(
    searchParams.page ? +searchParams.page : 1,
    10
  );

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
                id={JSON.stringify(thread._id)}
                currentUserId={JSON.stringify(userInfo._id)}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                likes={thread.likes}
                comments={thread.children}
                isComment={false}
              />
            ))}
          </>
        )}
      </section>
      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext}
      />
    </>
  );
}
