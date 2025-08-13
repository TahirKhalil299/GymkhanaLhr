import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthService from '../src/api/AuthService';
import { ApiListener } from '../src/api/ServiceProvider';
import { UserDataManager } from '../utils/userDataManager';

// Define types for dropdown items
type DropdownItem = {
  id: string;
  name: string;
};

type OccupationItem = {
  CatID: string;
  CatDesc: string;
};

type CountryItem = {
  Country: string;
};

type ProvinceItem = {
  Province: string;
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
  const [titlesList, setTitlesList] = useState<DropdownItem[]>([
    { id: '1', name: 'MISS' },
    { id: '2', name: 'MR' },
    { id: '3', name: 'MRS' },
    { id: '4', name: 'MS' }
  ]);

  const [gendersList, setGendersList] = useState<DropdownItem[]>([
    { id: '1', name: 'Female' },
    { id: '2', name: 'Male' },
    { id: '3', name: 'Other' }
  ]);

  const [occupationsList, setOccupationsList] = useState<OccupationItem[]>([]);
  const [countriesList, setCountriesList] = useState<CountryItem[]>([]);
  const [provincesList, setProvincesList] = useState<ProvinceItem[]>([]);

  // Selected IDs
  const [titleId, setTitleId] = useState('');
  const [genderId, setGenderId] = useState('');
  const [occupationId, setOccupationId] = useState('');

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [selectedDateField, setSelectedDateField] = useState<'cnicExpiry' | 'dateOfBirth'>('cnicExpiry');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownType, setDropdownType] = useState<'title' | 'gender' | 'occupation' | 'country' | 'province'>('title');
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchOccupations();
    fetchCountries();
  }, []);

const fetchUserData = async () => {
  setIsLoading(true);
  
  try {
    // Get stored credentials using the correct method name
    const credentials = await UserDataManager.getSavedCredentials();
    
    // Check if credentials exist and are complete
    if (!credentials || !credentials.userId || !credentials.password) {
      Alert.alert('Error', 'User credentials not found. Please login again.');
      router.replace('/login');
      return;
    }

    console.log('Using saved credentials for user data fetch - userId:', credentials.userId);

    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log("User data request started");
      },
      onRequestSuccess: async (response, data, tag) => {
        try {
          const responseData = JSON.parse(data);
          console.log('User data response:', responseData);
          
          if (responseData.StatusCode === "00" && responseData.data) {
            const userData: UserData = responseData.data;
            updateFormData(userData);
            
            // Set CNIC image if available
            if (userData.Img_D && userData.Img_D.startsWith('data:image')) {
              setBase64Image(userData.Img_D.split(',')[1]);
            }
            
            console.log('User data updated successfully');
          } else {
            console.log('Invalid response or no data:', responseData);
            Alert.alert('Error', responseData.StatusDesc || 'No user data found');
          }
        } catch (error) {
          console.error('Error processing user data:', error);
          Alert.alert('Error', 'Failed to process user data');
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('User data request failed:', message);
        Alert.alert('Error', message || 'Failed to fetch user data');
      },
      onRequestEnded: () => {
        console.log('User data request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('User data request error:', message);
        Alert.alert('Error', message || 'Error fetching user data');
        setIsLoading(false);
      }
    };

    // Use the saved credentials for login/authentication
    const authService = new AuthService();
    await authService.login(credentials.userId, credentials.password, listener);
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    Alert.alert('Error', 'An unexpected error occurred while fetching user data');
    setIsLoading(false);
  }
};

  const updateFormData = (userData: UserData) => {
    // Parse date strings (assuming format like "7/10/2007 12:00:00 AM")
    const parseDate = (dateStr: string) => {
      if (!dateStr) return '';
      const datePart = dateStr.split(' ')[0]; // Get just the date part
      const [month, day, year] = datePart.split('/');
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

    // Set selected IDs
    setTitleId(userData.C_Title || '');
    setGenderId(userData.C_Gender || '');
    setOccupationId(userData.C_Occupation_Cat || '');
    
    // Fetch provinces if country is set
    if (userData.C_Country) {
      fetchProvinces(userData.C_Country);
    }
  };

  const fetchOccupations = () => {
    setIsLoading(true);
    // Mock API call - replace with actual API call if available
    setTimeout(() => {
      setOccupationsList([
        { CatID: '1', CatDesc: 'Business' },
        { CatID: '2', CatDesc: 'Employee' },
        { CatID: '3', CatDesc: 'Student' },
        { CatID: '4', CatDesc: 'Other' }
      ]);
      setIsLoading(false);
    }, 500);
  };

  const fetchCountries = () => {
    setIsLoading(true);
    // Mock API call - replace with actual API call if available
    setTimeout(() => {
      setCountriesList([
        { Country: 'Pakistan' },
        { Country: 'United States' },
        { Country: 'United Kingdom' },
        { Country: 'Canada' }
      ]);
      setIsLoading(false);
    }, 500);
  };

  const fetchProvinces = (country: string) => {
    setIsLoading(true);
    // Mock API call based on selected country
    setTimeout(() => {
      if (country === 'Pakistan') {
        setProvincesList([
          { Province: 'Punjab' },
          { Province: 'Sindh' },
          { Province: 'KPK' },
          { Province: 'Balochistan' }
        ]);
      } else {
        setProvincesList([]);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      // Submit logic here
      console.log('Form submitted:', formData);
      // Call your API to update profile
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  // Date picker handlers
  const showDatePickerDialog = (field: 'cnicExpiry' | 'dateOfBirth') => {
    setSelectedDateField(field);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      if (selectedDateField === 'cnicExpiry') {
        setFormData({ ...formData, cnicExpiry: formattedDate });
      } else {
        setFormData({ ...formData, dateOfBirth: formattedDate });
      }
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Dropdown handlers
  const showDropdownMenu = (type: 'title' | 'gender' | 'occupation' | 'country' | 'province') => {
    setDropdownType(type);
    
    switch (type) {
      case 'title':
        setDropdownItems(titlesList);
        break;
      case 'gender':
        setDropdownItems(gendersList);
        break;
      case 'occupation':
        setDropdownItems(occupationsList.map(item => ({ id: item.CatID, name: item.CatDesc })));
        break;
      case 'country':
        setDropdownItems(countriesList.map(item => ({ id: item.Country, name: item.Country })));
        break;
      case 'province':
        if (formData.countryOfStay) {
          setDropdownItems(provincesList.map(item => ({ id: item.Province, name: item.Province })));
        } else {
          alert('Please select a country first');
          return;
        }
        break;
    }
    
    setShowDropdown(true);
  };

  const handleDropdownSelect = (item: DropdownItem) => {
    setShowDropdown(false);
    
    switch (dropdownType) {
      case 'title':
        setFormData({ ...formData, title: item.name });
        setTitleId(item.id);
        break;
      case 'gender':
        setFormData({ ...formData, gender: item.name });
        setGenderId(item.id);
        break;
      case 'occupation':
        setFormData({ ...formData, occupation: item.name });
        setOccupationId(item.id);
        break;
      case 'country':
        setFormData({ 
          ...formData, 
          countryOfStay: item.name,
          province: '' // Reset province when country changes
        });
        fetchProvinces(item.name);
        break;
      case 'province':
        setFormData({ ...formData, province: item.name });
        break;
    }
  };

  // Image picker handlers
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      // Compress and resize the image
      const manipResult = await manipulateAsync(
        selected.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG, base64: true }
      );

      if (manipResult.base64) {
        setSelectedImage(manipResult.uri);
        setBase64Image(manipResult.base64);
      }
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image Source',
      '',
      [
        { text: 'Take Photo', onPress: () => takePhoto() },
        { text: 'Choose from Gallery', onPress: () => pickImage() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      // Compress and resize the image
      const manipResult = await manipulateAsync(
        selected.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG, base64: true }
      );

      if (manipResult.base64) {
        setSelectedImage(manipResult.uri);
        setBase64Image(manipResult.base64);
      }
    }
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
      alert('Please upload an image first');
    }
  };

  // Validation
  const validateAllFields = (): boolean => {
    let isValid = true;
    const errors: Partial<typeof formData> = {};

    // CNIC image validation
    if (!base64Image && !selectedImage) {
      alert('Please upload your CNIC image');
      isValid = false;
    }

    // Title validation
    if (!formData.title || !titleId) {
      errors.title = 'Please select a title';
      isValid = false;
    }

    // Name validations
    if (!formData.fullName || formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.fatherName || formData.fatherName.length < 2) {
      errors.fatherName = 'Father name must be at least 2 characters';
      isValid = false;
    }

    // Gender validation
    if (!formData.gender || !genderId) {
      errors.gender = 'Please select gender';
      isValid = false;
    }

    // CNIC validation
    if (!formData.cnicNo || formData.cnicNo.length < 13) {
      errors.cnicNo = 'CNIC must be 13 digits';
      isValid = false;
    }

    // CNIC Expiry validation
    if (!formData.cnicExpiry) {
      errors.cnicExpiry = 'CNIC expiry date is required';
      isValid = false;
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }

    // Occupation validation
    if (!formData.occupation || !occupationId) {
      errors.occupation = 'Please select occupation';
      isValid = false;
    }

    // Country validation
    if (!formData.countryOfStay) {
      errors.countryOfStay = 'Country is required';
      isValid = false;
    }

    // Province validation
    if (!formData.province) {
      errors.province = 'Province is required';
      isValid = false;
    }

    // City validation
    if (!formData.cityOfStay || formData.cityOfStay.length < 2) {
      errors.cityOfStay = 'City must be at least 2 characters';
      isValid = false;
    }

    // Address validation
    if (!formData.address || formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters';
      isValid = false;
    }

    if (!isValid) {
      alert('Please fill all required fields correctly');
    }

    return isValid;
  };

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 ">
        <TouchableOpacity onPress={handleBack} className="w-10 h-10 justify-center items-center">
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
        showsVerticalScrollIndicator={true}
      >
        {/* Form Fields */}
        <View className="px-5">
          {/* User ID */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">User ID</Text>
            <TextInput
              className="bg-white rounded border border-gray-300 p-2.5 text-xs text-black"
              value={formData.userId}
              onChangeText={(text) => setFormData({...formData, userId: text})}
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
              onChangeText={(text) => setFormData({...formData, email: text})}
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
              onPress={() => showDropdownMenu('title')}
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
              onChangeText={(text) => setFormData({...formData, fullName: text})}
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
              onChangeText={(text) => setFormData({...formData, fatherName: text})}
              placeholder="Enter father name"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Gender Dropdown */}
          <View className="mt-2.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Gender</Text>
            <TouchableOpacity 
              className="bg-white rounded border border-gray-300 p-2.5 flex-row justify-between items-center"
              onPress={() => showDropdownMenu('gender')}
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
              onChangeText={(text) => setFormData({...formData, cnicNo: text})}
              editable={false}
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
              onChangeText={(text) => setFormData({...formData, mobileNo: text})}
              editable={false}
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
              onPress={() => showDropdownMenu('occupation')}
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
              onChangeText={(text) => setFormData({...formData, occupationDetails: text})}
              multiline={true}
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
              onChangeText={(text) => setFormData({...formData, nationality: text})}
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
              onPress={() => showDropdownMenu('country')}
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
              onPress={() => showDropdownMenu('province')}
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
              onChangeText={(text) => setFormData({...formData, cityOfStay: text})}
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
              onChangeText={(text) => setFormData({...formData, address: text})}
              multiline={true}
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
            className="bg-button_background rounded-lg py-2.5 items-center justify-center mt-6 mb-6"
            onPress={handleSubmit}
          >
            <Text className="text-base font-medium text-white">
              Complete Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
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

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-1/2">
            {dropdownItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="py-4 border-b border-gray-100"
                onPress={() => handleDropdownSelect(item)}
              >
                <Text className="text-base text-gray-800">{item.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="py-4 mt-2 items-center bg-gray-100 rounded-lg"
              onPress={() => setShowDropdown(false)}
            >
              <Text className="text-base text-orange-600 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent={true}
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
          <ActivityIndicator size="large" color="#ec7124" />
        </View>
      )}
    </View>
  );
};

export default Profile;