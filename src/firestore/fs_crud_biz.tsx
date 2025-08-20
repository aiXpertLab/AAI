import { getDoc, getFirestore, doc, updateDoc, serverTimestamp, Timestamp, collection, getDocs, setDoc, runTransaction } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { BE_DB } from "@/src/types";
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { useBizStore, useInvStore, useClientStore } from '@/src/stores/';
import { seed_data, } from "@/src/firestore/seed_data";

const db = getFirestore(app);

export const useBizCrud = () => {
    const firebaseUser = useFirebaseUserStore.getState().FirebaseUser;
    const uid = firebaseUser?.uid;
    const { oBiz, setOBiz } = useBizStore();  // 🧠 Zustand action


    const createBizFromLocalSeed = async (uid: string) => {
        const biz_id = `be_${uid}`;
        const be_doc = doc(db, "aiai", biz_id);

        // 1. biz be
        await setDoc(be_doc, seed_data.business_entity);
        setOBiz(seed_data.business_entity);
        console.log(`1. Business entity created for user: ${uid}`);

        // 2. Invoices
        await Promise.all(
            seed_data.invs.map(inv => {
                const invDoc = doc(collection(be_doc, "invs"), inv.inv_id);
                return setDoc(invDoc, inv);  // return the Promise
            })
        );
        console.log(`2. Invoices created for user: ${uid}`);

        // 3. Clients
        await Promise.all(
            seed_data.clients.map(client => {
                const clientDoc = doc(collection(be_doc, "clients"), client.client_id);
                return setDoc(clientDoc, client);
            })
        );
        console.log(`3. Clients  created for user: ${uid}`);


        // 4. Items
        await Promise.all(
            seed_data.items.map(item => {
                const itemDoc = doc(collection(be_doc, "items"), item.item_id);
                return setDoc(itemDoc, item);
            })
        );
        console.log(`4. Items created for user: ${uid}`);


        // 5. PMs
        await Promise.all(
            seed_data.payment_methods.map(item => {
                const itemDoc = doc(collection(be_doc, "payment_methods"), item.pm_id);
                return setDoc(itemDoc, item);
            })
        );
        console.log(`5. PM created for user: ${uid}`);


        // 6. tax list
        await Promise.all(
            seed_data.tax_list.map(item => {
                const itemDoc = doc(collection(be_doc, "tax_list"), item.tax_id);
                return setDoc(itemDoc, item);
            })
        );

        console.log(`6. Tax created for user: ${uid}`);
    };








    const updateBiz = async (updates: Partial<BE_DB>,): Promise<void> => {
        const docRef = doc(db, `aiai/be_${uid}`);
        await updateDoc(docRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
    };



    const fetchBiz = async () => {
        try {
            console.log("fetchBiz", uid);
            const docRef = doc(db, "aiai", `be_${uid}`);
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





    const SUBCOLLECTIONS = ["payment_methods", "tax_list", "clients", "invs", "items", "inv_empty"];

    const createBizFromFirestore = async (uid: string) => {
        const seedRef = doc(db, "biz_seed", "biz_seed_doc");
        const seedSnap = await getDoc(seedRef);
        if (!seedSnap.exists()) {
            throw new Error("Seed document not found.");
        }

        // 1. Clone main document
        const biz_id = `be_${uid}`;
        const userBizRef = doc(db, "aiai", biz_id);
        await setDoc(userBizRef, seedSnap.data());

        // 2. Loop through subcollections
        for (const subCol of SUBCOLLECTIONS) {
            const sourceColRef = collection(seedRef, subCol);
            const sourceSnaps = await getDocs(sourceColRef);

            for (const docSnap of sourceSnaps.docs) {
                const destDocRef = doc(db, "aiai", biz_id, subCol, docSnap.id);
                await setDoc(destDocRef, docSnap.data());
            }
        }


        // 3. Adjust invoice dates after cloning
        const invsRef = collection(db, "aiai", biz_id, "invs");
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
            const updatedPayments = (invData.inv_payments || []).map((payment: any) => ({
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


    const initOBiz = async () => {
        try {
            // 1. Load business inf oBiz
            const bizData = await fetchBiz();
            console.log("initOBiz bizData", bizData?.be_address);
            setOBiz(bizData || null);
            console.log("initOBiz setOBiz", oBiz?.be_biz_number);
        } catch (error) {
            console.error("Startup: Failed to fetch oBiz", error);
        }
    }



    const backupAll = async () => {
        if (!uid) throw new Error("No Firebase user UID");

        const bizRef = doc(db, `aiai/be_${uid}`);
        const bizSnap = await getDoc(bizRef);

        if (!bizSnap.exists()) {
            console.log("No biz doc found");
            return null;
        }

        const backup: any = {
            __doc: bizSnap.data(),
            __subcollections: {}
        };

        // known subcollections
        const subcollections = ["clients", "invs", "items"];
        

        for (const sub of subcollections) {
            const colRef = collection(db, `aiai/be_${uid}/${sub}`);
            const colSnap = await getDocs(colRef);

            backup.__subcollections[sub] = {};
            colSnap.forEach((docSnap) => {
                backup.__subcollections[sub][docSnap.id] = docSnap.data();
            });
        }

        console.log("Backup complete:", backup);
        return backup;
    };


    return { updateBiz, fetchBiz, createBizFromLocalSeed, initOBiz, backupAll };
}