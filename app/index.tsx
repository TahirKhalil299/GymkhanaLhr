import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_CREDENTIALS } from '../src/api/constants';
import { UserDataManager } from '../utils/userDataManager';

const { width } = Dimensions.get('window');

export default function AuthSplashScreen() {
  // Logo animations
  const logoTranslateYAnim = useRef(new Animated.Value(-600)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Button animations
  const createAccountTranslateXAnim = useRef(new Animated.Value(-1000)).current;
  const createAccountOpacityAnim = useRef(new Animated.Value(0)).current;
  const signInTranslateXAnim = useRef(new Animated.Value(1000)).current;
  const signInOpacityAnim = useRef(new Animated.Value(0)).current;

  const [logoSource, setLogoSource] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Set the appropriate logo based on currencyExchangeName
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

    setLogoSource(getLogoSource());

    // Logo animation
    const logoAnimations = Animated.parallel([
      Animated.spring(logoTranslateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20,
        friction: 6,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]);

    // Button animations
    const createAccountAnimations = Animated.parallel([
      Animated.spring(createAccountTranslateXAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20,
        friction: 6,
      }),
      Animated.timing(createAccountOpacityAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ]);

    const signInAnimations = Animated.parallel([
      Animated.spring(signInTranslateXAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20,
        friction: 6,
      }),
      Animated.timing(signInOpacityAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ]);

    // Sequence animations
    Animated.sequence([
      logoAnimations,
      Animated.parallel([createAccountAnimations, signInAnimations])
    ]).start();

    // Check if user is already logged in
    const checkAuthAndNavigate = async () => {
      try {
        const isLoggedIn = await UserDataManager.isLoggedIn();
        
        if (isLoggedIn) {
          router.replace('/home');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthAndNavigate();
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/images/back_background.jpg')}
      className="flex-1 w-full"
      style={{ paddingTop: insets.top }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center px-5">
        {logoSource && (
          <Animated.Image
            source={logoSource}
            className="w-[80%] h-[200px]"
            style={{
              transform: [
                { translateY: logoTranslateYAnim },
                { scale: logoScaleAnim },
              ],
              opacity: logoOpacityAnim,
            }}
            resizeMode="contain"
          />
        )}
      </View>

      <View className="w-full px-5" style={{ paddingBottom: insets.bottom + 20 }}>
        <Animated.View 
          className="w-full mb-2.5"
          style={{
            transform: [{ translateX: createAccountTranslateXAnim }],
            opacity: createAccountOpacityAnim
          }}
        >
          <TouchableOpacity 
            className="w-full h-12 bg-button_background rounded-lg justify-center items-center shadow"
            onPress={() => router.push('/login')}
          >
            <Text className="text-white text-base font-medium">
              Create an Account
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          className="w-full mb-2.5"
          style={{
            transform: [{ translateX: signInTranslateXAnim }],
            opacity: signInOpacityAnim
          }}
        >
<TouchableOpacity 
  className="w-full h-12 bg-white rounded-lg justify-center items-center border-2 border-button_background shadow"
  onPress={() => router.push('/login')}
>
  <Text className="text-button_background text-base font-medium">
    Sign In
  </Text>
</TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}