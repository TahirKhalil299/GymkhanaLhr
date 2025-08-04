import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { UserDataManager } from '../utils/userDataManager';

const { width: screenWidth } = Dimensions.get('window');

// Define the currency type
interface Currency {
  id: number;
  code: string;
  name: string;
  flag: any;
  buying: number;
  selling: number;
}

export default function HomeScreen() {
  const [userName, setUserName] = useState('User');
  const router = useRouter();

  // Sample currency data - replace with your actual data
  const currencies: Currency[] = [
    {
      id: 1,
      code: 'EUR',
      name: 'European E. Community',
      flag: require('../assets/images/uk_flag.png'), // Use proper EUR flag
      buying: 335.00,
      selling: 337.85
    },
    {
      id: 2,
      code: 'USD',
      name: 'United States Dollar',
      flag: require('../assets/images/usa__flag.png'), // Use proper USA flag
      buying: 278.50,
      selling: 280.25
    },
    {
      id: 3,
      code: 'GBP',
      name: 'British Pound Sterling',
      flag: require('../assets/images/uk_flag.png'), // Use proper GBP flag
      buying: 354.75,
      selling: 357.20
    },
    {
      id: 4,
      code: 'CAD',
      name: 'Canadian Dollar',
      flag: require('../assets/images/uk_flag.png'), // Use proper CAD flag
      buying: 205.30,
      selling: 207.85
    }
  ];

  useEffect(() => {
    console.log('Home screen mounted');
    checkAuthStatus();
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
            //  console.error('Logout error:', error);
              // Even if auth service fails, clear local data
              await UserDataManager.clearAllData();
              await UserDataManager.setLoginState(false);
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

  const renderCurrencyCard = ({ item }: { item: Currency }) => (
    <View style={styles.currencyCard}>
      {/* Header Section */}
      <View style={styles.currencyHeader}>
        <Image
          source={item.flag}
          style={styles.flagIcon}
          resizeMode="contain"
        />
        <View style={styles.currencyTextContainer}>
          <Text style={styles.currencyCode}>{item.code}</Text>
          <Text style={styles.currencyName}>{item.name}</Text>
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
            <Text style={styles.rateValueText}>{item.buying.toFixed(2)}</Text>
          </View>
        </View>

        {/* Selling Rate */}
        <View style={styles.rateContainer}>
          <View style={styles.sellingHeader}>
            <Text style={styles.rateHeaderText}>Selling</Text>
          </View>
          <View style={styles.rateValueContainer}>
            <Text style={styles.rateValueText}>{item.selling.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
          <FlatList
            data={currencies}
            renderItem={renderCurrencyCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth - 58} // Adjusted to match new card width
            decelerationRate="fast"
            contentContainerStyle={styles.currencyFlatList}
          />
        </View>

        {/* Menu Grid - Updated to match Android layout */}
        <View style={styles.menuContainer}>
          {/* Row 1 */}
          <View style={styles.menuRow}>
            {menuItems.slice(0, 3).map((item, index) => (
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

          {/* Row 2 */}
          <View style={styles.menuRow}>
            {menuItems.slice(3, 6).map((item, index) => (
              <TouchableOpacity key={index + 3} style={styles.menuItem}>
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
              <TouchableOpacity key={index + 6} style={styles.menuItem}>
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
            <TouchableOpacity style={styles.menuItem}>
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
            style={styles.navIcon}
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
    backgroundColor: '#f0f0f0', // Slightly darker background to match Android
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
    paddingHorizontal: 25, // Increased padding
  },
  currencyCard: {
    backgroundColor: '#4a5568',
    borderRadius: 16, // Increased border radius to match Android
    padding: 20,
    marginRight: 12, // Reduced margin
    width: screenWidth - 30, // Reduced width to fit better
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
    marginBottom: 20,
  },
  flagIcon: {
    width: 40, // Increased size to match Android
    height: 40,
    borderRadius: 20,
    marginRight: 150,
  },
  currencyTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  currencyCode: {
    fontSize: 14, // Increased font size
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 12, // Increased font size
    color: '#cbd5e0',
    textAlign: 'right',
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateContainer: {
    flex: 1,
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
    marginBottom: 100,
    marginLeft: 8,
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
    width: 100, // Same size as menu item but invisible
    height: 100,
  },
  menuIconContainer: {
    marginBottom:15 ,
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
    paddingVertical: 5,
    paddingBottom: 0,
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
});