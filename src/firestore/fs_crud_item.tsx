import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs, getDoc } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { ItemDB } from '@/src/types';


export const useItemCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;
    if (!uid) throw new Error("Missing UID");

    const updateItem = async (Item: Partial<ItemDB>): Promise<void> => {
        if (!uid || !Item.item_id) throw new Error("Missing UID or Item ID");
        const docRef = doc(db, `aiai/be_${uid}/items`, Item.item_id);
        await updateDoc(docRef, Item);
    };


    const insertItem = async (preparedOItem: ItemDB): Promise<void> => {
        const docRef = doc(db, `aiai/be_${uid}/items`, preparedOItem.item_id);
        const itemToInsert: ItemDB = {
            ...preparedOItem,
            item_quantity: 1,
            item_amount: preparedOItem.item_rate ?? 0,
        };      // quantity=1 make sure rate=amount, so that item-pickup in invoice could be added directly
        await setDoc(docRef, itemToInsert);
    };


    const fetchItems = async (): Promise<ItemDB[]> => {
        try {
            const itemsRef = collection(db, `aiai/be_${uid}/items`);
            const q = query(itemsRef, where("is_deleted", "==", 0),);
            const querySnap = await getDocs(q);
            const items: ItemDB[] = querySnap.docs.map(doc => doc.data() as ItemDB);
            return items;
        } catch (err) {
            console.error("❌ fetchItems error:", err);
            throw err;
        }
    };

    const fetch1Item = async (itemId: string): Promise<ItemDB | null> => {
        const itemsRef = collection(db, `aiai/be_${uid}/items`);
        const q = query(itemsRef, where("item_id", "==", itemId),);
        const querySnap = await getDocs(q);
        if (querySnap.empty) { return null; }

        const data = querySnap.docs[0].data();

        return data as ItemDB
    };


    return { insertItem, updateItem, fetchItems, fetch1Item };
};