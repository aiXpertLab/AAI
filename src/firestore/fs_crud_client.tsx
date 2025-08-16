import { getFirestore, setDoc, updateDoc, doc, serverTimestamp, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

import { ClientDB, InvDB } from '@/src/types';
import { useFirebaseUserStore } from "../stores";


export const useClientCrud = () => {
    const db = getFirestore(app);
    const uid = useFirebaseUserStore.getState().FirebaseUser?.uid;
    if (!uid) throw new Error("Missing UID");


    const updateClient = async (updates: Partial<ClientDB>, clientId: string): Promise<void> => {
        const docRef = doc(db, `aai/be_${uid}/clients`, clientId);
        await updateDoc(docRef, { ...updates, });
    };


    const insertClient = async (oClient: ClientDB): Promise<void> => {
        const docRef = doc(db, `aai/be_${uid}/clients`, oClient.client_id);
        await setDoc(docRef, oClient);
    };


    const fetchClients = async (): Promise<ClientDB[]> => {
        if (!uid) throw new Error("Missing UID");

        const clientsRef = collection(db, `aai/be_${uid}/clients`);
        const q = query(clientsRef, where("is_deleted", "==", 0),);     // show default status . not show deleted or TBD.
        const querySnap = await getDocs(q);

        const clients: ClientDB[] = querySnap.docs.map(doc => doc.data() as ClientDB);
        return clients;
    };


    const fetch1Client = async (clientId: string): Promise<ClientDB | null> => {
        const clientsRef = collection(db, `aai/be_${uid}/clients`);
        const q = query(clientsRef, where("client_id", "==", clientId));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
            return null;
        }

        // Return the first matching client (should be unique)
        return querySnap.docs[0].data() as ClientDB;
    };

    return { insertClient, updateClient, fetchClients, fetch1Client };
};