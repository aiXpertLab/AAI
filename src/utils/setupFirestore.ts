import { createMasterSeedCollection } from '../firestore/seed';

/**
 * Setup script for Firestore
 * Run this once to initialize the master seed collection
 */
export async function setupFirestore() {
  try {
    console.log('🚀 Setting up Firestore master seed collection...');
    
    await createMasterSeedCollection();
    
    console.log('✅ Firestore setup completed successfully!');
    console.log('📝 Master seed collection created with demo data');
    console.log('🎯 New users will now get populated with demo data automatically');
    
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
    throw error;
  }
}

// Export for manual execution
export { setupFirestore as default };