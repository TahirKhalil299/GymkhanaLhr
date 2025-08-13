import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ApiService from '../src/api/ApiService';
import AuthService from '../src/api/AuthService';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';
import { Country } from '../src/api/models/CountryNameResponse';
import { OccupationCategory } from '../src/api/models/OccupationResponse';
import { Province } from '../src/api/models/ProvinceNameReaponse';
import { UserDataManager } from '../utils/userDataManager';

type DropdownItem = {
  id: string;
  name: string;
};

type UserData = {
  C_User_ID: string;
  C_Email: string;
  C_Title: string;
  C_Name: string;
  C_FName: string;
  C_Add1: string;
  C_City: string;
  C_Province: string;
  C_Country: string;
  C_Tel_Mobile: string;
  C_Gender: string;
  C_Nationality: string;
  C_Occupation_Cat: string;
  C_Occupation: string;
  C_DOB: string;
  C_ITypeRef: string;
  C_IType_Expiry: string;
  Img_D: string;
};

const Profile = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    title: '',
    fullName: '',
    fatherName: '',
    gender: '',
    cnicNo: '',
    cnicExpiry: '',
    mobileNo: '',
    dateOfBirth: '',
    occupation: '',
    occupationDetails: '',
    nationality: 'Pakistan',
    countryOfStay: '',
    province: '',
    cityOfStay: '',
    address: ''
  });

  // Dropdown data
  const [titlesList] = useState<DropdownItem[]>([
    { id: '1', name: 'MISS' },
    { id: '2', name: 'MR' },
    { id: '3', name: 'MRS' },
    { id: '4', name: 'MS' }
  ]);

  const [gendersList] = useState<DropdownItem[]>([
    { id: '1', name: 'Female' },
    { id: '2', name: 'Male' },
    { id: '3', name: 'Other' }
  ]);

  const [occupationsList, setOccupationsList] = useState<OccupationCategory[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [provincesList, setProvincesList] = useState<Province[]>([]);

  // Selected IDs
  const [titleId, setTitleId] = useState('');
  const [genderId, setGenderId] = useState('');
  const [occupationId, setOccupationId] = useState('');

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode] = useState<'date' | 'time'>('date');
  const [selectedDateField, setSelectedDateField] = useState<'cnicExpiry' | 'dateOfBirth'>('cnicExpiry');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<'title' | 'gender' | 'occupation' | 'country' | 'province'>('title');
  const [bottomSheetItems, setBottomSheetItems] = useState<DropdownItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
    fetchOccupations();
    fetchCountries();
  }, []);

  // Fetch provinces when country changes
  useEffect(() => {
    if (formData.countryOfStay) {
      fetchProvinces(formData.countryOfStay);
    } else {
      setProvincesList([]);
      setFormData(prev => ({ ...prev, province: '' }));
    }
  }, [formData.countryOfStay]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = bottomSheetItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(bottomSheetItems);
    }
  }, [searchQuery, bottomSheetItems]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const credentials = await UserDataManager.getSavedCredentials();
      if (!credentials?.userId || !credentials.password) {
        Alert.alert('Error', 'User credentials not found. Please login again.');
        router.replace('/login');
        return;
      }

      const listener: ApiListener = {
        onRequestSuccess: async (response, data) => {
          try {
            const responseData = JSON.parse(data);
            if (responseData.StatusCode === "00" && responseData.data) {
              updateFormData(responseData.data);
              if (responseData.data.Img_D?.startsWith('data:image')) {
                setBase64Image(responseData.data.Img_D.split(',')[1]);
              }
            }
          } catch (error) {
            console.error('Error processing user data:', error);
          }
          setIsLoading(false);
        },
        onRequestFailure: () => setIsLoading(false),
      };

      await new AuthService().login(credentials.userId, credentials.password, listener);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const fetchOccupations = () => {
    setIsLoading(true);
    const listener: ApiListener = {
      onRequestSuccess: async (response, data) => {
        try {
          const responseData = JSON.parse(data);
          if (responseData.data?.OccupationCategory) {
            setOccupationsList(responseData.data.OccupationCategory);
          }
        } catch (error) {
          console.error('Error processing occupations:', error);
        }
        setIsLoading(false);
      },
      onRequestFailure: () => setIsLoading(false),
    };

    try {
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getOccupation(),
        RequestType.GET_OCCUPATION_LIST,
        listener
      );
    } catch (error) {
      console.error('Occupations error:', error);
      setIsLoading(false);
    }
  };

  const fetchCountries = () => {
    setIsLoading(true);
    const listener: ApiListener = {
      onRequestSuccess: async (response, data) => {
        try {
          const responseData = JSON.parse(data);
          if (responseData.data?.Country) {
            setCountriesList(responseData.data.Country);
          }
        } catch (error) {
          console.error('Error processing countries:', error);
        }
        setIsLoading(false);
      },
      onRequestFailure: () => setIsLoading(false),
    };

    try {
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getCountryNames(),
        RequestType.GET_COUNTRY_LIST,
        listener
      );
    } catch (error) {
      console.error('Countries error:', error);
      setIsLoading(false);
    }
  };

  const fetchProvinces = (countryName: string) => {
    setIsLoading(true);
    const listener: ApiListener = {
      onRequestSuccess: async (response, data) => {
        try {
          const responseData = JSON.parse(data);
          if (responseData.data?.Province) {
            setProvincesList(responseData.data.Province);
          }
        } catch (error) {
          console.error('Error processing provinces:', error);
        }
        setIsLoading(false);
      },
      onRequestFailure: () => setIsLoading(false),
    };

    try {
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getProvience(countryName),
        RequestType.GET_PROVINCE_LIST,
        listener
      );
    } catch (error) {
      console.error('Provinces error:', error);
      setIsLoading(false);
    }
  };

  const updateFormData = (userData: UserData) => {
    const parseDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [month, day, year] = dateStr.split(' ')[0].split('/');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    };

    setFormData({
      userId: userData.C_User_ID || '',
      email: userData.C_Email || '',
      title: userData.C_Title || '',
      fullName: userData.C_Name || '',
      fatherName: userData.C_FName || '',
      gender: userData.C_Gender === '1' ? 'Female' : userData.C_Gender === '2' ? 'Male' : 'Other',
      cnicNo: userData.C_ITypeRef || '',
      cnicExpiry: parseDate(userData.C_IType_Expiry) || '',
      mobileNo: userData.C_Tel_Mobile || '',
      dateOfBirth: parseDate(userData.C_DOB) || '',
      occupation: userData.C_Occupation || '',
      occupationDetails: '',
      nationality: userData.C_Nationality || 'Pakistan',
      countryOfStay: userData.C_Country || '',
      province: userData.C_Province || '',
      cityOfStay: userData.C_City || '',
      address: userData.C_Add1 || ''
    });

    setTitleId(userData.C_Title || '');
    setGenderId(userData.C_Gender || '');
    setOccupationId(userData.C_Occupation_Cat || '');
  };

  const showBottomSheetMenu = (type: typeof bottomSheetType) => {
    Keyboard.dismiss();
    setBottomSheetType(type);
    setSearchQuery('');
    
    let items: DropdownItem[] = [];
    switch (type) {
      case 'title':
        items = titlesList;
        break;
      case 'gender':
        items = gendersList;
        break;
      case 'occupation':
        items = occupationsList.map(item => ({ id: item.Cat_ID, name: item.Cat_Desc }));
        break;
      case 'country':
        items = countriesList.map(item => ({ id: item.Country_Code, name: item.Country }));
        break;
      case 'province':
        if (!formData.countryOfStay) {
          Alert.alert('Please select a country first');
          return;
        }
        items = provincesList.map(item => ({ id: item.Province_Code, name: item.Province }));
        break;
    }

    setBottomSheetItems(items);
    setFilteredItems(items);
    setShowBottomSheet(true);
  };

  const handleBottomSheetSelect = (item: DropdownItem) => {
    setShowBottomSheet(false);
    
    switch (bottomSheetType) {
      case 'title':
        setFormData(prev => ({ ...prev, title: item.name }));
        setTitleId(item.id);
        break;
      case 'gender':
        setFormData(prev => ({ ...prev, gender: item.name }));
        setGenderId(item.id);
        break;
      case 'occupation':
        setFormData(prev => ({ ...prev, occupation: item.name }));
        setOccupationId(item.id);
        break;
      case 'country':
        setFormData(prev => ({ 
          ...prev, 
          countryOfStay: item.name,
          province: ''
        }));
        break;
      case 'province':
        setFormData(prev => ({ ...prev, province: item.name }));
        break;
    }
  };

  // Image handling functions
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera access to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

 const processImage = async (uri: string) => {
  try {
    // First compress the image
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    
    // Store the URI for upload (don't convert to base64 unless needed)
    setSelectedImage(manipResult.uri);
    
    // If you need a preview, you can keep the base64 version
    const base64Result = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setBase64Image(base64Result);
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Error', 'Failed to process image');
  }
};

  const showImageOptions = () => {
    Alert.alert(
      'Select Image Source',
      '',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
    setBase64Image('');
  };

  const previewImageHandler = () => {
    if (base64Image || selectedImage) {
      setPreviewImage(selectedImage || `data:image/jpeg;base64,${base64Image}`);
      setShowImagePreview(true);
    } else {
      Alert.alert('No image', 'Please upload an image first');
    }
  };

  // Date handling
  const showDatePickerDialog = (field: typeof selectedDateField) => {
    setSelectedDateField(field);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      setFormData(prev => ({
        ...prev,
        [selectedDateField]: formattedDate
      }));
    }
  };

  // Form submission
  const handleSubmit = () => {
    if (validateAllFields()) {
      // Submit logic here
      console.log('Form submitted:', formData);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const validateAllFields = (): boolean => {
    const requiredFields = [
      { field: 'title', message: 'Please select a title' },
      { field: 'fullName', message: 'Full name is required', minLength: 2 },
      { field: 'fatherName', message: 'Father name is required', minLength: 2 },
      { field: 'gender', message: 'Please select gender' },
      { field: 'cnicNo', message: 'CNIC is required', exactLength: 13 },
      { field: 'cnicExpiry', message: 'CNIC expiry date is required' },
      { field: 'dateOfBirth', message: 'Date of birth is required' },
      { field: 'occupation', message: 'Please select occupation' },
      { field: 'countryOfStay', message: 'Country is required' },
      { field: 'province', message: 'Province is required' },
      { field: 'cityOfStay', message: 'City is required', minLength: 2 },
      { field: 'address', message: 'Address is required', minLength: 5 }
    ];

    for (const { field, message, minLength, exactLength } of requiredFields) {
      const value = formData[field as keyof typeof formData];
      
      if (!value) {
        Alert.alert('Validation Error', message);
        return false;
      }

      if (minLength && value.length < minLength) {
        Alert.alert('Validation Error', `${message} (minimum ${minLength} characters)`);
        return false;
      }

      if (exactLength && value.length !== exactLength) {
        Alert.alert('Validation Error', `${message} (must be ${exactLength} characters)`);
        return false;
      }
    }

    if (!base64Image && !selectedImage) {
      Alert.alert('Validation Error', 'Please upload your CNIC image');
      return false;
    }

     if (!base64Image && !selectedImage) {
    Alert.alert('Validation Error', 'Please upload your CNIC image');
    return false;
  }

    return true;
  };

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-center">
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-semibold text-gray-800 mr-8">
          Profile
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          {/* User ID */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">User ID</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.userId}
              editable={false}
              placeholder="Enter user ID"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Email */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Email</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.email}
              editable={false}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Title Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Title</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showBottomSheetMenu('title')}
            >
              <Text className="text-xs text-black">{formData.title || 'Select title'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">First Name</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
              placeholder="Enter first name"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Father Name */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Father Name</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.fatherName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fatherName: text }))}
              placeholder="Enter father name"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Gender Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Gender</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showBottomSheetMenu('gender')}
            >
              <Text className="text-xs text-black">{formData.gender || 'Select gender'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* CNIC */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">CNIC</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.cnicNo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cnicNo: text }))}
              keyboardType="numeric"
              placeholder="Enter CNIC"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* CNIC Expiry */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">CNIC Expiry Date</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5"
              onPress={() => showDatePickerDialog('cnicExpiry')}
            >
              <Text className="text-xs text-black">{formData.cnicExpiry || 'Select expiry date'}</Text>
            </TouchableOpacity>
          </View>

          {/* Mobile Number */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Mobile Number</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.mobileNo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, mobileNo: text }))}
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Date of Birth */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Date of Birth</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5"
              onPress={() => showDatePickerDialog('dateOfBirth')}
            >
              <Text className="text-xs text-black">{formData.dateOfBirth || 'Select date of birth'}</Text>
            </TouchableOpacity>
          </View>

          {/* Occupation Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Occupation</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showBottomSheetMenu('occupation')}
            >
              <Text className="text-xs text-black">{formData.occupation || 'Select occupation'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Occupation Details */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Occupation Details</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black h-20"
              value={formData.occupationDetails}
              onChangeText={(text) => setFormData(prev => ({ ...prev, occupationDetails: text }))}
              multiline
              placeholder="Enter occupation details"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Nationality */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Nationality</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.nationality}
              editable={false}
              placeholder="Enter nationality"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Country Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Country</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showBottomSheetMenu('country')}
            >
              <Text className="text-xs text-black">{formData.countryOfStay || 'Select country'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Province Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Province</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showBottomSheetMenu('province')}
              disabled={!formData.countryOfStay}
            >
              <Text className="text-xs text-black">{formData.province || 'Select province'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* City */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">City</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.cityOfStay}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cityOfStay: text }))}
              placeholder="Enter city"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Address */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Address</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black h-20"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              multiline
              placeholder="Enter address"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* CNIC Upload */}
          <View className="bg-white rounded-lg p-2 mt-4 shadow-md">
            <TouchableOpacity 
              className="flex-row items-center p-1.5"
              onPress={previewImageHandler}
            >
              {selectedImage || base64Image ? (
                <>
                  <MaterialIcons name="check-circle" size={24} color="green" />
                  <Text className="text-xs font-medium text-black ml-1.5 p-1.5 flex-1">
                    CNIC Image Uploaded
                  </Text>
                  <TouchableOpacity onPress={removeImage}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={24} color="black" />
                  <Text className="text-xs font-medium text-black ml-1.5 p-1.5 flex-1">
                    Upload Your CNIC
                  </Text>
                  <TouchableOpacity onPress={showImageOptions}>
                    <MaterialIcons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            className="bg-blue-500 rounded-lg py-3 items-center justify-center mt-6 mb-6"
            onPress={handleSubmit}
          >
            <Text className="text-base font-medium text-white">
              Complete Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode={datePickerMode}
          display="default"
          onChange={handleDateChange}
          minimumDate={selectedDateField === 'dateOfBirth' ? new Date(1900, 0, 1) : new Date()}
          maximumDate={selectedDateField === 'dateOfBirth' ? new Date(new Date().setFullYear(new Date().getFullYear() - 18)) : undefined}
        />
      )}

      {/* Bottom Sheet */}
      <Modal
        visible={showBottomSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-[70%]">
            {/* Search Bar */}
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
              <MaterialIcons name="search" size={20} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-base text-black"
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={20} color="gray" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Items List */}
            <ScrollView className="max-h-[60%]">
              {filteredItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="py-4 border-b border-gray-100"
                  onPress={() => handleBottomSheetSelect(item)}
                >
                  <Text className="text-base text-gray-800">{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Cancel Button */}
            <TouchableOpacity
              className="py-3 mt-10 items-center bg-button_background rounded-lg"
              onPress={() => setShowBottomSheet(false)}
            >
              <Text className="text-base text-white font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity 
            className="absolute top-10 right-5 z-10"
            onPress={() => setShowImagePreview(false)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image 
            source={{ uri: previewImage }}
            className="w-[90%] h-[80%]"
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Loading Indicator */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </View>
  );
};

export default Profile;