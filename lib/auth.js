import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from './firebase';
import {
  getAuth,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { createUser } from './db';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUser = async (rawUser) => {
    if(rawUser) {
        const user = formatUser(rawUser);
        const { token, ...userWithoutToken } = user;
        await createUser(userWithoutToken);
        console.log(user)
        setUser(user);
        return user
    } else {
        setUser(false);
        return false;
    }
  }

  const signInWith = async (provider) => {
    const auth = getAuth();
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, provider);
      await handleUser(res.user)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signinWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    await signInWith(provider);
  };

  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWith(provider);
  };

  const signout = async () => {
    const auth = getAuth();
    try {
      setLoading(true);
      await signOut(auth);
      setUser(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        handleUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGitHub,
    signinWithGoogle,
    signout,
  };
}

const formatUser = (user) => {
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.xa,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
