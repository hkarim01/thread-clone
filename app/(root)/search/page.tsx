import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect(appRoutes.onboarding());

  const searchResults = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {searchResults.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {searchResults.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default page;
