import { create } from "zustand";
import type { User } from 'firebase/auth';

type FirebaseUserStore = {
    FirebaseUser: User | null;
    setFirebaseUser: (user: User | null) => void;
    isBizCreated: boolean;  // Add the business entity creation flag
    setIsBizCreated: (isCreated: boolean) => void;  // Method to set the flag

    isNewUser: boolean;
    setIsNewUser: (isNew: boolean) => void; 
};


export const useFirebaseUserStore = create<FirebaseUserStore>((set) => ({
    FirebaseUser: null,
    setFirebaseUser: (FirebaseUser) => set({ FirebaseUser }),

    isBizCreated: false,
    setIsBizCreated: (isCreated) => set({ isBizCreated: isCreated }),

    isNewUser: false,
    setIsNewUser: (isNew) => set({ isNewUser: isNew })
}));
