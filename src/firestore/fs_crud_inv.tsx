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


    const fetchDeleted = async (): Promise<InvDB[]> => {
        const invRef = collection(db, `aiai/be_${uid}/invs`);
        const conditions = [where("is_deleted", "==", 1)];
        const q = query(invRef, ...conditions, orderBy("inv_due_date", "desc"));
        const querySnap = await getDocs(q);

        const invoices: InvDB[] = querySnap.docs.map(doc => {
            const data = doc.data();
            return data as InvDB;
        });

        return invoices;

    };


    const duplicateInv = async (newInvId: string, newInvNumber: string): Promise<boolean> => {
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
        const newInvoice = {
            ...invSnap.data(),
            inv_id: newInvId,
            inv_date: new Date(),
            inv_due_date: new Date(new Date().setDate(new Date().getDate() + oInv.inv_payment_term)),
            inv_number: newInvNumber,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            inv_payments: []
        };

        // Save duplicated invoice
        await setDoc(doc(db, `aiai/be_${uid}/invs`, newInvId), newInvoice);

        return true;
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
            inv_payment_status: 'Unpaid',
            inv_due_date: data.inv_due_date?.toDate(),
            inv_payments: data.inv_payments?.map((p: any) => ({
                ...p,
                pay_date: p.pay_date?.toDate(),
            })) || []
        } as InvDB;
    };



    const deletePayment = async (invNumber: string, pm_id: string): Promise<{ updatedBalanceDue: number, updatedInvPaidTotal: number } | false> => {
        try {
            // Fetch the invoice using the provided invNumber
            const inv = await fetch1Inv(invNumber);

            if (!inv) {
                console.log("Invoice not found.");
                return false;
            }

            // Filter out the payment with the given pm_id
            const updatedPayments = inv.inv_payments.filter(payment => payment.pm_id !== pm_id);

            // Check if the payment was found and removed
            if (updatedPayments.length === inv.inv_payments.length) {
                console.log("Payment with the provided pm_id not found.");
                return false;
            }

            // Calculate the sum of removed payment(s) for the update
            const removedPayment = inv.inv_payments.find(payment => payment.pm_id === pm_id);
            const paymentAmount = removedPayment ? removedPayment.pay_amount : 0;

            // Recalculate inv_balance_due and inv_paid_total
            const updatedInvPaidTotal = updatedPayments.reduce((total, payment) => total + payment.pay_amount, 0);
            const updatedBalanceDue = inv.inv_total - updatedInvPaidTotal;

            // Update the invoice in Firestore with updated payments, balance due, and paid total
            const invRef = doc(db, `aiai/be_${uid}/invs`, inv.inv_id);
            await updateDoc(invRef, {
                inv_payments: updatedPayments,
                inv_balance_due: updatedBalanceDue,
                inv_paid_total: updatedInvPaidTotal,
            });

            console.log("Payment deleted and summary updated successfully.");
            return { updatedBalanceDue, updatedInvPaidTotal };
        } catch (error) {
            console.error("Error deleting payment:", error);
            return false;
        }
    };



    return { insertInv, updateInv, fetchInvs, duplicateInv, fetch1Inv, fetchDeleted, deletePayment };
};