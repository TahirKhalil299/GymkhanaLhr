import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AuthService from '../src/api/AuthService';
import { UserDataManager } from '../utils/userDataManager';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [userName, setUserName] = useState('User');
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const router = useRouter();
  const slideAnim = new Animated.Value(0);

  // Sample currency data - replace with your actual data
  const currencies = [
    {
      code: 'EUR',
      name: 'European E. Community',
      flag: require('../assets/images/usa__flag.png'), // Add this image
      buying: 335.00,
      selling: 337.85
    },
    {
      code: 'USD',
      name: 'United States Dollar',
      flag: require('../assets/images/usa__flag.png'), // Add this image
      buying: 278.50,
      selling: 280.25
    },
    {
      code: 'GBP',
      name: 'British Pound Sterling',
      flag: require('../assets/images/usa__flag.png'), // Add this image
      buying: 354.75,
      selling: 357.20
    }
  ];

  useEffect(() => {
    console.log('Home screen mounted');
    checkAuthStatus();

    // Start currency carousel
    const interval = setInterval(() => {
      setCurrentCurrencyIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % currencies.length;

        // Animate slide
        Animated.timing(slideAnim, {
          toValue: nextIndex * screenWidth,
          duration: 500,
          useNativeDriver: true,
        }).start();

        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const isLoggedIn = await UserDataManager.isLoggedIn();
      console.log('Is logged in:', isLoggedIn);

      const accessToken = await UserDataManager.getAccessToken();
      const userData = await UserDataManager.getUserData();
      console.log('Individual checks - accessToken exists:', !!accessToken, 'userData exists:', !!userData);

      if (!isLoggedIn) {
        console.log('Not logged in, redirecting to login');
        router.replace('/login');
        return;
      }

      console.log('User is logged in, getting user data...');
      console.log('User data:', userData);

      if (userData && userData.C_Name) {
        setUserName(userData.C_Name);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.replace('/login');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const authService = new AuthService();
              await authService.logout();
              await UserDataManager.clearAllData();
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              await UserDataManager.clearAllData();
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'document-text-outline',
      title: 'Deal\nDetails',
      image: require('../assets/images/deal-details.png')
    },
    {
      icon: 'cash-outline',
      title: 'Currency\nRates',
      image: require('../assets/images/currency-rates.png')
    },
    {
      icon: 'handshake-outline',
      title: 'Book a\nDeal',
      image: require('../assets/images/book-deal.png')
    },
    {
      icon: 'globe-outline',
      title: 'Network',
      image: require('../assets/images/network.png')
    },
    {
      icon: 'megaphone-outline',
      title: 'Announcemen...',
      image: require('../assets/images/announcement.png')
    },
    {
      icon: 'call-outline',
      title: 'Contact Us',
      image: require('../assets/images/contact-us.png')
    },
    {
      icon: 'person-outline',
      title: 'Profile',
      image: require('../assets/images/profile.png')
    },
    {
      icon: 'help-circle-outline',
      title: 'FAQs',
      image: require('../assets/images/faqs.png')
    },
    {
      icon: 'lock-closed-outline',
      title: 'Update\nPassword',
      image: require('../assets/images/update-password.png')
    },
    {
      icon: 'home-outline',
      title: 'Home\nDelivery',
      image: require('../assets/images/home-delivery.png')
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Currency Card */}
        <View style={styles.currencyContainer}>
          <View style={styles.currencyCard}>
            <View style={styles.currencyHeader}>
              <View style={styles.currencyInfo}>
                <Image
                  source={currencies[currentCurrencyIndex].flag}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
                <View style={styles.currencyTextContainer}>
                  <Text style={styles.currencyCode}>
                    {currencies[currentCurrencyIndex].code}
                  </Text>
                  <Text style={styles.currencyName}>
                    {currencies[currentCurrencyIndex].name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.ratesContainer}>
              <View style={styles.rateCard}>
                <View style={styles.buyingRate}>
                  <Text style={styles.rateLabel}>Buying</Text>
                  <Text style={styles.rateValue}>
                    {currencies[currentCurrencyIndex].buying.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.rateCard}>
                <View style={styles.sellingRate}>
                  <Text style={styles.rateLabel}>Selling</Text>
                  <Text style={styles.rateValue}>
                    {currencies[currentCurrencyIndex].selling.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Image
                  source={item.image}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/images/deal-details.png')}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/images/currency-rates.png')}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavBackground}>
            <Ionicons name="apps" size={24} color="#ff6b35" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/images/book-deal.png')}
            style={[styles.navIcon, { tintColor: '#000000' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/images/network.png')}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currencyContainer: {
    marginBottom: 30,
  },
  currencyCard: {
    backgroundColor: '#4a5568',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  currencyTextContainer: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    color: '#cbd5e0',
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  buyingRate: {
    backgroundColor: '#48bb78',
    borderRadius: 12,
    padding: 5,
    alignItems: 'center',
  },
  sellingRate: {
    backgroundColor: '#f56565',
    borderRadius: 12,
    padding: 5,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#ffffff',

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  menuItem: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconContainer: {
    marginBottom: 8,
  },
  menuIcon: {
    width: 27,
    height: 27,
  },
  menuText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  activeNavItem: {
    position: 'relative',
  },
  activeNavBackground: {
    backgroundColor: '#ffe5db',
    borderRadius: 20,
    padding: 12,
  },
});