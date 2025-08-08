import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Password</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Old Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Old password"
            placeholderTextColor="#999"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOldPassword}
          />
          <TouchableOpacity
            onPress={() => setShowOldPassword(!showOldPassword)}
            style={styles.eyeButton}
          >
            <Icon
              name={showOldPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="New password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            style={styles.eyeButton}
          >
            <Icon
              name={showNewPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm New Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm New Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <Icon
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Update Password Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingRight: 50,
    color: '#000',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdatePasswordScreen;