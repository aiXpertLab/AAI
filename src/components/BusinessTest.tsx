import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFirebaseUserStore } from '../stores/FirebaseUserStore';
import { getUserBusinessEntity } from '../firestore/business/getBusiness';

/**
 * Simple test component to verify business creation
 * Add this to any screen to test
 */
export function BusinessTest() {
  const user = useFirebaseUserStore((state) => state.FirebaseUser);
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkBusiness = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await getUserBusinessEntity(user.uid);
      setBusinessData(result);
      console.log('Business check result:', result);
    } catch (error) {
      console.error('Error checking business:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkBusiness();
    }
  }, [user]);

  if (!user) {
    return (
      <View className="p-4 bg-gray-100 rounded-lg m-4">
        <Text className="text-gray-600">👤 Not signed in</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-blue-50 rounded-lg m-4">
      <Text className="text-blue-800 font-semibold mb-2">🧪 Business Test</Text>
      
      <Text className="text-sm mb-2">
        <Text className="font-medium">User:</Text> {user.email}
      </Text>
      
      {loading ? (
        <Text className="text-blue-600">🔄 Checking business...</Text>
      ) : businessData ? (
        <View>
          <Text className="text-green-600 font-medium">✅ Business Found!</Text>
          <Text className="text-sm">
            <Text className="font-medium">Business ID:</Text> {businessData.businessId}
          </Text>
          <Text className="text-sm">
            <Text className="font-medium">Business Name:</Text> {businessData.businessData.business_name}
          </Text>
        </View>
      ) : (
        <Text className="text-orange-600">⚠️ No business found for this user</Text>
      )}
      
      <TouchableOpacity
        className="mt-3 bg-blue-500 rounded-lg py-2 px-4 self-start"
        onPress={checkBusiness}
      >
        <Text className="text-white font-medium text-sm">🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}