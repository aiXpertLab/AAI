import React, { createContext, useContext, ReactNode } from 'react';
import { useBusinessEntity } from '../hooks/useFirestoreBusiness';
import { BusinessEntity } from '../firestore';

interface BusinessContextType {
    businessId: string | null;
    businessData: BusinessEntity | null;
    isLoading: boolean;
    error: string | null;
    refreshBusiness: () => Promise<void>;
    createNewBusiness: (businessName?: string) => Promise<string>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

interface BusinessProviderProps {
    children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
    const businessState = useBusinessEntity();

    return (
        <BusinessContext.Provider value={businessState}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
}