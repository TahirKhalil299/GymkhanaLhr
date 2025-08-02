import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AuthSplashScreen() {
  const translateYAnim = useRef(new Animated.Value(-600)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleXAnim = useRef(new Animated.Value(0.8)).current;
  const scaleYAnim = useRef(new Animated.Value(0.8)).current;
  
  // Text animations
  const textTranslateYAnim = useRef(new Animated.Value(-400)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const textScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Logo and text animations together with slower speed
    const allAnimations = Animated.parallel([
      // Logo animations
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20, // Lower tension for slower animation
        friction: 6, // Higher friction for more controlled bounce
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1800, // Slower fade in
        useNativeDriver: true,
      }),
      Animated.timing(scaleXAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleYAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      // Text animations
      Animated.spring(textTranslateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20, // Same as logo for synchronized movement
        friction: 6,
      }),
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.timing(textScaleAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]);

    // Start all animations together
    allAnimations.start();

    // Navigate after animations complete
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 4000); // Reduced since animations run together

    return () => clearTimeout(timer);
  }, [translateYAnim, opacityAnim, scaleXAnim, scaleYAnim, textTranslateYAnim, textOpacityAnim, textScaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          source={require('../assets/images/logo.png')}
          style={[
            styles.logo,
            {
              transform: [
                { translateY: translateYAnim },
                { scaleX: scaleXAnim },
                { scaleY: scaleYAnim },
              ],
              opacity: opacityAnim,
            },
          ]}
          resizeMode="contain"
        />

        <Animated.Text style={[
          styles.title,
          {
            transform: [
              { translateY: textTranslateYAnim },
              { scale: textScaleAnim },
            ],
            opacity: textOpacityAnim,
          },
        ]}>
          GymKhanaLhr
        </Animated.Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
        </View>
      </View>

      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b8b8b8',
    textAlign: 'center',
    marginBottom: 50,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginHorizontal: 4,
    opacity: 0.7,
  },
  footer: {
    paddingBottom: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});