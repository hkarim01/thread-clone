// TODO: please fix this context, this is not working for now giving error of maximum call stack

"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserResponse } from "@/types";
import { fetchUser } from "../actions/user.actions";
import { getUserFromClerk } from "../clerk_helpers/getUserFromClerk";

type UserAuthContextType = {
  authUser: UserResponse;
};

type UserAuthContextProps = {
  children: ReactNode;
};

const AUTH_USER_INITIAL_FIELDS: UserResponse = {
  id: "",
  _id: "",
  name: "",
  username: "",
  bio: "",
  image: "",
};

const UserAuthContext = createContext<UserAuthContextType>({
  authUser: AUTH_USER_INITIAL_FIELDS,
});

export function UserAuthProvider({ children }: UserAuthContextProps) {
  const [authUser, setAuthUser] = useState<UserResponse>(
    AUTH_USER_INITIAL_FIELDS
  );

  const updateAuthUser = async () => {
    if (authUser._id) return;

    const user = JSON.parse(await getUserFromClerk());

    const currentUserInfo = await fetchUser(user.id);

    if (currentUserInfo) {
      setAuthUser((prev) => ({ ...prev, ...currentUserInfo }));
    }
  };

  useEffect(() => {
    if (!authUser.id) {
      console.log("useEffect");
      updateAuthUser();
    }
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        authUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
