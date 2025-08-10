import * as Crypto from 'expo-crypto';
import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs, Timestamp, getDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';
import { app } from "@/src/config/firebaseConfig";
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { InvDB } from '@/src/types';
import { useInvStore } from '../stores';

export const useInvCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;

    const updateInv = async (
        updates: Partial<InvDB>,
        invId: string       // must pass invId, using oInvId not reliable. sometimes need update db directly
    ): Promise<void> => {
        
        const docRef = doc(db, `aai/be_${uid}/clients`, invId);

        await updateDoc(docRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
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


    const fetchEmptyInv = async (invNumber: string) => {
        try {
            const invDocRef = doc(db, "aai", `be_${uid}`, "inv_empty", "inv_empty");
            const invDocSnap = await getDoc(invDocRef);

            if (invDocSnap.exists()) {
                const data = invDocSnap.data() as InvDB; // optional type cast
                const updatedData = { ...data, inv_number: invNumber };

                return updatedData
            } else {
                console.warn("No inv_empty doc found in Firestore.");
                return null
            }
        } catch (err) {
            console.error("Error initializing invoice:", err);
            return null
        }
    };


    const duplicateInv = async () => {
        try {
            const { oInv } = useInvStore.getState();

            if (!uid || !oInv?.inv_id) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No invoice selected to duplicate.' });
                return false;
            }

            // Fetch original invoice
            const invRef = doc(db, `aai/be_${uid}/invs`, oInv.inv_id);
            const invSnap = await getDoc(invRef);

            if (!invSnap.exists()) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Source invoice not found.' });
                return false;
            }

            // Copy all fields & replace inv_id + inv_number
            const newInvId = 'i_' + Crypto.randomUUID().replace(/-/g, '');
            const newInvoice = {
                ...invSnap.data(),
                inv_id: newInvId,
                inv_number: 'duplicate',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            // Save duplicated invoice
            await setDoc(doc(db, `aai/be_${uid}/invs`, newInvId), newInvoice);

            Toast.show({
                type: 'success',
                text1: 'Invoice Duplicated',
                text2: 'New invoice created from source invoice',
                position: 'bottom'
            });

            return true;
        } catch (err) {
            console.error("❌ duplicateInvoice error:", err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to duplicate invoice.'
            });
            return false;
        }
    };



    const fetch1Inv = async (invNumber: string): Promise<InvDB | null> => {
        try {
            const invsRef = collection(db, `aai/be_${uid}/invs`);
            const q = query(invsRef, where("inv_number", "==", invNumber));
            const querySnap = await getDocs(q);

            if (querySnap.empty) {
                return null;
            }

            // Return the first matching invoice (should be unique)
            return querySnap.docs[0].data() as InvDB;

        } catch (err) {
            console.error(`Failed to load invoice with inv_number ${invNumber} from Firestore:`, err);
            return null;
        }
    };
    return { insertInv, updateInv, fetchInvs, fetchEmptyInv, duplicateInv, fetch1Inv };
};