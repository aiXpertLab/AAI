import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";
import { getMyBizSeed } from "./seed_data";

const db = getFirestore(app);

const SeedBizScreen = () => {
    useEffect(() => {
        (async () => {
            const bizRef = doc(db, 'bizseed', 'bizseedoc');
            await setDoc(bizRef, {
                biz_name: 'My Corporation',
                biz_email: 'change@me.com',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            });

            const paymentRef = collection(bizRef, 'paymentmethods');
            await addDoc(paymentRef, {
                pm_name: 'Credit Card',
                pm_note: 'Stripe',
                is_default: true,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            });

            console.log('✅ Seeding done');
        })();
    }, []);

    return (
        <View>
            <Text>Seeding Firestore... Check logs.</Text>
        </View>
    );
};

export default SeedBizScreen;
