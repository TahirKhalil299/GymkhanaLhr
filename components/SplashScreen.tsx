import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const router = useRouter();
  
  // Animated values - equivalent to Android's ObjectAnimator
  const logoTranslateY = useRef(new Animated.Value(-600)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations immediately when component mounts
    startAnimations();
  }, []);

  const startAnimations = (): void => {
    // Create logo animation set - equivalent to Android's AnimatorSet
    const logoAnimations = Animated.parallel([
      // Drop animation - equivalent to translationY
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1200,
        easing: Easing.elastic(1.2), // Similar to OvershootInterpolator
        useNativeDriver: true,
      }),
      // Fade in animation - equivalent to alpha
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      // Scale animation - equivalent to scaleX/scaleY
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]);

    // Start all logo animations together
    logoAnimations.start();

    // Navigate to login after delay - equivalent to Handler.postDelayed()
    setTimeout(() => {
      navigateToLogin();
    }, 3500);
  };

  const navigateToLogin = (): void => {
    // Navigate to login screen - equivalent to Android Intent
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        
        {/* Main container - equivalent to ConstraintLayout */}
        <View className="flex-1 justify-center items-center px-5 bg-gradient-to-b from-blue-400 to-purple-600">
          
          {/* Logo - equivalent to ImageView */}
          <Animated.View
            style={{
              transform: [
                { translateY: logoTranslateY },
                { scale: logoScale }
              ],
              opacity: logoOpacity,
            }}
            className="w-48 h-48"
          >
            <Image
              source={require('../../assets/images/logo.png')}
              className="w-full h-full"
              resizeMode="contain"
            />
          </Animated.View>
          
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SplashScreen;