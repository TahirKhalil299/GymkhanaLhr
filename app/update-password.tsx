import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppColors } from "../constants/theme";

const UpdatePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUpdatePassword = () => {
    // Add your password update logic here
    console.log('Update password pressed');
    // You can add validation and API call here
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-gray-50">
        <TouchableOpacity onPress={handleBackPress} className="w-10 h-10 justify-center items-center">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black">Update Password</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-6">
        {/* Old Password Input */}
        <View className="mb-4 relative">
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 text-base bg-white pr-12 text-black"
            placeholder="Old password"
            selectionColor={AppColors.cursor_color}
            placeholderTextColor="#999"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOldPassword}
          />
          <TouchableOpacity
            onPress={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-3 p-1 w-8 h-8 justify-center items-center"
          >
            <Icon
              name={showOldPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Input */}
        <View className="mb-4 relative">
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 text-base bg-white pr-12 text-black"
            placeholder="New password"
            selectionColor={AppColors.cursor_color}
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-3 p-1 w-8 h-8 justify-center items-center"
          >
            <Icon
              name={showNewPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm New Password Input */}
        <View className="mb-4 relative">
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 text-base bg-white pr-12 text-black"
            placeholder="Confirm New Password"
            selectionColor={AppColors.cursor_color}
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 p-1 w-8 h-8 justify-center items-center"
          >
            <Icon
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Update Password Button */}
        <TouchableOpacity 
          className="bg-button_background rounded-xl py-2.5 items-center mt-6" 
          onPress={handleUpdatePassword}
        >
          <Text className="text-white text-base font-semibold">Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdatePasswordScreen;