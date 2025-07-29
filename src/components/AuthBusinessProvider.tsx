import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthWithBusiness } from '../hooks/useAuthWithBusiness';

interface AuthBusinessContextType {
  user: any;
  businessId: string | null;
  businessData: any;
  isLoading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  createNewBusiness: (businessName?: string) => Promise<string>;
}

const AuthBusinessContext = createContext<AuthBusinessContextType | undefined>(undefined);

interface AuthBusinessProviderProps {
  children: ReactNode;
}

export function AuthBusinessProvider({ children }: AuthBusinessProviderProps) {
  const authBusinessState = useAuthWithBusiness();

  return (
    <AuthBusinessContext.Provider value={authBusinessState}>
      {children}
    </AuthBusinessContext.Provider>
  );
}

export function useAuthBusiness() {
  const context = useContext(AuthBusinessContext);
  if (context === undefined) {
    throw new Error('useAuthBusiness must be used within an AuthBusinessProvider');
  }
  return context;
}