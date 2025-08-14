import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/src/config/firebaseConfig";

/**
 * Returns the current user's UID if authenticated, otherwise null.
 */
// export const getUserUid = (): string | null => {
//     const auth = getAuth(app);
//     const user = auth.currentUser;
//     return user ? user.uid : null;
//     // if (!uid) throw new Error("You must be signed in to perform this action.");
// };



/**
 * Waits for Firebase Auth to restore and returns the signed-in user (if any).
 */
export const waitForFirebaseUser = (): Promise<User | null> => {
    const auth = getAuth(app);
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // clean up listener after first call
            resolve(user);
        });
    });
};
