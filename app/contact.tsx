import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Contact = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePhoneCall = () => {
    Linking.openURL('tel:111-222-222');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:test@gmail.com');
  };

  const handleGetInTouch = () => {
    Alert.alert('Get in Touch', 'Contact form or action goes here!');
  };

  const handleSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-gray-100 border-b border-gray-200">
        <TouchableOpacity
          className="p-2"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Contact US</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Contact Info Section */}
        <View className="bg-white rounded-xl p-4 mt-4 shadow-md shadow-black/5">
          <Text className="text-xl font-bold text-black mb-2">Contact Info</Text>
          <Text className="text-sm text-gray-600 mb-5">We're just a call, email or a visit away!</Text>

          {/* Phone */}
          <TouchableOpacity 
            className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3" 
            onPress={handlePhoneCall}
          >
            <Icon name="phone" size={20} color="#666" className="mr-3" />
            <Text className="text-base text-gray-800 flex-1">111-222-222</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity 
            className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3" 
            onPress={handleEmail}
          >
            <Icon name="email" size={20} color="#666" className="mr-3" />
            <Text className="text-base text-gray-800 flex-1">test@gmail.com</Text>
          </TouchableOpacity>

          {/* Address */}
          <View className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3">
            <Icon name="location-on" size={20} color="#666" className="mr-3" />
            <Text className="text-base text-gray-800 flex-1">Dha phase 2,Lahore</Text>
          </View>

          {/* Get in Touch Button */}
          <TouchableOpacity 
            className="bg-button_background py-3 px-6 rounded-lg items-center mt-2" 
            onPress={handleGetInTouch}
          >
            <Text className="text-white text-sm font-semibold">Get in Touch</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <View className="bg-white rounded-xl p-4 mt-4 shadow-md shadow-black/5">
          <Text className="text-xl font-bold text-black mb-2">Our Social Media</Text>

          {/* Facebook */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3"
            onPress={() => handleSocialMedia('https://www.facebook.com/p/Soft-Consulta...')}
          >
            <Icon name="facebook" size={20} color="#666" className="mr-3" />
            <Text className="text-sm text-gray-800 flex-1">https://www.facebook.com/p/Soft-Consulta...</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3"
            onPress={() => handleSocialMedia('https://www.instagram.com/soft.consultants/')}
          >
            <Icon name="camera-alt" size={20} color="#666" className="mr-3" />
            <Text className="text-sm text-gray-800 flex-1">https://www.instagram.com/soft.consultants/</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 p-4 rounded-lg mb-3"
            onPress={() => handleSocialMedia('https://www.linkedin.com/company/soft-con...')}
          >
            <Icon name="business" size={20} color="#666" className="mr-3" />
            <Text className="text-sm text-gray-800 flex-1">https://www.linkedin.com/company/soft-con...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Contact;