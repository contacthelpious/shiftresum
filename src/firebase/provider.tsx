
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onIdTokenChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

// Extended user state including subscription status
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean; // For initial auth check
  userError: Error | null;
  isPro: boolean;
  subData: any; // Raw subscription data from Firestore
  isSubDataLoading: boolean; // For subscription data fetch
}

export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isPro: boolean;
  subData: any;
  isSubDataLoading: boolean;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}> = ({ children, firebaseApp, firestore, auth }) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: auth.currentUser, // Initialize with current user to reduce flicker
    isUserLoading: true,
    userError: null,
    isPro: false,
    subData: null,
    isSubDataLoading: true,
  });

  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState(prev => ({ ...prev, isUserLoading: false, isSubDataLoading: false }));
      return;
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUserAuthState(prev => ({...prev, isUserLoading: true, isSubDataLoading: true}));
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult(true); // Force refresh
        const isPro = tokenResult.claims.pro === true;
        
        let subData = null;
        const subRef = doc(firestore, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(subRef);
          subData = docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Failed to fetch subscription data:", error);
        }
        
        setUserAuthState({
          user: firebaseUser,
          isUserLoading: false,
          userError: null,
          isPro: isPro,
          subData: subData,
          isSubDataLoading: false,
        });

      } else {
        setUserAuthState({
          user: null,
          isUserLoading: false,
          userError: null,
          isPro: false,
          subData: null,
          isSubDataLoading: false,
        });
      }
    }, (error) => {
      console.error("onIdTokenChanged error:", error);
      setUserAuthState({
        user: null,
        isUserLoading: false,
        userError: error,
        isPro: false,
        subData: null,
        isSubDataLoading: false,
      });
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: !!(firebaseApp && firestore && auth),
    firebaseApp: firebaseApp,
    firestore: firestore,
    auth: auth,
    ...userAuthState,
  }), [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


// HOOKS

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error("Auth service not available.");
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firestore service not available.");
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error("Firebase App not available.");
  return firebaseApp;
};

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, isPro, subData, isSubDataLoading } = useFirebase();
  return { user, isUserLoading, userError, isPro, subData, isSubDataLoading };
};


// Memoization Hook
type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  return memoized;
}
