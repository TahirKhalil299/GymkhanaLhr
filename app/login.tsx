import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Add your login logic here
    console.log('Login attempted with:', { userId, password });
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
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

             {/* Forgot Password */}
       <TouchableOpacity style={styles.forgotPasswordContainer}>
         <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
       </TouchableOpacity>
     </ScrollView>
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