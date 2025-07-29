import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { app } from "../../config/firebaseConfig";

const db = getFirestore(app);

export interface PaymentMethod {
  id?: string;
  pm_name: string;
  pm_note: string;
  is_default: boolean;
  is_locked: number;
  is_deleted: number;
  is_demo?: boolean;
  created_at: any;
  updated_at: any;
}

/**
 * Get all payment methods for a business entity
 * @param businessId - Business entity ID
 * @returns Promise<PaymentMethod[]>
 */
export async function getPaymentMethods(businessId: string): Promise<PaymentMethod[]> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const paymentMethodsRef = collection(businessRef, "payment_methods");
    
    const q = query(paymentMethodsRef, where("is_deleted", "==", 0));
    const snapshot = await getDocs(q);
    
    const paymentMethods: PaymentMethod[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentMethod[];
    
    return paymentMethods;
  } catch (error) {
    console.error("Error getting payment methods:", error);
    throw error;
  }
}

/**
 * Add a new payment method
 * @param businessId - Business entity ID
 * @param paymentMethod - Payment method data
 * @returns Promise<string> - Document ID
 */
export async function addPaymentMethod(
  businessId: string, 
  paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const paymentMethodsRef = collection(businessRef, "payment_methods");
    
    const docRef = await addDoc(paymentMethodsRef, {
      ...paymentMethod,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
}

/**
 * Update a payment method
 * @param businessId - Business entity ID
 * @param paymentMethodId - Payment method document ID
 * @param updates - Fields to update
 * @returns Promise<void>
 */
export async function updatePaymentMethod(
  businessId: string,
  paymentMethodId: string,
  updates: Partial<PaymentMethod>
): Promise<void> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const paymentMethodRef = doc(businessRef, "payment_methods", paymentMethodId);
    
    await updateDoc(paymentMethodRef, {
      ...updates,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
}

/**
 * Delete a payment method (soft delete)
 * @param businessId - Business entity ID
 * @param paymentMethodId - Payment method document ID
 * @returns Promise<void>
 */
export async function deletePaymentMethod(
  businessId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const paymentMethodRef = doc(businessRef, "payment_methods", paymentMethodId);
    
    await updateDoc(paymentMethodRef, {
      is_deleted: 1,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error;
  }
}

/**
 * Get default payment method for a business entity
 * @param businessId - Business entity ID
 * @returns Promise<PaymentMethod | null>
 */
export async function getDefaultPaymentMethod(businessId: string): Promise<PaymentMethod | null> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const paymentMethodsRef = collection(businessRef, "payment_methods");
    
    const q = query(
      paymentMethodsRef, 
      where("is_default", "==", true),
      where("is_deleted", "==", 0)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as PaymentMethod;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting default payment method:", error);
    throw error;
  }
}