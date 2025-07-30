import { getAuth } from "firebase/auth";
import { app } from "@/src/config/firebaseConfig";

/**
 * Returns the current user's UID if authenticated, otherwise null.
 */
export const getUserUid = (): string | null => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    return user ? user.uid : null;
    // if (!uid) throw new Error("You must be signed in to perform this action.");
};
