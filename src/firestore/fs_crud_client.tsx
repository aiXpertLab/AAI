import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { getUserUid } from "@/src/utils/getFirebaseUid";
const db = getFirestore(app);
import { ClientDB } from '@/src/types';


export const useClientCrud = () => {

    const updateClient = async (
        Client: Partial<ClientDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid || !Client.client_id) throw new Error("Missing UID or Client ID");

            const docRef = doc(db, `aai/be_${uid}/clients`, Client.client_id);

            const { client_id, ...updateFields } = Client; // remove id from payload

            await updateDoc(docRef, {
                ...updateFields,
                updated_at: serverTimestamp(),
            });

            onSuccess();
        } catch (err) {
            console.error("❌ updateClient error:", err);
            onError(err);
        }
    };


    const insertClient = async (
        Client: Partial<ClientDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
            const uid = getUserUid();
            if (!uid) throw new Error('Missing UID');
            const client_id = Crypto.randomUUID();

            const docRef = doc(db, `aai/be_${uid}/clients`, client_id);

            const newClient: Partial<ClientDB> = {
                ...Client,
                client_id: client_id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                is_deleted: 0,
            };

            // const docRef = await addDoc(colRef, newPM);
            await setDoc(docRef, newClient);
            console.log("✅ Inserted Client:", docRef.id);

            onSuccess();
        } catch (err) {
            console.error("❌ insertClient error:", err);
            onError(err);
        }
    };


    const fetchClients = async (): Promise<ClientDB[]> => {
        try {
            const uid = getUserUid();
            if (!uid) throw new Error("Missing UID");

            const clientsRef = collection(db, `aai/be_${uid}/clients`);
            const q = query(clientsRef,where("is_deleted", "==", 0),);
            const querySnap = await getDocs(q);

            const clients: ClientDB[] = querySnap.docs.map(doc => doc.data() as ClientDB);
            return clients;
        } catch (err) {
            console.error("❌ fetchClients error:", err);
            throw err;
        }
    };

    return { insertClient, updateClient, fetchClients };
};