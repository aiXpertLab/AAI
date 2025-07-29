import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  handleUserOnboarding, 
  getUserBusinessEntity,
  getOrCreateBusinessEntity,
  BusinessEntity 
} from '../firestore';
import { useFirebaseUserStore } from '../stores/useUserStore';

export interface UseAuthWithBusinessReturn {
  user: User | null;
  businessId: string | null;
  businessData: BusinessEntity | null;
  isLoading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  createNewBusiness: (businessName?: string) => Promise<string>;
}

/**
 * Hook that combines authentication with business entity management
 * Works with existing Firebase user store
 * Automatically creates business entity for new users
 */
export function useAuthWithBusiness(): UseAuthWithBusinessReturn {
  // Use existing user store instead of managing auth state
  const user = useFirebaseUserStore((state) => state.FirebaseUser);
  
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load or create business entity for current user
  const loadOrCreateBusinessEntity = useCallback(async (currentUser: User) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Try to get existing business entity
      const businessEntity = await getUserBusinessEntity(currentUser.uid);
      
      if (businessEntity) {
        // User has existing business entity
        setBusinessId(businessEntity.businessId);
        setBusinessData(businessEntity.businessData);
      } else {
        // User doesn't have business entity - create one automatically
        console.log('Creating new business entity for user:', currentUser.uid);
        const newBusinessId = await getOrCreateBusinessEntity(currentUser);
        
        // Get the newly created business entity
        const newBusinessEntity = await getUserBusinessEntity(currentUser.uid);
        if (newBusinessEntity) {
          setBusinessId(newBusinessEntity.businessId);
          setBusinessData(newBusinessEntity.businessData);
        }
      }
    } catch (err) {
      console.error('Error loading/creating business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new business entity (for manual creation if needed)
  const createNewBusiness = useCallback(async (businessName?: string): Promise<string> => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setIsLoading(true);
      setError(null);

      const newBusinessId = await handleUserOnboarding(user, businessName);
      
      // Reload business data
      await loadOrCreateBusinessEntity(user);
      
      return newBusinessId;
    } catch (err) {
      console.error('Error creating business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create business');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadOrCreateBusinessEntity]);

  // Refresh business data
  const refreshBusiness = useCallback(async () => {
    if (user) {
      await loadOrCreateBusinessEntity(user);
    }
  }, [user, loadOrCreateBusinessEntity]);

  // Watch for user changes and load business entity
  useEffect(() => {
    if (user) {
      // User is signed in - load or create their business entity
      loadOrCreateBusinessEntity(user);
    } else {
      // User is signed out - clear business data
      setBusinessId(null);
      setBusinessData(null);
      setError(null);
    }
  }, [user, loadOrCreateBusinessEntity]);

  return {
    user,
    businessId,
    businessData,
    isLoading,
    error,
    refreshBusiness,
    createNewBusiness,
  };
}