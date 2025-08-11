import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import * as Crypto from 'expo-crypto';

import { ClientDB, InvDB } from '@/src/types';
import { useFirebaseUserStore } from "../stores";


export const useClientCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;

    const updateClient = async (
        Client: Partial<ClientDB>,
        onSuccess: () => void,
        onError: (err: any) => void
    ) => {
        try {
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
            const client_id = 'c_' + Crypto.randomUUID().replace(/-/g, '');


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
            if (!uid) throw new Error("Missing UID");

            const clientsRef = collection(db, `aai/be_${uid}/clients`);
            const q = query(clientsRef, where("is_deleted", "==", 0),);
            const querySnap = await getDocs(q);

            const clients: ClientDB[] = querySnap.docs.map(doc => doc.data() as ClientDB);
            return clients;
        } catch (err) {
            console.error("❌ fetchClients error:", err);
            throw err;
        }
    };


    const fetch1Client = async (clientId: string): Promise<ClientDB | null> => {
        try {
            const clientsRef = collection(db, `aai/be_${uid}/clients`);
            const q = query(clientsRef, where("client_id", "==", clientId));
            const querySnap = await getDocs(q);

            if (querySnap.empty) {
                return null;
            }

            // Return the first matching client (should be unique)
            return querySnap.docs[0].data() as ClientDB;

        } catch (err) {
            console.error(`Failed to load client with client_id ${clientId} from Firestore:`, err);
            return null;
        }
    };

    return { insertClient, updateClient, fetchClients, fetch1Client };
};