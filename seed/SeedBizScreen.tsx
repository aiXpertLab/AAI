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
            await setDoc(bizRef, seed_data.business_entity);

            // 2. payment methods
            for (const method of seed_data.payment_methods) {
                const paymentDoc = doc(collection(bizRef, "payment_methods"), method.pm_id);
                await setDoc(paymentDoc, method);
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
