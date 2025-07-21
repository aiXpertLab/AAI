import { create } from "zustand";
import { UserDB } from "@/src/types"; // Adjust path as needed
import type { User } from 'firebase/auth';

interface UserStore {
  currentUser: UserDB | null;
  setCurrentUser: (user: UserDB) => void;
  clearUser: () => void;
}

type FirebaseUserStore = {
    FirebaseUser: User | null;
    setFirebaseUser: (user: User | null) => void;
  };
  


export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => set({ currentUser: null }),
}));

export const useFirebaseUserStore = create<FirebaseUserStore>((set) => ({
    FirebaseUser: null,
    setFirebaseUser: (FirebaseUser) => set({ FirebaseUser }),
  }));
