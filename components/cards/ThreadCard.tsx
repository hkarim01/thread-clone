import { appRoutes } from "@/lib/route_map";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ReactButton from "../shared/ReactButton";
import ThreadDeleteButton from "../shared/ThreadDeleteButton";
import ShareButton from "../shared/ShareButton";
import RepostButton from "../shared/RepostButton";

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
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
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  allowComments?: boolean;
}

function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  likes,
  comments,
  isComment,
  allowComments = true,
}: ThreadCardProps) {
  const threadIdObject = JSON.parse(id);
  const isOwner = currentUserId === JSON.stringify(author._id);

  const commentAuthorImages = comments?.reduce((acc: string[], comment) => {
    if (!acc.includes(comment.author.image)) {
      return acc.concat(comment.author.image);
    } else {
      return acc;
    }
  }, []);

  return (
    <article
      id={`thread_${threadIdObject}`}
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
      data-testid="thread_card"
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={appRoutes.profile(author.id)}
              className="relative h-11 w-11"
            >
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full avatar-image"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between">
              <Link href={appRoutes.profile(author.id)} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
              </Link>

              {isOwner && <ThreadDeleteButton threadId={id} />}
            </div>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <ReactButton
                  threadId={id}
                  userId={currentUserId}
                  likes={likes}
                />
                {allowComments && (
                  <Link href={appRoutes.thread(threadIdObject)}>
                    <Image
                      src="/assets/reply.svg"
                      alt="heart"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                )}
                {/* <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  onClick={() => {
                    toast({
                      description: "Your message has been sent.",
                    });
                  }}
                /> */}
                <RepostButton />
                <ShareButton link={appRoutes.thread(threadIdObject)} />
                {/* <Image
                  src="/assets/share.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                /> */}
              </div>
              {isComment && (
                <div className="flex items-center mt-1">
                  {comments.length > 0 && (
                    <Link href={appRoutes.thread(threadIdObject)}>
                      <p className="text-subtle-medium text-gray-1">
                        {comments.length} repl
                        {comments.length > 1 ? "ies" : "y"}
                      </p>
                    </Link>
                  )}

                  {likes.length > 0 && comments.length > 0 && (
                    <p className="text-gray-1 mx-2">|</p>
                  )}

                  {likes.length > 0 && (
                    <div className="flex items-center">
                      <p className="text-subtle-medium text-gray-1">
                        {likes.length} like{likes.length > 1 && "s"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isComment && (
        <>
          <div className="flex items-center mt-4">
            {comments.length > 0 && (
              <Link href={appRoutes.thread(threadIdObject)}>
                <div className="flex items-center">
                  {commentAuthorImages.slice(0, 3).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`user_${index}`}
                      width={28}
                      height={28}
                      className={`${
                        index !== 0 && "-ml-2"
                      } rounded-full object-cover w-7 h-7 avatar-image`}
                    />
                  ))}
                  {commentAuthorImages.length > 3 && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-500 -ml-2 avatar-image">
                      <p className="text-tiny-medium text-light-1">
                        +{commentAuthorImages.length - 3}
                      </p>
                    </div>
                  )}
                  <p className="text-subtle-medium text-gray-1 ml-2">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </div>
              </Link>
            )}

            {likes.length > 0 && comments.length > 0 && (
              <p className="text-gray-1 mx-2">-</p>
            )}

            {likes.length > 0 && (
              <div className="flex items-center">
                <p className="text-subtle-medium text-gray-1">
                  {likes.length} like{likes.length > 1 && "s"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center">
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)}
            </p>
            {community && (
              <Link
                href={appRoutes.communities(community.id)}
                className="flex items-center"
              >
                <p className="text-subtle-medium text-gray-1 ml-1">
                  {`- ${community.name} Community`}
                </p>

                <Image
                  src={community.image}
                  alt={community.name}
                  width={20}
                  height={20}
                  className="ml-1 rounded-full object-cover"
                />
              </Link>
            )}
          </div>
        </>
      )}
    </article>
  );
}

export default ThreadCard;
