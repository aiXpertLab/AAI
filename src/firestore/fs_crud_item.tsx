import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { getUserUid } from "@/src/utils/getFirebaseUid";
const db = getFirestore(app);
import { ItemDB } from '@/src/types';


export const useItemCrud = () => {

    const updateItem = async (
        Item: Partial<ItemDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
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
            const uid = getUserUid();
            if (!uid) throw new Error('Missing UID');
            const item_id = Crypto.randomUUID();

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
            const uid = getUserUid();
            if (!uid) throw new Error("Missing UID");

            const itemsRef = collection(db, `aai/be_${uid}/items`);
            const q = query(itemsRef,where("is_deleted", "==", 0),);
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