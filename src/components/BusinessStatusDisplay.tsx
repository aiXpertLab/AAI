import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthBusiness } from './AuthBusinessProvider';
import { useFirebaseUserStore } from '../stores/FirebaseUserStore';
import { colors } from '../constants/colors';

/**
 * Simple component to display business status
 * Use this for testing the integration
 */
export function BusinessStatusDisplay() {
  const { businessId, businessData, isLoading, error, refreshBusiness } = useAuthBusiness();
  const user = useFirebaseUserStore((state) => state.FirebaseUser);

  if (!user) {
    return (
      <View className="p-4 bg-gray-50 rounded-lg m-4">
        <Text className="text-gray-800 font-semibold">👤 Not signed in</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="p-4 bg-blue-50 rounded-lg m-4">
        <Text className="text-blue-800 font-semibold">🔄 Loading business data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 bg-red-50 rounded-lg m-4">
        <Text className="text-red-800 font-semibold">❌ Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-green-50 rounded-lg m-4">
      <Text className="text-green-800 font-semibold text-lg mb-2">
        ✅ Business Status
      </Text>
      
      <View className="space-y-1">
        <Text className="text-sm">
          <Text className="font-medium">User:</Text> {user.email}
        </Text>
        
        <Text className="text-sm">
          <Text className="font-medium">Business ID:</Text> {businessId || 'Creating...'}
        </Text>
        
        {businessData && (
          <Text className="text-sm">
            <Text className="font-medium">Business Name:</Text> {businessData.business_name}
          </Text>
        )}
        
        <Text className="text-sm">
          <Text className="font-medium">Currency:</Text> {businessData?.currency || 'USD'}
        </Text>
      </View>

      <TouchableOpacity
        className="mt-3 bg-blue-500 rounded-lg py-2 px-4 self-start"
        onPress={refreshBusiness}
      >
        <Text className="text-white font-medium text-sm">🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}