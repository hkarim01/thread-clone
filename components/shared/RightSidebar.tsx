import { fetchCommunities } from "@/lib/actions/community.actions";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { appRoutes } from "@/lib/route_map";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const RightSidebar = async () => {
  const user = await currentUser();
  if (!user) return null;

  const communityResults = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 3,
  });

  const userResults = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 3,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      {/* Suggested Communities */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
        <div className="mt-10 flex flex-col gap-9">
          {communityResults.communities.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {communityResults.communities.map((community) => (
                <Link
                  key={community.id}
                  href={appRoutes.communities(community.id)}
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={community.image}
                      alt="community image"
                      width={44}
                      height={44}
                      className="rounded-full avatar-image w-11 h-11"
                    />
                    <h4 className="text-base-semibold text-light-1">
                      {community.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Suggested Users block */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <div className="mt-10 flex flex-col gap-9">
          {userResults.users.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {userResults.users.map((person) => (
                <Link
                  key={person.id}
                  href={appRoutes.profile(person.id)}
                  className="flex gap-2 items-center"
                >
                  <Image
                    src={person.image}
                    alt="user_logo"
                    width={44}
                    height={44}
                    className="rounded-full avatar-image h-11 w-11"
                  />
                  <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">
                      {person.name}
                    </h4>
                    <p className="text-small-medium text-gray-1">
                      @{person.username}
                    </p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
