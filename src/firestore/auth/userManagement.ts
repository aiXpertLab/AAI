import { User } from "firebase/auth";
import { createBusinessEntity } from "../business/createBusiness";
import { getUserBusinessEntity, userHasBusinessEntity } from "../business/getBusiness";

/**
 * Complete user onboarding flow
 * @param user - Firebase Auth user
 * @param businessName - Optional business name
 * @returns Promise<string> - Business entity ID
 */
export async function handleUserOnboarding(
  user: User,
  businessName?: string
): Promise<string> {
  try {
    // Check if user already has a business entity
    const hasBusiness = await userHasBusinessEntity(user.uid);
    
    if (hasBusiness) {
      // User already has a business entity, get it
      const businessEntity = await getUserBusinessEntity(user.uid);
      if (businessEntity) {
        console.log("User already has business entity:", businessEntity.businessId);
        return businessEntity.businessId;
      }
    }

    // User doesn't have a business entity, create one
    console.log("Creating new business entity for user:", user.uid);
    const businessId = await createBusinessEntity(
      user.uid, 
      businessName || "My Business"
    );

    console.log("User onboarding completed. Business ID:", businessId);
    return businessId;
  } catch (error) {
    console.error("Error in user onboarding:", error);
    throw error;
  }
}

/**
 * Gets or creates business entity for a user
 * @param user - Firebase Auth user
 * @returns Promise<string> - Business entity ID
 */
export async function getOrCreateBusinessEntity(user: User): Promise<string> {
  try {
    // First try to get existing business entity
    const businessEntity = await getUserBusinessEntity(user.uid);
    
    if (businessEntity) {
      return businessEntity.businessId;
    }

    // If no business entity exists, create one
    return await createBusinessEntity(user.uid);
  } catch (error) {
    console.error("Error getting or creating business entity:", error);
    throw error;
  }
}

/**
 * Validates if a user can access a business entity
 * @param userId - Firebase Auth user ID
 * @param businessId - Business entity ID
 * @returns Promise<boolean>
 */
export async function validateUserBusinessAccess(
  userId: string,
  businessId: string
): Promise<boolean> {
  try {
    const businessEntity = await getUserBusinessEntity(userId);
    
    if (!businessEntity) {
      return false;
    }

    // Check if the business entity belongs to the user
    return businessEntity.businessId === businessId;
  } catch (error) {
    console.error("Error validating user business access:", error);
    return false;
  }
}