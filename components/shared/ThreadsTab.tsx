import { fetchUserThreads } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

export interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export interface ThreadsResponse {
  name: string;
  image: string;
  id: string;
  _id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
      _id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    likes: string[];
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: ThreadsTabProps) => {
  let response: ThreadsResponse;

  if (accountType === "Community") {
    response = await fetchCommunityThreads(accountId);
  } else {
    response = await fetchUserThreads(accountId);
  }

  if (!response) return null;

  return (
    <section className="flex flex-col mt-9 gap-10">
      {response.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={JSON.stringify(thread._id)}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: response.name,
                  image: response.image,
                  id: response.id,
                  _id: response._id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                  _id: thread.author._id,
                }
          }
          community={
            accountType === "Community"
              ? { name: response.name, id: response.id, image: response.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          likes={thread.likes}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
