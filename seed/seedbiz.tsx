import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

const db = getFirestore(app);

// Firestore path constants
const BIZSEED_DOC_ID = 'biz_seed_doc';
const BIZSEED_COLLECTION = 'biz_seed_collection';
const PAYMENT_METHODS_SUBCOLLECTION = 'payment_methods';

// Master biz data
const bizseedData = {
    biz_name: 'My Corporation',
    biz_address: '1600 Pennsylvania Ave.,\nWashington DC',
    biz_email: 'change@me.com',
    biz_phone: '1-888-168-5868',
    biz_biz_number: '821235679RC0001',
    biz_tax_id: '1685868RT001',
    biz_bank_info: 'TD Bank',
    biz_inv_template_id: 't1',
    biz_website: 'https://www.aibookshub.com',
    biz_description: 'This is a note for the bissiness.',
    biz_note: 'This is a note for the bissiness.',
    biz_payment_term: 7,
    is_locked: 0,
    is_deleted: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
};

// Seed payment methods
const paymentMethods = [
    {
        pm_name: 'Credit Card',
        pm_note: 'Processed via Stripe, Square, or other payment processors.',
        is_default: true,
        is_locked: 0,
        is_deleted: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    },
    {
        pm_name: 'Bank Transfer (ACH)',
        pm_note: 'Routing and account number required.',
        is_default: false,
        is_locked: 0,
        is_deleted: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    },
    {
        pm_name: 'Cash',
        pm_note: 'Accepted for local transactions only.',
        is_default: false,
        is_locked: 0,
        is_deleted: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    },
];

async function seedBizSeed() {
    console.log('🌱 Seeding Firestore: /bizseed/bizseedoc');

    // 1. Write the root doc
    const bizDocRef = doc(db, BIZSEED_COLLECTION, BIZSEED_DOC_ID);
    await setDoc(bizDocRef, bizseedData);
    console.log(`✅ Document '${BIZSEED_DOC_ID}' created in /${BIZSEED_COLLECTION}`);

    // 2. Write subcollection: paymentmethods
    const pmCollectionRef = collection(bizDocRef, PAYMENT_METHODS_SUBCOLLECTION);

    for (const pm of paymentMethods) {
        const added = await addDoc(pmCollectionRef, pm);
        console.log(`✅ Payment method added with ID: ${added.id}`);
    }

    console.log('✅ Seeding complete!');
}

// Run
seedBizSeed().catch((err) => {
    console.error('❌ Seeding failed:', err);
});
