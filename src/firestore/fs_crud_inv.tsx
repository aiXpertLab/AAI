import * as Crypto from 'expo-crypto';
import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs, Timestamp, getDoc } from "firebase/firestore";

import { app } from "@/src/config/firebaseConfig";
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { InvDB } from '@/src/types';
import { useInvStore } from '../stores';


export const useInvCrud = () => {
    const db = getFirestore(app);
    const firebaseUser = useFirebaseUserStore((state) => state.FirebaseUser);
    const uid = firebaseUser?.uid;

    const updateInv = async (
        Inv: Partial<InvDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            if (!uid || !Inv.client_id) throw new Error("Missing UID or Inv ID");

            const docRef = doc(db, `aai/be_${uid}/clients`, Inv.client_id);
            const { client_id, ...updateFields } = Inv; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updateInv error:", err);
            onError(err);
        }
    };


    const insertInv = async (onSuccess: () => void, onError: (err: any) => void) => {
        try {
            // ✅ Get current invoice from zustand
            const oInv = useInvStore.getState().oInv;

            if (!oInv) {
                throw new Error("No oInv found in zustand store.");
            }

            const inv_id = 'i_' + Crypto.randomUUID().replace(/-/g, '');
            const docRef = doc(db, `aai/be_${uid}/invs`, inv_id);

            const newInv = {
                ...oInv,
                inv_id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                is_deleted: 0,
            };

            // const docRef = await addDoc(colRef, newPM);
            await setDoc(docRef, newInv);
            console.log("✅ Inserted Inv:", docRef.id);

            onSuccess?.();
            return true;
        } catch (err) {
            console.error("❌ insertInv error:", err);
            onError?.(err);
            return false;
        }
    };


    const fetchInvs = async (hf_client: string, hf_fromDate: Date, hf_toDate: Date): Promise<InvDB[]> => {
        try {
            const invRef = collection(db, `aai/be_${uid}/invs`);
            const conditions = [where("is_deleted", "!=", 1)];
            if (hf_client !== "All") {
                conditions.push(where("client_company_name", "==", hf_client));
            }

            conditions.push(where("inv_date", ">=", Timestamp.fromDate(new Date(hf_fromDate.setHours(0, 0, 0, 0)))));
            conditions.push(where("inv_date", "<=", Timestamp.fromDate(new Date(hf_toDate.setHours(23, 59, 59, 999)))));

            console.log(hf_fromDate, ' ', hf_client, '---', hf_toDate)
            const q = query(invRef, ...conditions, orderBy("inv_due_date", "desc"));
            const querySnap = await getDocs(q);

            const invoices: InvDB[] = querySnap.docs.map(doc => doc.data() as InvDB);
            useFirebaseUserStore.getState().setIsBizCreated(true);

            return invoices;

        } catch (err) {
            console.error("Failed to load invoices from Firestore:", err);
            return [];
        }
    };


    const initInv = async (invNumber: string) => {
        try {
            const invDocRef = doc(db, "aai", `be_${uid}`, "inv_empty", "inv_empty");
            const invDocSnap = await getDoc(invDocRef);

            if (invDocSnap.exists()) {
                const data = invDocSnap.data() as InvDB; // optional type cast
                const updatedData = { ...data, inv_number: invNumber };
                console.log("Fetched inv_empty:", data);
                useInvStore.getState().setOInv(data);
            } else {
                console.warn("No inv_empty doc found in Firestore.");
            }
        } catch (err) {
            console.error("Error initializing invoice:", err);
        }
    };

    return { insertInv, updateInv, fetchInvs, initInv };
};