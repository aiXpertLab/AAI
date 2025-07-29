import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthBusiness } from './AuthBusinessProvider';
import { getPaymentMethods } from '../firestore/collections/paymentMethods';
import { colors } from '../constants/colors';

/**
 * Example component showing how to use the business entity
 * This replaces your existing components that need business data
 */
export function BusinessAwareComponent() {
  const { businessId, businessData, isLoading, error } = useAuthBusiness();
  const [paymentMethods, setPaymentMethods] = React.useState([]);

  // Load payment methods for the current business
  React.useEffect(() => {
    if (businessId) {
      loadPaymentMethods();
    }
  }, [businessId]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods(businessId!);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading business data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  if (!businessId) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No business entity found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Business Info */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-xl font-bold mb-2">{businessData?.business_name}</Text>
        <Text className="text-gray-600">Business ID: {businessId}</Text>
        <Text className="text-gray-600">Currency: {businessData?.currency}</Text>
      </View>

      {/* Payment Methods */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">Payment Methods</Text>
        {paymentMethods.map((method: any) => (
          <View key={method.id} className="border-b border-gray-100 py-2">
            <Text className="font-medium">{method.pm_name}</Text>
            <Text className="text-gray-600 text-sm">{method.pm_note}</Text>
            {method.is_demo && (
              <Text className="text-blue-500 text-xs">Demo Data</Text>
            )}
          </View>
        ))}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity
        className="mt-4 bg-blue-500 rounded-lg py-3 items-center"
        onPress={loadPaymentMethods}
      >
        <Text className="text-white font-semibold">Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );
}