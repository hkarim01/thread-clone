import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect(appRoutes.onboarding());

  const searchResults = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <Searchbar routeType="communities" placeholder="Search communities" />

      <div className="mt-14 flex flex-col gap-9">
        {searchResults.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {searchResults.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default page;
