import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs, getDoc } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { ItemDB } from '@/src/types';


export const useItemCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;
    if (!uid) throw new Error("Missing UID");

    const updateItem = async (
        Item: Partial<ItemDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            if (!uid || !Item.item_id) throw new Error("Missing UID or Item ID");
            const docRef = doc(db, `aai/be_${uid}/items`, Item.item_id);
            const { item_id, ...updateFields } = Item; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updateItem error:", err);
            onError(err);
        }
    };


    const insertItem = async (preparedOItem: ItemDB) => {
        const docRef = doc(db, `aai/be_${uid}/items`, preparedOItem.item_id);
        await setDoc(docRef, preparedOItem);
    };


    const fetchItems = async (): Promise<ItemDB[]> => {
        try {
            const itemsRef = collection(db, `aai/be_${uid}/items`);
            const q = query(itemsRef, where("is_deleted", "==", 0),);
            const querySnap = await getDocs(q);

            const items: ItemDB[] = querySnap.docs.map(doc => doc.data() as ItemDB);
            return items;
        } catch (err) {
            console.error("❌ fetchItems error:", err);
            throw err;
        }
    };


    const fetchEmptyItem = async (): Promise<ItemDB|null> => {
        try {
            const invDocRef = doc(db, "aai", `be_${uid}`, "item_empty", "item_empty");
            const invDocSnap = await getDoc(invDocRef);

            if (invDocSnap.exists()) {
                const data = invDocSnap.data() as ItemDB; // optional type cast
                return data
            } else {
                console.warn("No inv_empty doc found in Firestore.");
                return null
            }
        } catch (err) {
            console.error("Error initializing invoice:", err);
            return null
        }
    };



    return { insertItem, updateItem, fetchItems };
};