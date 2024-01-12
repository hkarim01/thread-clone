import UserCard from "@/components/cards/UserCard";
import NewChat from "@/components/shared/NewChat";
import { fetchUserChats } from "@/lib/actions/chatRoom.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { UserResponse } from "@/types";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  const userChats = await fetchUserChats(userInfo._id);

  const searchResults = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams.page ? +searchParams.page : 1,
    pageSize: 20,
  });

  const showSearchResults = !!searchParams.q;

  return (
    <section>
      <h1 className="head-text mb-10">Chats</h1>
      <NewChat />

      {!showSearchResults ? (
        userChats.length > 0 ? (
          <div className="flex flex-col gap-4">
            {userChats.map((chat) => {
              const otherMember: UserResponse = chat.members.find(
                (member: UserResponse) =>
                  JSON.stringify(member._id) !== JSON.stringify(userInfo._id)
              );

              return (
                <div key={chat._id} className="hover:bg-dark-4 p-1 rounded-lg">
                  <Link href={appRoutes.messages(chat._id)}>
                    <UserCard
                      currentUserId={JSON.stringify(userInfo._id)}
                      accountIdObject={JSON.stringify(otherMember._id)}
                      id={otherMember.id}
                      name={otherMember.name}
                      username={otherMember.username}
                      imgUrl={otherMember.image}
                      personType="User"
                      showButton={false}
                    />
                  </Link>
                  <div className="mt-3 h-0.5 w-full bg-light-4" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-light-2">No Chats</p>
        )
      ) : searchResults.users.length > 0 ? (
        searchResults.users.map((person) => (
          <Link key={person.id} href={appRoutes.newMessage(person.id)}>
            <UserCard
              currentUserId={JSON.stringify(userInfo._id)}
              accountIdObject={JSON.stringify(person._id)}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType="User"
              showButton={false}
            />
          </Link>
        ))
      ) : (
        <p className="text-light-2">No User Found</p>
      )}
    </section>
  );
};

export default page;
