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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  // Initialize data (similar to your Android onCreate/onViewCreated)
  useEffect(() => {
    // Mock API calls - replace with your actual API calls
    fetchOccupations();
    fetchCountries();
    // Load user data from preferences
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Mock user data - replace with your actual preference manager logic
    setFormData(prev => ({
      ...prev,
      userId: '12345',
      email: 'user@example.com',
      mobileNo: '03001234567',
      cnicNo: '1234567890123',
      nationality: 'Pakistan'
    }));
  };

  const fetchOccupations = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setOccupationsList([
        { CatID: '1', CatDesc: 'Business' },
        { CatID: '2', CatDesc: 'Employee' },
        { CatID: '3', CatDesc: 'Student' },
        { CatID: '4', CatDesc: 'Other' }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const fetchCountries = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setCountriesList([
        { Country: 'Pakistan' },
        { Country: 'United States' },
        { Country: 'United Kingdom' },
        { Country: 'Canada' }
      ]);
      setIsLoading(false);
    }, 1000);
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
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      // Submit logic here
      console.log('Form submitted:', formData);
      // Call your API to update profile
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
        // Update UI to show success state
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
        // Update UI to show success state
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

    // You can set these errors to state to display them in the UI
    // For simplicity, we're just using alerts here
    if (!isValid) {
      alert('Please fill all required fields correctly');
    }

    return isValid;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* User ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
              style={styles.input}
              value={formData.userId}
              onChangeText={(text) => setFormData({...formData, userId: text})}
              editable={false}
              placeholder="Enter user ID"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              editable={false}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Title Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDropdownMenu('title')}
            >
              <Text style={styles.inputText}>{formData.title || 'Select title'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              placeholder="Enter first name"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Father Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Father Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fatherName}
              onChangeText={(text) => setFormData({...formData, fatherName: text})}
              placeholder="Enter father name"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Gender Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDropdownMenu('gender')}
            >
              <Text style={styles.inputText}>{formData.gender || 'Select gender'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* CNIC */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CNIC</Text>
            <TextInput
              style={styles.input}
              value={formData.cnicNo}
              onChangeText={(text) => setFormData({...formData, cnicNo: text})}
              editable={false}
              keyboardType="numeric"
              placeholder="Enter CNIC"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* CNIC Expiry */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CNIC Expiry Date</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDatePickerDialog('cnicExpiry')}
            >
              <Text style={styles.inputText}>{formData.cnicExpiry || 'Select expiry date'}</Text>
            </TouchableOpacity>
          </View>

          {/* Mobile Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={formData.mobileNo}
              onChangeText={(text) => setFormData({...formData, mobileNo: text})}
              editable={false}
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDatePickerDialog('dateOfBirth')}
            >
              <Text style={styles.inputText}>{formData.dateOfBirth || 'Select date of birth'}</Text>
            </TouchableOpacity>
          </View>

          {/* Occupation Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occupation</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDropdownMenu('occupation')}
            >
              <Text style={styles.inputText}>{formData.occupation || 'Select occupation'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Occupation Details */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occupation Details</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={formData.occupationDetails}
              onChangeText={(text) => setFormData({...formData, occupationDetails: text})}
              multiline={true}
              placeholder="Enter occupation details"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Nationality */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nationality</Text>
            <TextInput
              style={styles.input}
              value={formData.nationality}
              onChangeText={(text) => setFormData({...formData, nationality: text})}
              editable={false}
              placeholder="Enter nationality"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Country Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDropdownMenu('country')}
            >
              <Text style={styles.inputText}>{formData.countryOfStay || 'Select country'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Province Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Province</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => showDropdownMenu('province')}
              disabled={!formData.countryOfStay}
            >
              <Text style={styles.inputText}>{formData.province || 'Select province'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.cityOfStay}
              onChangeText={(text) => setFormData({...formData, cityOfStay: text})}
              placeholder="Enter city"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
              multiline={true}
              placeholder="Enter address"
              placeholderTextColor="#b7b4b0"
            />
          </View>

          {/* CNIC Upload */}
          <View style={styles.uploadContainer}>
            <TouchableOpacity 
              style={styles.uploadContent}
              onPress={previewImageHandler}
            >
              {selectedImage || base64Image ? (
                <>
                  <MaterialIcons name="check-circle" size={24} color="green" />
                  <Text style={styles.uploadText}>CNIC Image Uploaded</Text>
                  <TouchableOpacity onPress={removeImage}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={24} color="black" />
                  <Text style={styles.uploadText}>Upload Your CNIC</Text>
                  <TouchableOpacity onPress={showImageOptions}>
                    <MaterialIcons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Complete Profile</Text>
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
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownContainer}>
            {dropdownItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => handleDropdownSelect(item)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.dropdownCancel}
              onPress={() => setShowDropdown(false)}
            >
              <Text style={styles.dropdownCancelText}>Cancel</Text>
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
        <View style={styles.imagePreviewOverlay}>
          <TouchableOpacity 
            style={styles.imagePreviewClose}
            onPress={() => setShowImagePreview(false)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image 
            source={{ uri: previewImage }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ec7124" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginRight: 35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 12,
    color: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 12,
    color: '#000',
  },
  uploadContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  uploadText: {
    fontSize: 10,
    fontFamily: 'Nunito-Medium',
    color: '#000',
    marginLeft: 5,
    padding: 5,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#ec7124',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: 'white',
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '50%',
  },
  dropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownCancel: {
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  dropdownCancelText: {
    fontSize: 16,
    color: '#ec7124',
    fontWeight: 'bold',
  },
  imagePreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  imagePreview: {
    width: '90%',
    height: '80%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;