import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { 
  handleUserOnboarding, 
  getOrCreateBusinessEntity,
  getUserBusinessEntity,
  BusinessEntity 
} from '../firestore';

export interface UseFirestoreBusinessReturn {
  businessId: string | null;
  businessData: BusinessEntity | null;
  isLoading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  createNewBusiness: (businessName?: string) => Promise<string>;
}

/**
 * Hook to manage business entity for the current user
 */
export function useFirestoreBusiness(): UseFirestoreBusinessReturn {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  const user = auth.currentUser;

  // Load business entity for current user
  const loadBusinessEntity = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const businessEntity = await getUserBusinessEntity(user.uid);
      
      if (businessEntity) {
        setBusinessId(businessEntity.businessId);
        setBusinessData(businessEntity.businessData);
      } else {
        setBusinessId(null);
        setBusinessData(null);
      }
    } catch (err) {
      console.error('Error loading business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create new business entity
  const createNewBusiness = useCallback(async (businessName?: string): Promise<string> => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setIsLoading(true);
      setError(null);

      const newBusinessId = await handleUserOnboarding(user, businessName);
      
      // Reload business data
      await loadBusinessEntity();
      
      return newBusinessId;
    } catch (err) {
      console.error('Error creating business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create business');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadBusinessEntity]);

  // Refresh business data
  const refreshBusiness = useCallback(async () => {
    await loadBusinessEntity();
  }, [loadBusinessEntity]);

  // Auto-load business entity when user changes
  useEffect(() => {
    loadBusinessEntity();
  }, [loadBusinessEntity]);

  return {
    businessId,
    businessData,
    isLoading,
    error,
    refreshBusiness,
    createNewBusiness,
  };
}

/**
 * Hook to get or create business entity (for new users)
 */
export function useBusinessEntity(): UseFirestoreBusinessReturn {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;

  // Get or create business entity
  const loadOrCreateBusiness = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newBusinessId = await getOrCreateBusinessEntity(user);
      setBusinessId(newBusinessId);

      // Get business data
      const businessEntity = await getUserBusinessEntity(user.uid);
      if (businessEntity) {
        setBusinessData(businessEntity.businessData);
      }
    } catch (err) {
      console.error('Error getting or creating business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create new business entity
  const createNewBusiness = useCallback(async (businessName?: string): Promise<string> => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setIsLoading(true);
      setError(null);

      const newBusinessId = await handleUserOnboarding(user, businessName);
      
      // Reload business data
      await loadOrCreateBusiness();
      
      return newBusinessId;
    } catch (err) {
      console.error('Error creating business entity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create business');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadOrCreateBusiness]);

  // Refresh business data
  const refreshBusiness = useCallback(async () => {
    await loadOrCreateBusiness();
  }, [loadOrCreateBusiness]);

  // Auto-load or create business entity when user changes
  useEffect(() => {
    loadOrCreateBusiness();
  }, [loadOrCreateBusiness]);

  return {
    businessId,
    businessData,
    isLoading,
    error,
    refreshBusiness,
    createNewBusiness,
  };
}