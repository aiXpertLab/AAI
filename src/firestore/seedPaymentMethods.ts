import { getFirestore, collection, addDoc, serverTimestamp, getDocs, writeBatch } from "firebase/firestore";
import { app } from "../config/firebaseConfig";

// Use the already initialized Firebase app
const db = getFirestore(app);

const paymentMethods = [
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Credit Card",
        pm_note: "Processed via Stripe, Square, or other payment processors.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Check",
        pm_note: "Make payable to My Business Name. No checks accepted.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Cash",
        pm_note: "Accepted for local transactions only. No cash accepted.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Bank Transfer (ACH)",
        pm_note: "Routing and account number required. No bank transfers accepted.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Wire Transfer",
        pm_note: "International bank wire. Bank fees may apply.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user2",
        biz_id: "888",
        pm_name: "PayPal",
        pm_note: "Send payments to user@example.com",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Bank Transfer (EFT)",
        pm_note: "Canadian customers only.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Interac e-Transfer",
        pm_note: "Only available in Canada.",
        is_locked: 0,
        is_deleted: 0,
    },
    {
        user_id: "user1",
        biz_id: "888",
        pm_name: "Other",
        pm_note: "Please refer to the invoice note for payment instructions.",
        is_locked: 0,
        is_deleted: 0,
    },
];

export async function seedPaymentMethodsFirestore() {
    // 1. Delete all existing documents in the collection
    const colRef = collection(db, "payment_methods");
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // 2. Insert the seed data
    for (const method of paymentMethods) {
        await addDoc(colRef, {
            ...method,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    }
    console.log("Payment methods collection reset and seeded to Firestore.");
}

