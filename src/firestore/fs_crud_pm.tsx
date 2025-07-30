import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { getUserUid } from "@/src/utils/getFirebaseUid";
const db = getFirestore(app);
import {PMDB } from '@/src/types';


export const usePMCrud = () => {

    const updatePM = async (
        pm: Partial<PMDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid || !pm.pm_id) throw new Error("Missing UID or PaymentMethod ID");

            const docRef = doc(db, `aai/be_${uid}/payment_methods`, pm.pm_id);
            
            const { pm_id, ...updateFields } = pm; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updatePM error:", err);
            onError(err);
        }
    };
    return {updatePM };
}

// export const addPaymentMethodToUser = async (
//     paymentMethod: Omit<PaymentMethod, "id" | "created_at" | "updated_at">
// ): Promise<string | null> => {
//     const uid = getUserUid();
//     if (!uid) return null;

//     try {
//         const colRef = collection(db, `aai/be_${uid}/payment_methods`);
//         const docRef = await addDoc(colRef, {
//             ...paymentMethod,
//             is_deleted: 0,
//             created_at: serverTimestamp(),
//             updated_at: serverTimestamp(),
//         });

//         return docRef.id;
//     } catch (err) {
//         console.error("Failed to add payment method:", err);
//         return null;
//     }
// };

// // ✅ Fetch all (non-deleted)
// export const fetchUserPaymentMethods = async (
//     setItems: (items: PMDB[]) => void
// ): Promise<void> => {
//     const uid = getUserUid();
//     if (!uid) return;

//     try {
//         const colRef = collection(db, `aai/be_${uid}/payment_methods`);
//         const q = query(colRef, where("is_deleted", "==", 0));
//         const snapshot = await getDocs(q);

//         const items: PMDB[] = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         } as PMDB));

//         setItems(items);
//     } catch (err) {
//         console.error("Failed to fetch payment methods:", err);
//     }
// };

