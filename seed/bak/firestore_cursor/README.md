# Firestore Multi-Tenant Architecture

This directory contains the complete Firestore implementation for the multi-tenant invoice application.

## Structure

```
src/firestore/
├── auth/                    # Authentication and user management
│   └── userManagement.ts    # User onboarding flow
├── business/               # Business entity management
│   ├── createBusiness.ts   # Create new business entity
│   └── getBusiness.ts      # Get user's business entity
├── collections/            # Collection-specific operations
│   └── paymentMethods.ts   # Payment methods CRUD
├── seed/                   # Seed data management
│   ├── index.ts           # Main seed functions
│   └── seedData.ts        # All seed data definitions
└── index.ts               # Main exports
```

## Database Structure

```
db (database)
└── bizentities (collection)
    ├── be1 (document) - User 1's business
    │   ├── payment_methods (subcollection)
    │   ├── clients (subcollection)
    │   ├── invoices (subcollection)
    │   ├── items (subcollection)
    │   └── tax_rates (subcollection)
    ├── be2 (document) - User 2's business
    └── be3 (document) - User 3's business
```

## Key Features

### 1. **Multi-Tenant Isolation**
- Each user gets their own business entity (`be1`, `be2`, etc.)
- Complete data isolation between users
- Secure access control

### 2. **Seed Data System**
- New users get populated with demo data
- Helps users understand the app immediately
- Reduces onboarding friction

### 3. **One User = One Business Entity**
- Simple and secure model
- No complex user-business relationships
- Easy to manage and scale

## Usage

### 1. **Setup (One Time)**

```typescript
import { createMasterSeedCollection } from '../firestore/seed';

// Create the master seed collection
await createMasterSeedCollection();
```

### 2. **In Your App**

```typescript
import { BusinessProvider, useBusiness } from '../components/BusinessProvider';

// Wrap your app
function App() {
  return (
    <BusinessProvider>
      <YourApp />
    </BusinessProvider>
  );
}

// Use in components
function MyComponent() {
  const { businessId, businessData, isLoading, createNewBusiness } = useBusiness();
  
  if (isLoading) return <Loading />;
  
  if (!businessId) {
    return <OnboardingScreen onComplete={createNewBusiness} />;
  }
  
  return <MainApp businessId={businessId} />;
}
```

### 3. **Working with Collections**

```typescript
import { getPaymentMethods, addPaymentMethod } from '../firestore/collections/paymentMethods';

// Get payment methods for current business
const paymentMethods = await getPaymentMethods(businessId);

// Add new payment method
await addPaymentMethod(businessId, {
  pm_name: "Credit Card",
  pm_note: "Processed via Stripe",
  is_default: false,
  is_locked: 0,
  is_deleted: 0,
});
```

## User Flow

### **New User Onboarding:**
1. User signs up with Firebase Auth
2. App calls `handleUserOnboarding(user)`
3. Creates business entity (`be1`)
4. Copies seed data to user's business entity
5. User sees populated app with demo data

### **Existing User Login:**
1. User logs in with Firebase Auth
2. App calls `getUserBusinessEntity(user.uid)`
3. Returns existing business entity
4. User sees their data

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bizentities/{businessId} {
      // Allow access only to business owner
      allow read, write: if request.auth != null && 
        resource.data.owner_user_id == request.auth.uid;
      
      // Allow access to all subcollections
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/bizentities/$(businessId)).data.owner_user_id == request.auth.uid;
      }
    }
  }
}
```

## Migration from Old Structure

If you're migrating from the old structure:

1. **Backup existing data**
2. **Create new business entities** for existing users
3. **Migrate data** to new structure
4. **Update app code** to use new functions
5. **Test thoroughly**

## Benefits

- ✅ **Scalable**: Easy to add new users
- ✅ **Secure**: Complete data isolation
- ✅ **User-friendly**: Demo data helps onboarding
- ✅ **Maintainable**: Clean, organized structure
- ✅ **Performance**: Efficient queries and indexing