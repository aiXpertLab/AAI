import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthBusiness } from './AuthBusinessProvider';
import { colors } from '../constants/colors';

export function OnboardingScreen() {
  const { createNewBusiness, isLoading } = useAuthBusiness();
  const [businessName, setBusinessName] = useState('');

  const handleCreateBusiness = async () => {
    if (!businessName.trim()) {
      Alert.alert('Business Name Required', 'Please enter a name for your business.');
      return;
    }

    try {
      await createNewBusiness(businessName.trim());
      Alert.alert('Success!', 'Your business has been created with demo data to help you get started.');
    } catch (error) {
      Alert.alert('Error', 'Failed to create business. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      await createNewBusiness('My Business');
      Alert.alert('Welcome!', 'Your business has been created with demo data.');
    } catch (error) {
      Alert.alert('Error', 'Failed to create business. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        {/* Welcome Header */}
        <View className="items-center mb-10">
          <Text className="text-2xl font-bold text-black mb-4">Welcome to AI Auto Invoicing!</Text>
          <Text className="text-center text-gray-600 text-base">
            Let's set up your business to get you started with smart invoicing.
          </Text>
        </View>

        {/* Business Name Input */}
        <View className="mb-8">
          <Text className="text-gray-700 font-semibold mb-2">Business Name</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 text-base border border-gray-200"
            placeholder="Enter your business name"
            placeholderTextColor="#B0B0B0"
            value={businessName}
            onChangeText={setBusinessName}
            autoCapitalize="words"
          />
        </View>

        {/* Info Text */}
        <View className="mb-8 p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 text-sm">
            💡 We'll create your business with demo data including sample invoices, clients, and payment methods to help you get started quickly.
          </Text>
        </View>

        {/* Create Business Button */}
        <TouchableOpacity
          className="mb-4 rounded-lg py-4 items-center"
          style={{ backgroundColor: colors.main }}
          onPress={handleCreateBusiness}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? 'Creating...' : 'Create My Business'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          className="py-4 items-center"
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text className="text-gray-500 text-base">
            {isLoading ? 'Please wait...' : 'Skip for now'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}