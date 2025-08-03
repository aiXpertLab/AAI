import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { seed_data } from "./seed_data";

const db = getFirestore(app);

const SeedBizScreen = () => {
    useEffect(() => {
        (async () => {
            // 1. business entity
            const bizRef = doc(db, 'biz_seed', 'biz_seed_doc');
            console.log("bizentity")
            await setDoc(bizRef, seed_data.business_entity);

            // 2. payment methods
            for (const method of seed_data.payment_methods) {
                const paymentDoc = doc(collection(bizRef, "payment_methods"), method.pm_id);
                console.log("pm")
                await setDoc(paymentDoc, method);
            }

            // 3. tax list
            for (const tax of seed_data.tax_list) {
                const taxDoc = doc(collection(bizRef, "tax_list"), tax.tax_id);
                console.log("tax")
                await setDoc(taxDoc, tax);
            }


            // 4. clients
            for (const client of seed_data.clients) {
                const clientDoc = doc(collection(bizRef, "clients"), client.client_id);
                console.log("4.client")
                await setDoc(clientDoc, client);
            }


            // 5. items & services
            for (const item of seed_data.items) {
                const itemDoc = doc(collection(bizRef, "items"), item.item_id);
                console.log("5.items")
                await setDoc(itemDoc, item);
            }

            // 6. invocies
            for (const inv of seed_data.invs) {
                const invDoc = doc(collection(bizRef, "invs"), inv.inv_id);
                console.log("6.invoices", invDoc)
                await setDoc(invDoc, inv);
            }

        })();
    }, []);

    return (
        <View>
            <Text>Seeding Firestore... Check logs.</Text>
        </View>
    );
};

export default SeedBizScreen;
