import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlertDialog from '../components/CustomAlertDialog';
import AuthService from '../src/api/AuthService';
import { ApiListener } from '../src/api/ServiceProvider';
import LoginResponse from '../src/api/models/LoginResponse';
import { UserDataManager } from '../utils/userDataManager';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    visible: false,
    title: '',
    message: ''
  });
  const router = useRouter();

  const showStatusDialog = (message: string) => {
    setAlertDialog({
      visible: true,
      title: 'Alert!',
      message: message
    });
  };

  const hideAlertDialog = () => {
    setAlertDialog({
      visible: false,
      title: '',
      message: ''
    });
  };

  const validateInputs = (): boolean => {
    if (!userId.trim()) {
      showStatusDialog('Please enter your user ID');
      return false;
    }
    if (!password.trim()) {
      showStatusDialog('Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('Login request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('Login successful:', data);
        try {
          // Parse the response data
          const responseData = JSON.parse(data);
          const loginResponse = new LoginResponse(responseData);
          
          // Check if StatusDesc is Success
          if (loginResponse.isSuccess()) {
            // Store user data if available
            const userData = loginResponse.getUserData();
            if (userData) {
              await UserDataManager.saveUserData(userData);
            }
            
            // Store tokens if they exist in the response
            await UserDataManager.saveTokens(
              responseData.token,
              responseData.refreshToken
            );
            
            // Navigate to home screen
            router.replace('/home');
          } else {
            // Show error dialog with StatusDesc
            showStatusDialog(loginResponse.getStatusMessage());
          }
        } catch (error) {
          console.error('Error processing login response:', error);
          showStatusDialog('An error occurred while processing the response. Please try again.');
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('Login failed:', message);
        showStatusDialog(message || 'Login failed. Please check your credentials and try again.');
      },
      onRequestEnded: () => {
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('Login error:', message);
        showStatusDialog(message || 'An error occurred during login. Please try again.');
        setIsLoading(false);
      }
    };

    try {
      const authService = new AuthService();
      await authService.login(userId.trim(), password, listener);
    } catch (error) {
      console.error('Login error:', error);
      showStatusDialog('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo_transparent.png')}
       style={[styles.logo, { width: 200, height: 100 }]}
          resizeMode="contain"
        />
       
      </View>

    {/* Welcome Text Section with NativeWind-like styling */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 24,fontWeight: 'bold' ,color: '##000' }}>Welcome back,</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>Log In</Text>
        </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        {/* User ID Input */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person" size={20} color="#000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter user ID"
            placeholderTextColor="#999"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed" size={20} color="#000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            disabled={isLoading}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#000" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

             {/* Forgot Password */}
       <TouchableOpacity style={styles.forgotPasswordContainer} disabled={isLoading}>
         <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
       </TouchableOpacity>
     </ScrollView>

     {/* Custom Alert Dialog */}
     <CustomAlertDialog
       visible={alertDialog.visible}
       title={alertDialog.title}
       message={alertDialog.message}
       okButtonText="OK"
       onOkClick={hideAlertDialog}
     />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 100,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  welcomeContainer: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  paddingVertical: 0,   // unnecessary height hatane ke liye
  paddingHorizontal: 0,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
  backgroundColor: '#e74c3c',
  borderRadius: 8,
  paddingVertical: 10, // reduced from 15
  paddingHorizontal: 20, // optional, for less width
  alignItems: 'center',
  marginBottom: 20,
},
loginButtonDisabled: {
  backgroundColor: '#bdc3c7',
},
loginButtonText: {
  color: '#ffffff',
  fontSize: 16,// reduced from 18
  fontWeight: 'bold',
},
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 12,
  },
}); 