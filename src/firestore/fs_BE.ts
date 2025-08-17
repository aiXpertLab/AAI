import { getFirestore, getDocs, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/src/config/firebaseConfig";

const db = getFirestore(app);

export const createBusinessEntity = async (uid: string) => {
    const seedRef = doc(db, "biz_seed", "biz_seed_doc");
    const seedSnap = await getDoc(seedRef);
    if (!seedSnap.exists()) { throw new Error("Seed document not found."); }
    const paymentMethodsRef = collection(seedRef, "payment_methods");
    const paymentSnaps = await getDocs(paymentMethodsRef);

    const biz_id = `be_${uid}`;
    const userBizRef = doc(db, "aiai", biz_id);
    await setDoc(userBizRef, seedSnap.data());

    for (const snap of paymentSnaps.docs) {
        const destRef = doc(db, "aiai", biz_id, "payment_methods", snap.id);
        await setDoc(destRef, snap.data());
    }

    console.log(`Business entity created for user: ${uid}`);
};


