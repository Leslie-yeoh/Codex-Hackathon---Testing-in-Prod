"use client";

import { useCallback, useState } from "react";
import {
  getCurrentUser,
  signOutUser,
} from "../services/login/loginService";

const getAuthSession = () => {
  const user = getCurrentUser();

  return {
    user,
    isSignedIn: Boolean(user),
  };
};

export const useAuth = () => {
  const [session, setSession] = useState(getAuthSession);

  const refreshSession = useCallback(() => {
    setSession(getAuthSession());
  }, []);

  const signOut = useCallback(() => {
    signOutUser();
    refreshSession();
  }, [refreshSession]);

  return {
    ...session,
    refreshSession,
    signOut,
  };
};
