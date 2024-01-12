import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import TabContentWrapper from "@/components/shared/TabContentWrapper";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUserThreads } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { ThreadsResponse } from "@/types";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const currentUserInfo = await fetchUser(user.id);
  if (!currentUserInfo?.onboarded) redirect(appRoutes.onboarding());

  const userInfo = await fetchUser(params.id);

  const threads = (await fetchUserThreads(userInfo._id)) as ThreadsResponse[];

  const isFollowed =
    user.id === params.id
      ? false
      : currentUserInfo.followings.some((follow: any) =>
          follow._id.equals(userInfo._id)
        );

  return (
    <section>
      <ProfileHeader
        accountId={JSON.stringify(userInfo._id)}
        currentUserIdObject={JSON.stringify(currentUserInfo._id)}
        currentUserId={currentUserInfo.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        isFollowed={isFollowed}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
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
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <TabContentWrapper>
              {threads.length > 0 && (
                <ThreadsTab
                  currentUserId={JSON.stringify(currentUserInfo._id)}
                  threads={threads}
                />
              )}
            </TabContentWrapper>
          </TabsContent>
          <TabsContent value="following" className="w-full text-light-1">
            <TabContentWrapper>
              {userInfo.followings.length > 0 && (
                <section className="mt-9 flex flex-col gap-10">
                  {userInfo.followings.map((member: any) => (
                    <UserCard
                      key={member.id}
                      currentUserId={JSON.stringify(currentUserInfo._id)}
                      accountIdObject={JSON.stringify(member._id)}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      showUnfollow={true}
                      personType="User"
                    />
                  ))}
                </section>
              )}
            </TabContentWrapper>
          </TabsContent>
          <TabsContent value="followers" className="w-full text-light-1">
            <TabContentWrapper>
              {userInfo.followers.length > 0 && (
                <section className="mt-9 flex flex-col gap-10">
                  {userInfo.followers.map((member: any) => (
                    <UserCard
                      key={member.id}
                      currentUserId={JSON.stringify(currentUserInfo._id)}
                      accountIdObject={JSON.stringify(member._id)}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      personType="User"
                    />
                  ))}
                </section>
              )}
            </TabContentWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default page;
