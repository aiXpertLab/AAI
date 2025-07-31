import { getDoc, getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { getUserUid } from "@/src/utils/getFirebaseUid";
import { BE_DB } from "@/src/types";

const db = getFirestore(app);

export const useBizCrud = () => {

    const updateBiz = async (
        biz: Partial<BE_DB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid) throw new Error("Missing UID");

            const docRef = doc(db, `aai/be_${uid}`); 


            await updateDoc(docRef, {
                ...biz,
                updated_at: serverTimestamp(),
            });

            console.log("✅ Biz updated successfully");
            onSuccess();
        } catch (err) {
            console.error("❌ updateBiz error:", err);
            onError(err);
        }
    };


    const fetchBiz = async (uid: string) => {
        try {
            if (!uid) throw new Error("Missing UID");

            const docRef = doc(db, "aai", `be_${uid}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const bizData = docSnap.data();
                return bizData as BE_DB;
            } else {
                console.warn("No business document found for current user.");
            }
        } catch (err) {
            console.error("❌ Failed to fetch business:", err);
        }

    };
    return { updateBiz, fetchBiz };

}