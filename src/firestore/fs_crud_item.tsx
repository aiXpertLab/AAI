import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { ItemDB } from '@/src/types';


export const useItemCrud = () => {
    const db = getFirestore(app);
    const firebaseUser = useFirebaseUserStore((state) => state.FirebaseUser);
    const uid = firebaseUser?.uid;
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


    const insertItem = async (
        Item: Partial<ItemDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const item_id = 'i_' + Crypto.randomUUID().replace(/-/g, '');
            const docRef = doc(db, `aai/be_${uid}/items`, item_id);

            const newItem: Partial<ItemDB> = {
                ...Item,
                item_id: item_id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                is_deleted: 0,
            };

            // const docRef = await addDoc(colRef, newPM);
            await setDoc(docRef, newItem);
            console.log("✅ Inserted Item:", docRef.id);

            onSuccess();
        } catch (err) {
            console.error("❌ insertItem error:", err);
            onError(err);
        }
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

    return { insertItem, updateItem, fetchItems };
};