import { getFirestore, collection, addDoc, getDocs, writeBatch, serverTimestamp } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { seedData } from "./seedData";

const db = getFirestore(app);

/**
 * Creates the master seed collection in Firestore
 * This should be run once to set up the template data
 */
export async function createMasterSeedCollection(): Promise<void> {
  try {
    console.log("Creating master seed collection...");

    // Create seed collection
    const seedCollectionRef = collection(db, "seed_collection");

    // Add payment methods to seed collection
    const paymentMethodsRef = collection(seedCollectionRef, "payment_methods");
    for (const method of seedData.paymentMethods) {
      await addDoc(paymentMethodsRef, {
        ...method,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    // Add tax rates to seed collection
    const taxRatesRef = collection(seedCollectionRef, "tax_rates");
    for (const tax of seedData.taxRates) {
      await addDoc(taxRatesRef, {
        ...tax,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    // Add clients to seed collection
    const clientsRef = collection(seedCollectionRef, "clients");
    for (const client of seedData.clients) {
      await addDoc(clientsRef, {
        ...client,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    // Add items to seed collection
    const itemsRef = collection(seedCollectionRef, "items");
    for (const item of seedData.items) {
      await addDoc(itemsRef, {
        ...item,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    console.log("Master seed collection created successfully!");
  } catch (error) {
    console.error("Error creating master seed collection:", error);
    throw error;
  }
}

/**
 * Resets the master seed collection (deletes all and recreates)
 */
export async function resetMasterSeedCollection(): Promise<void> {
  try {
    console.log("Resetting master seed collection...");

    const seedCollectionRef = collection(db, "seed_collection");
    
    // Get all subcollections
    const subcollections = ["payment_methods", "tax_rates", "clients", "items"];
    
    for (const subcollectionName of subcollections) {
      const subcollectionRef = collection(seedCollectionRef, subcollectionName);
      const snapshot = await getDocs(subcollectionRef);
      
      // Delete all documents in batch
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Recreate the seed collection
    await createMasterSeedCollection();
    
    console.log("Master seed collection reset successfully!");
  } catch (error) {
    console.error("Error resetting master seed collection:", error);
    throw error;
  }
}

/**
 * Gets all seed data from the master collection
 * @returns Promise<object> - All seed data
 */
export async function getMasterSeedData(): Promise<any> {
  try {
    const seedCollectionRef = collection(db, "seed_collection");
    const result: any = {};

    // Get payment methods
    const paymentMethodsRef = collection(seedCollectionRef, "payment_methods");
    const paymentMethodsSnapshot = await getDocs(paymentMethodsRef);
    result.paymentMethods = paymentMethodsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get tax rates
    const taxRatesRef = collection(seedCollectionRef, "tax_rates");
    const taxRatesSnapshot = await getDocs(taxRatesRef);
    result.taxRates = taxRatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get clients
    const clientsRef = collection(seedCollectionRef, "clients");
    const clientsSnapshot = await getDocs(clientsRef);
    result.clients = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get items
    const itemsRef = collection(seedCollectionRef, "items");
    const itemsSnapshot = await getDocs(itemsRef);
    result.items = itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return result;
  } catch (error) {
    console.error("Error getting master seed data:", error);
    throw error;
  }
}

// Export the seed data for direct use
export { seedData };