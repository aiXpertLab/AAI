import { create } from "zustand";
import type { User } from 'firebase/auth';

type FirebaseUserStore = {
    FirebaseUser: User | null;
    setFirebaseUser: (user: User | null) => void;
};


export const useFirebaseUserStore = create<FirebaseUserStore>((set) => ({
    FirebaseUser: null,
    setFirebaseUser: (FirebaseUser) => set({ FirebaseUser }),
}));
