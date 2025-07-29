# Integration Guide: Adding Business Entity System to Existing App

## Overview

This guide shows you how to integrate the new Firestore business entity system with your existing authentication flow **without changing your current sign-on process**.

## Step 1: Setup (One Time)

### 1.1 Create Master Seed Collection
Run this once to set up the template data:

```typescript
import { createMasterSeedCollection } from '../firestore/seed';

// Run this in your development environment
await createMasterSeedCollection();
```

### 1.2 Update App.tsx
Replace your current AppNavigator with the new one:

```typescript
// In App.tsx
import AppNavigatorWithBusiness from './src/navigation/AppNavigatorWithBusiness';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="db.db" onInit={migrateDbIfNeeded}>
        <AppNavigatorWithBusiness /> {/* Replace your current AppNavigator */}
        <Toast />
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
```

## Step 2: User Flow

### 2.1 Existing Users
- User signs in with your existing SignScreen
- App automatically detects they have a business entity
- User goes directly to main app

### 2.2 New Users
- User signs up with your existing SignScreen
- App detects they don't have a business entity
- App shows OnboardingScreen
- User creates business entity with demo data
- User goes to main app

## Step 3: Using Business Entity in Components

### 3.1 Replace Your Existing Components
Instead of your current components, use the business-aware versions:

```typescript
// OLD WAY (your current approach)
import { getFirestore, collection, getDocs } from "firebase/firestore";

// NEW WAY (with business entity)
import { useAuthBusiness } from '../components/AuthBusinessProvider';
import { getPaymentMethods } from '../firestore/collections/paymentMethods';

function MyComponent() {
  const { businessId } = useAuthBusiness();
  
  // Load data for this specific business
  const paymentMethods = await getPaymentMethods(businessId);
}
```

### 3.2 Example: Payment Methods List
Replace your current `PaymentMethod_List.tsx`:

```typescript
import React, { useEffect, useState } from "react";
import { useAuthBusiness } from '../components/AuthBusinessProvider';
import { getPaymentMethods, PaymentMethod } from '../firestore/collections/paymentMethods';

export const PaymentMethod_List: React.FC = () => {
  const { businessId } = useAuthBusiness();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (businessId) {
      loadPaymentMethods();
    }
  }, [businessId]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods(businessId!);
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    }
  };

  // Your existing render logic here
  return (
    // ... your existing JSX
  );
};
```

## Step 4: Migration Strategy

### 4.1 Gradual Migration
You can migrate components one by one:

1. **Start with new features** - Use business entity system
2. **Migrate existing components** - One at a time
3. **Keep old system running** - Until migration is complete

### 4.2 Data Migration (Optional)
If you want to migrate existing users:

```typescript
import { createBusinessEntity } from '../firestore/business/createBusiness';

// For each existing user
const businessId = await createBusinessEntity(user.uid, "Existing Business");
// Then migrate their data to the new structure
```

## Step 5: Testing

### 5.1 Test New User Flow
1. Create a new Firebase Auth account
2. Verify onboarding screen appears
3. Create business entity
4. Verify demo data is loaded

### 5.2 Test Existing User Flow
1. Sign in with existing account
2. Verify they go directly to main app
3. Verify their data is accessible

## Benefits You Get

### ✅ **No Changes to Sign-On**
- Your existing SignScreen works exactly the same
- No user experience disruption

### ✅ **Automatic Business Creation**
- New users get business entity automatically
- Demo data helps them get started

### ✅ **Data Isolation**
- Each user's data is completely separate
- No data leakage between users

### ✅ **Scalable Architecture**
- Easy to add new users
- Efficient queries and indexing

### ✅ **Demo Data System**
- New users see working examples
- Reduces onboarding friction

## Troubleshooting

### Issue: "No business entity found"
**Solution**: User needs to go through onboarding. Check if `isOnboarding` is true.

### Issue: "Permission denied"
**Solution**: Check Firestore security rules. Make sure they allow access to business entities.

### Issue: "Seed data not loading"
**Solution**: Run `createMasterSeedCollection()` to set up the template data.

## Next Steps

1. **Implement the integration** following this guide
2. **Test with new users** to verify onboarding flow
3. **Test with existing users** to verify data access
4. **Migrate components gradually** to use business entity system
5. **Add more collection operations** (clients, invoices, etc.)

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify Firestore security rules
3. Ensure the master seed collection is created
4. Check that the business entity is being created correctly