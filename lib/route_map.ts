export const appRoutes = {
  activity: () => "/activity",
  comment: (parentId: string, commentId: string) =>
    `/thread/${parentId}#thread_${commentId}`,
  communities: (id?: string) => (id ? `/communities/${id}` : "/communities/"),
  createThread: () => "/create/thread",
  editProfile: (id: string) => `/profile/edit/${id}`,
  home: () => "/",
  onboarding: () => "/onboarding",
  profile: (id: string) => `/profile/${id}`,
  search: () => "/search",
  thread: (id: string) => `/thread/${id}`,
  signIn: () => "/sign-in",
  signUp: () => "/sign-up",
  messages: (id?: string) => (id ? `/messages/${id}` : "/messages"),
  newMessage: (id: string) => `/messages/new/${id}`,
};
