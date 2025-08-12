import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlertDialog from "../components/CustomAlertDialog";
import { AppColors } from "../constants/theme";
import AuthService from "../src/api/AuthService";
import { ApiListener } from "../src/api/ServiceProvider";
import { API_CREDENTIALS } from '../src/api/constants';
import LoginResponse from "../src/api/models/LoginResponse";
import { UserDataManager } from "../utils/userDataManager";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    visible: false,
    title: "",
    message: "",
  });

   const getLogoSource = () => {
      switch (API_CREDENTIALS.currencyExchangeName) {
        case API_CREDENTIALS.EXCHANGE_NAMES.BANK_OF_PUNJAB:
          return require('../assets/images/logo_bopex.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.ALLIED:
          return require('../assets/images/logo_allied_2.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.ASKARI:
          return require('../assets/images/logo_askari.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.AL_HABIB:
          return require('../assets/images/logo_al_habib.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.FAYSAL:
          return require('../assets/images/logo_faysal.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.HABIB_QATAR:
          return require('../assets/images/logo_habib_qatar.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.LINK:
          return require('../assets/images/logo_link.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.MCB:
          return require('../assets/images/logo_mcb.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.MEEZAN:
          return require('../assets/images/logo_meezan.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.SADIQ:
          return require('../assets/images/logo_sadiq.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.UNION:
          return require('../assets/images/logo_union.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.ZEEQUE:
          return require('../assets/images/logo_zeeque.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.RECL:
          return require('../assets/images/logo_recl.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.TECL:
          return require('../assets/images/logo_tecl.png');
        case API_CREDENTIALS.EXCHANGE_NAMES.DEMO:
          return require('../assets/images/logo_demo.png');
        default:
          return require('../assets/images/logo.png');
      }
    };

  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const showStatusDialog = (message: string) => {
    setAlertDialog({
      visible: true,
      title: "Alert!",
      message: message,
    });
  };

  const hideAlertDialog = () => {
    setAlertDialog({
      visible: false,
      title: "",
      message: "",
    });
  };

  const validateInputs = (): boolean => {
    if (!userId.trim()) {
      showStatusDialog("Please enter your user ID");
      return false;
    }
    if (!password.trim()) {
      showStatusDialog("Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log("Login request started");
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log("Login successful:");
        try {
          // Parse the response data
          const responseData = JSON.parse(data);
          console.log("Parsed response data:");

          const loginResponse = new LoginResponse(responseData);
          console.log(
            "Login response StatusDesc:",
            loginResponse.getStatusMessage()
          );
          console.log("Is success:", loginResponse.isSuccess());

          // Check if StatusDesc is Success
          if (loginResponse.isSuccess()) {
            console.log("Login successful, storing data...");

            // Store user data if available
            const userData = loginResponse.getUserData();
            if (userData) {
              console.log("Saving user data:");
              try {
                await UserDataManager.saveUserData(userData);
                console.log("User data saved successfully");
              } catch (saveError) {
                console.error("Error saving user data:", saveError);
              }
            }

            // Store tokens if they exist in the response
            console.log("Saving tokens...");
            try {
              await UserDataManager.saveTokens(
                responseData.token,
                responseData.refreshToken
              );
              console.log("Tokens saved successfully");
            } catch (tokenError) {
              console.error("Error saving tokens:", tokenError);
            }

            // Set login state to true
            console.log("Setting login state to true...");
            try {
              await UserDataManager.setLoginState(true);
              console.log("Login state saved successfully");
            } catch (loginStateError) {
              console.error("Error saving login state:", loginStateError);
            }

            console.log("Navigating to home screen...");
            try {
              // Navigate to home screen
              await router.replace("/home");
              console.log("Navigation completed successfully");
            } catch (navError) {
              console.error("Navigation error:", navError);
              showStatusDialog("Navigation failed. Please try again.");
            }
          } else {
            console.log("Login failed, showing error dialog");
            // Show error dialog with StatusDesc
            showStatusDialog(loginResponse.getStatusMessage());
          }
        } catch (error) {
          console.error("Error processing login response:", error);
          showStatusDialog(
            "An error occurred while processing the response. Please try again."
          );
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log("Login failed:", message);
        showStatusDialog(
          message ||
            "Login failed. Please check your credentials and try again."
        );
      },
      onRequestEnded: () => {
        console.log("Request ended, setting loading to false");
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log("Login error:", message);
        showStatusDialog(
          message || "An error occurred during login. Please try again."
        );
        setIsLoading(false);
      },
    };

    try {
      const authService = new AuthService();
      await authService.login(userId.trim(), password, listener);
    } catch (error) {
      console.error("Login error:", error);
      showStatusDialog("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 30,
          paddingTop: 40,
          paddingBottom: 100,
          minHeight: "100%",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
  {/* Logo Section */}
<View className="items-center mb-10">
  <Image
    source={getLogoSource()}
    className="mb-2.5"
    style={{ width: 200, height: 100 }}
    resizeMode="contain"
  />
</View>

        {/* Welcome Text Section */}
        <View className="mb-10">
          <Text className="text-2xl font-bold text-black">Welcome back,</Text>
          <Text className="text-2xl font-bold text-black">Log In</Text>
        </View>

        {/* Input Fields */}
        {/* Input Fields */}
        <View className="mb-7.5">
          {/* User ID Input */}
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-50">
            <Ionicons name="person" size={20} color="#000" className="mr-2.5" />
            <TextInput
              className="flex-1 text-base text-black py-1.5"
              selectionColor={AppColors.cursor_color}
              placeholder="Enter user ID"
              placeholderTextColor="#999"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-50">
            <Ionicons
              name="lock-closed"
              size={20}
              color="#000"
              className="mr-2.5"
            />
            <TextInput
              className="flex-1 text-base text-black py-1.5"
              selectionColor={AppColors.cursor_color}
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
              className="p-1.5"
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
  className={`${isLoading ? 'bg-button_text' : 'bg-button_background'} rounded-lg py-2.5 px-5 items-center mb-5`}
  onPress={handleLogin}
  disabled={isLoading}
>
  {isLoading ? (
    <ActivityIndicator color={AppColors.button_text} size="small" />
  ) : (
    <Text className="text-button_text text-base font-bold">Log In</Text>
  )}
</TouchableOpacity>


        {/* Forgot Password */}
        <TouchableOpacity className="items-end" disabled={isLoading}>
          <Text className="text-gray-600 text-xs">Forgot Password?</Text>
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
