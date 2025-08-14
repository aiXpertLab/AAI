import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs, getDoc } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { PMDB } from '@/src/types';


export const usePMCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;
    if (!uid) throw new Error("Missing UID");

    const updatePM = async (pm: Partial<PMDB>): Promise<void> => {
        if (!uid || !pm.pm_id) throw new Error("Missing UID or PaymentMethod ID");
        const docRef = doc(db, `aai/be_${uid}/payment_methods`, pm.pm_id);

        await updateDoc(docRef, {
            ...pm,
            updated_at: serverTimestamp(),
        });
    };


    const insertPM = async (pm: PMDB): Promise<void> => {
        if (!uid) throw new Error('Missing UID');
        const pm_id = 'p_' + Crypto.randomUUID().replace(/-/g, '');


        // const colRef = collection(db, `aai/be_${uid}/payment_methods`);
        const docRef = doc(db, `aai/be_${uid}/payment_methods`, pm_id);

        const newPM: Partial<PMDB> = {
            ...pm,
            pm_id: pm_id,
            is_deleted: 0,
        };

        // const docRef = await addDoc(colRef, newPM);
        await setDoc(docRef, newPM);
        console.log("✅ Inserted PM:", docRef.id);

    };

    const fetchPMs = async (): Promise<PMDB[]> => {
        const colRef = collection(db, `aai/be_${uid}/payment_methods`);
        const q = query(colRef, where("is_deleted", "==", 0));
        const querySnap = await getDocs(q);

        const activeItems: PMDB[] = querySnap.docs.map(doc => doc.data() as PMDB);

        return activeItems;
    };


    return { insertPM, updatePM, fetchPMs };
};