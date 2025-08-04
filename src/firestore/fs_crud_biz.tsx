import { getDoc, getFirestore, doc, updateDoc, serverTimestamp, Timestamp, collection, getDocs, setDoc, runTransaction } from "firebase/firestore";
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


    // const createBiz = async (uid: string) => {
    //     const seedRef = doc(db, "biz_seed", "biz_seed_doc");
    //     const seedSnap = await getDoc(seedRef);
    //     if (!seedSnap.exists()) { throw new Error("Seed document not found."); }

    //     const paymentMethodsRef = collection(seedRef, "payment_methods");
    //     const paymentSnaps = await getDocs(paymentMethodsRef);

    //     const taxRef = collection(seedRef, "tax_list");
    //     const taxSnaps = await getDocs(taxRef);

    //     const biz_id = `be_${uid}`;
    //     const userBizRef = doc(db, "aai", biz_id);
    //     await setDoc(userBizRef, seedSnap.data());

    //     for (const snap of paymentSnaps.docs) {
    //         const destRef = doc(db, "aai", biz_id, "payment_methods", snap.id);
    //         await setDoc(destRef, snap.data());
    //     }

    //     for (const snap of taxSnaps.docs) {
    //         const destRef = doc(db, "aai", biz_id, "tax_list", snap.id);
    //         await setDoc(destRef, snap.data());
    //     }

    //     console.log(`Business entity created for user: ${uid}`);
    // };
    const SUBCOLLECTIONS = ["payment_methods", "tax_list", "clients", "invs", "items"];

    const createBiz = async (uid: string) => {
        const seedRef = doc(db, "biz_seed", "biz_seed_doc");
        const seedSnap = await getDoc(seedRef);
        if (!seedSnap.exists()) {
            throw new Error("Seed document not found.");
        }

        // 1. Clone main document
        const biz_id = `be_${uid}`;
        const userBizRef = doc(db, "aai", biz_id);
        await setDoc(userBizRef, seedSnap.data());

        // 2. Loop through subcollections
        for (const subCol of SUBCOLLECTIONS) {
            const sourceColRef = collection(seedRef, subCol);
            const sourceSnaps = await getDocs(sourceColRef);

            for (const docSnap of sourceSnaps.docs) {
                const destDocRef = doc(db, "aai", biz_id, subCol, docSnap.id);
                await setDoc(destDocRef, docSnap.data());
            }
        }


        // 3. Adjust invoice dates after cloning
        const invsRef = collection(db, "aai", biz_id, "invs");
        const invsSnap = await getDocs(invsRef);

        for (const invDoc of invsSnap.docs) {
            const invData = invDoc.data();

            // Base date = today - 20 days
            const invDate = new Date();
            const inv1Date = new Date();
            invDate.setDate(invDate.getDate() - 20);
            inv1Date.setDate(invDate.getDate() - 19);

            // Due date = invDate + payment term
            const termDays = invData.inv_payment_term || 0;
            const dueDate = new Date(invDate);
            dueDate.setDate(invDate.getDate() + termDays);

            // Update payment dates to match invoice date
            const updatedPayments = (invData.inv_payments || []).map((payment:any) => ({
                ...payment,
                pay_date: Timestamp.fromDate(inv1Date),
            }));

            // Write updates back
            await setDoc(invDoc.ref, {
                ...invData,
                inv_date: Timestamp.fromDate(invDate),
                inv_due_date: Timestamp.fromDate(dueDate),
                inv_payments: updatedPayments
            }, { merge: true });
        }
        console.log(`Business entity created for user: ${uid}`);
    };



    return { updateBiz, fetchBiz, createBiz };




}