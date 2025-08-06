import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ApiService from '../src/api/ApiService';
import { Rates } from '../src/api/models/CurrencyRatesResponse';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';
import { UserDataManager } from '../utils/userDataManager';

const { width: screenWidth } = Dimensions.get('window');

// Number formatting function (equivalent to Kotlin function)
const formatNumber = (value: string): string => {
  try {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return value;
    }

    // Convert to string and remove trailing zeros
    const stripped = number.toString();
    const parts = stripped.split('.');

    if (parts.length === 1) {
      // No decimal part, append .00
      return parts[0] + '.00';
    }

    const integerPart = parts[0];
    let decimalPart = parts[1];

    // Limit to 6 digits max after decimal
    if (decimalPart.length > 6) {
      decimalPart = decimalPart.substring(0, 6);
    }

    // Ensure at least 2 digits after decimal
    if (decimalPart.length < 2) {
      decimalPart = decimalPart.padEnd(2, '0');
    }

    return `${integerPart}.${decimalPart}`;
  } catch (error) {
    return value;
  }
};

export default function HomeScreen() {
  const [userName, setUserName] = useState('User');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currencies, setCurrencies] = useState<Rates[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log('Home screen mounted');
    checkAuthStatus();
    fetchCurrencyRates();
  }, []);

  const fetchCurrencyRates = () => {
    setIsLoading(true);

    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('Currency rates request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('Currency rates successful:', data);
        try {
          const responseData = JSON.parse(data);
          console.log('Parsed currency rates data:', responseData);

          // Check if the response has the correct structure
          if (responseData.data && responseData.data.Rates && Array.isArray(responseData.data.Rates)) {
            // Take only first 4 items as requested
            const firstFourRates = responseData.data.Rates.slice(0, 4);
            setCurrencies(firstFourRates);
            console.log('Currency rates set:', firstFourRates);
          } else if (responseData.Rates && Array.isArray(responseData.Rates)) {
            // Fallback for direct Rates array
            const firstFourRates = responseData.Rates.slice(0, 4);
            setCurrencies(firstFourRates);
            console.log('Currency rates set (fallback):', firstFourRates);
          } else {
            console.log('No rates data found in response');
            setCurrencies([]);
          }
        } catch (error) {
          console.error('Error processing currency rates response:', error);
          setCurrencies([]);
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('Currency rates failed:', message);
        setCurrencies([]);
      },
      onRequestEnded: () => {
        console.log('Currency rates request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('Currency rates error:', message);
        setCurrencies([]);
        setIsLoading(false);
      }
    };

    try {
      // Use ServiceProvider to make the API call
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getCurrencyRates(),
        RequestType.GET_RATE_LIST,
        listener
      );
    } catch (error) {
      console.error('Currency rates error:', error);
      setCurrencies([]);
      setIsLoading(false);
    }
  };

  // Auto-swipe functionality
  useEffect(() => {
    const autoSwipeInterval = setInterval(() => {
      if (currencies.length > 0) {
        const nextIndex = (currentCardIndex + 1) % currencies.length;
        setCurrentCardIndex(nextIndex);

        // Scroll to the next card
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 2000); // 2 seconds interval

    return () => clearInterval(autoSwipeInterval);
  }, [currentCardIndex, currencies.length]);

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
              console.log('Logging out...');
              // const authService = new AuthService();
              // await authService.logout();
              console.log('Auth service logout completed');

              // Clear all data and set login state to false
              await UserDataManager.clearAllData();
              console.log('All data cleared');

              // Set login state to false
              //  await UserDataManager.setLoginState(false);
              console.log('Login state set to false');

              router.replace('/login');
            } catch (error) {
              // console.error('Logout error:', error);
              // Even if auth service fails, clear local data
              await UserDataManager.clearAllData();
              // await UserDataManager.setLoginState(false);
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
      image: require('../assets/images/deal-details.png'),
      onPress: () => {
        console.log('Deal Details pressed');
        // Add navigation or functionality here
        // router.push('/deal-details');
      }
    },
    {
      icon: 'cash-outline',
      title: 'Currency\nRates',
      image: require('../assets/images/currency-rates.png'),
      onPress: () => {
        console.log('Currency rates menu item pressed');
        try {
          router.push('/currency-rates');
          console.log('Navigation attempted');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      icon: 'handshake-outline',
      title: 'Book a\nDeal',
      image: require('../assets/images/book-deal.png'),
      onPress: () => {
        console.log('Book a Deal pressed');
        // Add navigation or functionality here
        // router.push('/book-deal');
      }
    },
    {
      icon: 'globe-outline',
      title: 'Network',
      image: require('../assets/images/network.png'),
      onPress: () => {
        console.log('Network pressed');
        // Add navigation or functionality here
        router.push('/network');
      }
    },
    {
      icon: 'megaphone-outline',
      title: 'Announcemen...',
      image: require('../assets/images/announcement.png'),
      onPress: () => {
        console.log('Announcement pressed');
        // Add navigation or functionality here
        // router.push('/announcements');
      }
    },
    {
      icon: 'call-outline',
      title: 'Contact Us',
      image: require('../assets/images/contact-us.png'),
      onPress: () => {
        console.log('Contact Us pressed');
        // Add navigation or functionality here
        // router.push('/contact-us');
      }
    },
    {
      icon: 'person-outline',
      title: 'Profile',
      image: require('../assets/images/profile.png'),
      onPress: () => {
        console.log('Profile pressed');
        // Add navigation or functionality here
        // router.push('/profile');
      }
    },
    {
      icon: 'help-circle-outline',
      title: 'FAQs',
      image: require('../assets/images/faqs.png'),
      onPress: () => {
        console.log('FAQs pressed');
        // Add navigation or functionality here
        // router.push('/faqs');
      }
    },
    {
      icon: 'lock-closed-outline',
      title: 'Update\nPassword',
      image: require('../assets/images/update-password.png'),
      onPress: () => {
        console.log('Update Password pressed');
        // Add navigation or functionality here
        // router.push('/update-password');
      }
    },
    {
      icon: 'home-outline',
      title: 'Home\nDelivery',
      image: require('../assets/images/home-delivery.png'),
      onPress: () => {
        console.log('Home Delivery pressed');
        // Add navigation or functionality here
        // router.push('/home-delivery');
      }
    }
  ];

  const renderCurrencyCard = ({ item }: { item: Rates }) => (
    <View style={styles.currencyCard}>
      {/* Header Section */}
      <View style={styles.currencyHeader}>
        <View style={styles.flagContainer}>
          <Image
            source={{ uri: item.ImagePath }}
            style={styles.flagIcon}
            resizeMode="cover"
            defaultSource={require('../assets/images/uk_flag.png')}
          />
        </View>
        <View style={styles.currencyTextContainer}>
          <Text style={styles.currencyCode}>{item.Currency}</Text>
          <Text style={styles.currencyName}>{item.Curr_Country}</Text>
        </View>
      </View>

      {/* Rates Section */}
      <View style={styles.ratesContainer}>
        {/* Buying Rate */}
        <View style={styles.rateContainer}>
          <View style={styles.buyingHeader}>
            <Text style={styles.rateHeaderText}>Buying</Text>
          </View>
          <View style={styles.rateValueContainer}>
            <Text style={styles.rateValueText}>{formatNumber(item.Buy_Rate)}</Text>
          </View>
        </View>

        {/* Selling Rate */}
        <View style={styles.rateContainer}>
          <View style={styles.sellingHeader}>
            <Text style={styles.rateHeaderText}>Selling</Text>
          </View>
          <View style={styles.rateValueContainer}>
            <Text style={styles.rateValueText}>{formatNumber(item.Sell_Rate)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - 20;
    const index = Math.floor(contentOffset / cardWidth);
    setCurrentCardIndex(index);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.userName}>{userName.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Currency Cards Horizontal Scroll */}
        <View style={styles.currencyContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading currency rates...</Text>
            </View>
          ) : currencies.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={currencies}
              renderItem={renderCurrencyCard}
              keyExtractor={(item) => item.Currency}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={screenWidth - 20}
              snapToAlignment="start"
              decelerationRate={0.8}
              contentContainerStyle={styles.currencyFlatList}
              getItemLayout={(data, index) => ({
                length: screenWidth - 20,
                offset: (screenWidth - 20) * index,
                index,
              })}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No currency rates available</Text>
            </View>
          )}
        </View>

        {/* Menu Grid - Updated with onPress functionality */}
        <View style={styles.menuContainer}>
          {/* Row 1 */}
          <View style={styles.menuRow}>
            {menuItems.slice(0, 3).map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem}
                onPress={item.onPress}
              >
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

          {/* Row 2 */}
          <View style={styles.menuRow}>
            {menuItems.slice(3, 6).map((item, index) => (
              <TouchableOpacity 
                key={index + 3} 
                style={styles.menuItem}
                onPress={item.onPress}
              >
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

          {/* Row 3 */}
          <View style={styles.menuRow}>
            {menuItems.slice(6, 9).map((item, index) => (
              <TouchableOpacity 
                key={index + 6} 
                style={styles.menuItem}
                onPress={item.onPress}
              >
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

          {/* Row 4 - Updated to match Android (3 items with empty spaces) */}
          <View style={styles.menuRow}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={menuItems[9].onPress}
            >
              <View style={styles.menuIconContainer}>
                <Image
                  source={menuItems[9].image}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.menuText}>{menuItems[9].title}</Text>
            </TouchableOpacity>
            {/* Empty spaces to match Android layout */}
            <View style={styles.emptyMenuItem} />
            <View style={styles.emptyMenuItem} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/images/deal-details.png')}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            console.log('Currency rates bottom nav pressed');
            try {
              router.push('/currency-rates');
              console.log('Bottom nav navigation attempted');
            } catch (error) {
              console.error('Bottom nav navigation error:', error);
            }
          }}
        >
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
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity   style={styles.navItem}
          onPress={() => {
            console.log('Currency rates bottom nav pressed');
            try {
              router.push('/network');
              console.log('Bottom nav navigation attempted');
            } catch (error) {
              console.error('Bottom nav navigation error:', error);
            }
          }
        }>
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#f0f0f0', // Match container background
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5, // Add letter spacing for uppercase text
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  currencyContainer: {
    marginBottom: 30, // Increased spacing to match Android
  },
  currencyFlatList: {
    paddingHorizontal: 20,
  },
  currencyCard: {
    backgroundColor: '#4a5568',
    borderRadius: 16, // Increased border radius to match Android
    padding: 10,
    marginRight: 20,
    // Add margin to separate cards
    width: screenWidth - 40, // Full width minus horizontal padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  currencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 15,
    marginLeft: 5,
    backgroundColor: '#f0f0f0',
  },
  flagIcon: {
    width: 40,
    height: 40,
  },
  currencyTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  currencyCode: {
    fontSize: 14, // Increased font size
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 15,
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 12, // Increased font size
    color: '#cbd5e0',
    marginRight: 15,
    textAlign: 'right',
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateContainer: {
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 7.5,
  },
  buyingHeader: {
    backgroundColor: '#48bb78',
    borderTopLeftRadius: 8, // Increased border radius
    borderTopRightRadius: 8,
    paddingVertical: 6, // Increased padding
  },
  sellingHeader: {
    backgroundColor: '#f56565',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 6,
  },
  rateHeaderText: {
    fontSize: 11, // Increased font size
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  rateValueContainer: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 6, // Increased padding
  },
  rateValueText: {
    fontSize: 12, // Increased font size
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 100, // Fixed margin for bottom navigation
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Increased spacing between rows
  },
  menuItem: {
    width: 110, // Increased width to match Android
    height: 110, // Increased height to match Android
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 2, // Increased padding
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyMenuItem: {
    width: 110, // Same size as menu item but invisible
    height: 110,
  },
  menuIconContainer: {
    marginBottom: 15,
  },
  menuIcon: {
    width: 24, // Increased icon size
    height: 24,
  },
  menuText: {
    fontSize: 10, // Slightly increased font size
    fontWeight: '600', // Changed from bold to semi-bold
    color: '#333',
    textAlign: 'center',
    lineHeight: 13,
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
    paddingVertical: 15, // Increased padding
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
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
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});