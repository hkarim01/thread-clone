import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs, profileTabs } from "@/constants";
import {
  fetchCommunityDetails,
  fetchCommunityThreads,
} from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { ThreadsResponse } from "@/types";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect(appRoutes.onboarding());

  const communityDetails = await fetchCommunityDetails(params.id);
  const threads = (await fetchCommunityThreads(
    communityDetails._id
  )) as ThreadsResponse[];

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        currentUserIdObject={JSON.stringify(userInfo._id)}
        currentUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {threads.length}
                  </p>
                )}
                {tab.label === "Members" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails.members.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={JSON.stringify(userInfo._id)}
              threads={threads}
            />
          </TabsContent>
          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  accountIdObject={JSON.stringify(member._id)}
                  currentUserId={JSON.stringify(userInfo._id)}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
          {/* <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={JSON.stringify(userInfo._id)}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent> */}
        </Tabs>
      </div>
    </section>
  );
};

export default page;
