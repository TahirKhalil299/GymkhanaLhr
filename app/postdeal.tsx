import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialIcons";

const PostDeal = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // State for form fields
  const [branchCode, setBranchCode] = useState('25');
  const [branchName, setBranchName] = useState('Faisal Town Lahore');
  const [branchCity, setBranchCity] = useState('Lahore');
  const [dealMode, setDealMode] = useState('Buy');
  const [currency, setCurrency] = useState('GBP');
  const [rate, setRate] = useState('367.20');
  const [amount, setAmount] = useState('45.00');
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Format date for display
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const handleBookDeal = () => {
    // Handle booking logic here
    console.log('Booking deal with data:', {
      branchCode,
      branchName,
      branchCity,
      dealMode,
      date: selectedDate,
      currency,
      rate,
      amount
    });
  };
  
  // Calculate converted amount
  const convertedAmount = (parseFloat(amount) * parseFloat(rate)).toFixed(2);

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 ">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
           <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Book a Deal</Text>
        <View className="w-10" />
      </View>
      
      {/* Progress Indicator */}
      
       <View className="px-5 py-5">
              {/* Progress indicator with circles and full connecting lines */}
              <View className="flex-row items-center mb-4">
                {/* First circle (filled) */}
                <View className="w-4 h-4 rounded-full bg-button_background" />
      
                {/* Full connecting line */}
                <View className="flex-1 h-1 bg-button_background mx-1" />
      
                {/* Second circle (outline) */}
                <View className="w-4 h-4 rounded-full bg-button_background" />
                {/* Full connecting line */}
                <View className="flex-1 h-1 bg-button_background mx-1" />
      
                {/* Third circle (outline) */}
                <View className="w-4 h-4 rounded-full bg-white border-2 border-button_background" />
      
           
      
                
              </View>
      
              {/* Text labels - unchanged */}
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-sm text-gray-600 mb-1">From</Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    45.00 USD
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600 mb-1">To</Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    12568.75 PKR
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600 mb-1">Rate</Text>
                  <Text className="text-sm font-semibold text-gray-800">279.75</Text>
                </View>
              </View>
            </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Branch Code */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Branch Code</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={branchCode}
            onChangeText={setBranchCode}
            placeholder="Enter branch code"
          />
        </View>

        {/* Branch Name */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Branch Name</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={branchName}
            onChangeText={setBranchName}
            placeholder="Enter branch name"
          />
        </View>

        {/* Branch City */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Branch City</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={branchCity}
            onChangeText={setBranchCity}
            placeholder="Enter branch city"
          />
        </View>

        {/* Deal Mode */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Deal Mode</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={dealMode}
            onChangeText={setDealMode}
            placeholder="Enter deal mode"
          />
        </View>

        {/* Deal Date */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Deal Date</Text>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 border border-gray-300 justify-center"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-base text-gray-800">{formatDate(selectedDate)}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={today}
              maximumDate={tomorrow}
            />
          )}
        </View>

        {/* Currency */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Currency</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={currency}
            onChangeText={setCurrency}
            placeholder="Enter currency"
          />
        </View>

        {/* Rate */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Rate</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={rate}
            onChangeText={setRate}
            placeholder="Enter rate"
            keyboardType="numeric"
          />
        </View>

        {/* Amount */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2 ml-1">Amount</Text>
          <TextInput
            className="bg-white rounded-lg p-4 text-base text-gray-800 border border-gray-300"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      {/* Book Deal Button */}
      <View className="px-4 pt-4 bg-white" style={{ paddingBottom: insets.bottom }}>
        <TouchableOpacity 
          className="bg-button_background rounded-lg py-2.5 items-center justify-center" 
          onPress={handleBookDeal}
        >
          <Text className="text-white text-lg font-semibold">Book a Deal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostDeal;