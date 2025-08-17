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

        const docRef = doc(db, `aiai/be_${uid}/invs`, invId);

        await updateDoc(docRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
    };


    const insertInv = async (): Promise<void> => {
        const oInv = useInvStore.getState().oInv;

        if (!oInv!.inv_id) { throw new Error("No oInv found in zustand store."); }

        const docRef = doc(db, `aiai/be_${uid}/invs`, oInv!.inv_id);

        const newInv = {
            ...oInv,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };
        console.log(oInv)
        await setDoc(docRef, newInv);
    };


    const fetchInvs = async (hf_client: string, hf_fromDate: Date, hf_toDate: Date): Promise<InvDB[]> => {
        const invRef = collection(db, `aiai/be_${uid}/invs`);
        const conditions = [where("is_deleted", "!=", 1)];
        if (hf_client !== "All") {
            conditions.push(where("client_company_name", "==", hf_client));
        }

        // conditions.push(where("inv_date", ">=", Timestamp.fromDate(new Date(hf_fromDate.setHours(0, 0, 0, 0)))));
        // conditions.push(where("inv_date", "<=", Timestamp.fromDate(new Date(hf_toDate.setHours(23, 59, 59, 999)))));
        conditions.push(
            where("inv_date", ">=", Timestamp.fromDate(new Date(hf_fromDate.getFullYear(), hf_fromDate.getMonth(), hf_fromDate.getDate(), 0, 0, 0, 0))),
            where("inv_date", "<=", Timestamp.fromDate(new Date(hf_toDate.getFullYear(), hf_toDate.getMonth(), hf_toDate.getDate(), 23, 59, 59, 999)))
        );

        console.log(hf_fromDate, ' ', hf_client, '---', hf_toDate)
        const q = query(invRef, ...conditions, orderBy("inv_due_date", "desc"));
        const querySnap = await getDocs(q);

        // const invoices: InvDB[] = querySnap.docs.map(doc => doc.data() as InvDB);
        // useFirebaseUserStore.getState().setIsBizCreated(true);
        const invoices: InvDB[] = querySnap.docs.map(doc => {
            const data = doc.data();

            return {
                ...data,
                inv_date: data.inv_date?.toDate(),
                inv_due_date: data.inv_due_date?.toDate(),
                inv_payments: data.inv_payments?.map((p: any) => ({
                    ...p,
                    pay_date: p.pay_date?.toDate(),
                })) || []
            } as InvDB;
        });

        return invoices;

    };


    const duplicateInv = async () => {
        try {
            const { oInv } = useInvStore.getState();

            if (!uid || !oInv?.inv_id) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No invoice selected to duplicate.' });
                return false;
            }

            // Fetch original invoice
            const invRef = doc(db, `aiai/be_${uid}/invs`, oInv.inv_id);
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
                inv_number: oInv.inv_number,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            // Save duplicated invoice
            await setDoc(doc(db, `aiai/be_${uid}/invs`, newInvId), newInvoice);

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
        const invsRef = collection(db, `aiai/be_${uid}/invs`);
        const q = query(invsRef, where("inv_number", "==", invNumber));
        const querySnap = await getDocs(q);

        if (querySnap.empty) { return null; }

        const data = querySnap.docs[0].data();

        return {
            ...data,
            inv_date: data.inv_date?.toDate(),
            inv_due_date: data.inv_due_date?.toDate(),
            inv_payments: data.inv_payments?.map((p: any) => ({
                ...p,
                pay_date: p.pay_date?.toDate(),
            })) || []
        } as InvDB;

    };
    return { insertInv, updateInv, fetchInvs, duplicateInv, fetch1Inv };
};