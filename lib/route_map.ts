export const appRoutes = {
  activity: () => "/activity",
  comment: (parentId: string, commentId: string) =>
    `/thread/${parentId}#thread_${commentId}`,
  communities: () => "/communities",
  createThread: () => "/create/thread",
  editProfile: () => "/profile/edit",
  home: () => "/",
  onboarding: () => "/onboarding",
  profile: (id: string) => `/profile/${id}`,
  search: () => "/search",
  thread: (id: string) => `/thread/${id}`,
};
