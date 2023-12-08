import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/route_map";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect(appRoutes.onboarding());

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link
                key={activity._id}
                href={appRoutes.comment(activity.parentId, activity._id)}
              >
                <article className="activity-card">
                  <div className="flex gap-2">
                    <Image
                      src={activity.author.image}
                      alt="user_logo"
                      width={20}
                      height={20}
                      className="rounded-full object-cover avatar-image w-5 h-5"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </div>
                  <p className="truncate text-small-regular text-light-1">
                    {activity.text}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
};

export default page;
