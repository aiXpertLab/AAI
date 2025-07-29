import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { BusinessEntity } from "./createBusiness";

const db = getFirestore(app);

/**
 * Gets the business entity for a user
 * @param userId - Firebase Auth user ID
 * @returns Promise<{businessId: string, businessData: BusinessEntity} | null>
 */
export async function getUserBusinessEntity(
  userId: string
): Promise<{ businessId: string; businessData: BusinessEntity } | null> {
  try {
    // Query for business entity by owner_user_id
    const businessQuery = query(
      collection(db, "bizentities"),
      where("owner_user_id", "==", userId)
    );

    const querySnapshot = await getDocs(businessQuery);

    if (!querySnapshot.empty) {
      // User has a business entity
      const businessDoc = querySnapshot.docs[0];
      const businessId = businessDoc.id;
      const businessData = businessDoc.data() as BusinessEntity;

      return {
        businessId,
        businessData,
      };
    } else {
      // User doesn't have a business entity yet
      return null;
    }
  } catch (error) {
    console.error("Error getting user business entity:", error);
    throw error;
  }
}

/**
 * Gets a business entity by ID
 * @param businessId - The business entity ID
 * @returns Promise<BusinessEntity | null>
 */
export async function getBusinessEntityById(
  businessId: string
): Promise<BusinessEntity | null> {
  try {
    const businessRef = doc(db, "bizentities", businessId);
    const businessDoc = await getDoc(businessRef);

    if (businessDoc.exists()) {
      return businessDoc.data() as BusinessEntity;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting business entity by ID:", error);
    throw error;
  }
}

/**
 * Checks if a user has a business entity
 * @param userId - Firebase Auth user ID
 * @returns Promise<boolean>
 */
export async function userHasBusinessEntity(userId: string): Promise<boolean> {
  try {
    const businessEntity = await getUserBusinessEntity(userId);
    return businessEntity !== null;
  } catch (error) {
    console.error("Error checking if user has business entity:", error);
    return false;
  }
}