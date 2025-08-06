// src/utils/bizUtils.ts
import { getDoc, getFirestore, doc, updateDoc, serverTimestamp, Timestamp, collection, getDocs, setDoc, runTransaction } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

const db = getFirestore(app);

export async function checkBizEntityExists(uid: string): Promise<boolean> {
    const docRef = doc(db, "aai", `be_${uid}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}
