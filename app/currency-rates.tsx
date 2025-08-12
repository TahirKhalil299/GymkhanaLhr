import { Ionicons } from '@expo/vector-icons'; // Added import for Icon
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

// Added interface for props if you want to support custom back handler
interface CurrencyRatesProps {
  onBack?: () => void;
}

const CurrencyRates: React.FC<CurrencyRatesProps> = ({ onBack }) => {
  const [currencies, setCurrencies] = useState<Rates[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Number formatting function
  const formatNumber = (value: string): string => {
    try {
      const number = parseFloat(value);
      if (isNaN(number)) {
        return value;
      }

      const stripped = number.toString();
      const parts = stripped.split('.');

      if (parts.length === 1) {
        return parts[0] + '.00';
      }

      const integerPart = parts[0];
      let decimalPart = parts[1];

      if (decimalPart.length > 6) {
        decimalPart = decimalPart.substring(0, 6);
      }

      if (decimalPart.length < 2) {
        decimalPart = decimalPart.padEnd(2, '0');
      }

      return `${integerPart}.${decimalPart}`;
    } catch (error) {
      return value;
    }
  };

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

const fetchCurrencyRates = () => {
  setIsLoading(true);
  console.log('[1] Starting to fetch currency rates...'); // Initial log
  
  const listener: ApiListener = {
    onRequestStarted: () => {
      console.log('[2] Currency rates request started - API call initiated');
    },
    onRequestSuccess: async (response, data, tag) => {
      console.log('[3] Raw API response received:', data);
      
      try {
        const responseData = JSON.parse(data);
        console.log('[4] Parsed JSON response:', responseData);
        
        // Detailed logging of the response structure
        console.log('[5] Response structure check:', {
          hasData: !!responseData.data,
          hasRates: !!responseData.data?.Rates,
          isArray: Array.isArray(responseData.data?.Rates),
          ratesCount: responseData.data?.Rates?.length || 0,
          hasDirectRates: !!responseData.Rates,
          isDirectArray: Array.isArray(responseData.Rates),
          directRatesCount: responseData.Rates?.length || 0
        });

        let ratesToSet = [];
        
        if (responseData.data && responseData.data.Rates && Array.isArray(responseData.data.Rates)) {
          console.log('[6] Using data.Rates path, count:', responseData.data.Rates.length);
          ratesToSet = responseData.data.Rates;
        } else if (responseData.Rates && Array.isArray(responseData.Rates)) {
          console.log('[6] Using direct Rates path, count:', responseData.Rates.length);
          ratesToSet = responseData.Rates;
        } else {
          console.warn('[6] No valid rates data found in response');
        }

        console.log('[7] Rates to be set:', ratesToSet);
        setCurrencies(ratesToSet);
        
        // Additional verification after state update
        setTimeout(() => {
          console.log('[8] State after update (verify):', {
            currenciesCount: currencies.length,
            currencies: currencies
          });
        }, 0);
        
      } catch (error) {
        console.error('[ERROR] Parsing failed:', error);
        console.log('[ERROR] Original data that failed to parse:', data);
        setCurrencies([]);
      }
    },
    onRequestFailure: (error, message, errors, tag) => {
      console.error('[ERROR] Request failed:', {
        error,
        message,
        errors,
        tag
      });
      setCurrencies([]);
    },
    onRequestEnded: () => {
      console.log('[9] Request completed');
      setIsLoading(false);
    },
    onError: (response, message, tag) => {
      console.error('[ERROR] API error:', {
        response,
        message,
        tag
      });
      setCurrencies([]);
      setIsLoading(false);
    }
  };

  try {
    console.log('[10] Attempting to make API call...');
    const { serviceProvider } = require('../src/api/ServiceProvider');
    serviceProvider.sendApiCall(
      ApiService.getCurrencyRates(),
      RequestType.GET_RATE_LIST,
      listener
    );
  } catch (error) {
    console.error('[ERROR] API call failed:', error);
    setCurrencies([]);
    setIsLoading(false);
  }
};

// Add this useEffect to monitor state changes
useEffect(() => {
  console.log('[STATE UPDATE] currencies changed:', {
    count: currencies.length,
    items: currencies
  });
}, [currencies]);

  const renderCurrencyRow = (item: Rates, index: number) => (
    <View key={index} style={styles.currencyRow}>
      <View style={styles.leftSection}>
        <View style={styles.flagContainer}>
          <Image
            source={{ uri: item.ImagePath }}
            style={styles.flagIcon}
            resizeMode="cover"
            defaultSource={require('../assets/images/uk_flag.png')}
          />
        </View>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{item.Currency}</Text>
          <Text style={styles.currencyName}>{item.Curr_Country}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.rateContainer}>
          <View style={styles.buyingButton}>
            <Text style={styles.buyingText}>Buying</Text>
          </View>
          <Text style={styles.rateValue}>{formatNumber(item.Buy_Rate)}</Text>
        </View>
        
        <View style={styles.rateContainer}>
          <View style={styles.sellingButton}>
            <Text style={styles.sellingText}>Selling</Text>
          </View>
          <Text style={styles.rateValue}>{formatNumber(item.Sell_Rate)}</Text>
        </View>
      </View>
    </View>
  );

  const handleBackPress = () => {
    if (onBack) {
      onBack(); // If custom back handler is provided, call it
    } else {
      navigation.goBack(); // Otherwise use navigation goBack
    }
  };

  const handleHomePress = () => {
    console.log('Home pressed - navigating to home');
    try {
      router.push('/home'); // Navigate to home screen
    } catch (error) {
      console.error('Home navigation error:', error);
    }
  };

  const handleCurrencyRatesPress = () => {
    console.log('Currency rates pressed - already on currency rates screen, doing nothing');
    // Do nothing since we're already on the currency rates screen
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Currency Rates</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Currency List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading currency rates...</Text>
          </View>
        ) : currencies.length > 0 ? (
          currencies.map((item, index) => renderCurrencyRow(item, index))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No currency rates available</Text>
          </View>
        )}
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
           
           {/* Currency Exchange - Active/Highlighted */}
           <TouchableOpacity
             style={[styles.navItem, styles.activeNavItem]}
             onPress={handleCurrencyRatesPress}
           >
             <View style={styles.activeNavBackground}>
               <Image
                 source={require('../assets/images/currency-rates.png')}
                 style={[styles.navIcon, styles.activeNavIcon]}
                 resizeMode="contain"
               />
             </View>
           </TouchableOpacity>
           
           {/* Home Button */}
           <TouchableOpacity 
             style={styles.navItem}
             onPress={handleHomePress}
           >
             <Ionicons name="apps" size={24} color="#666666" />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  flagIcon: {
    width: '100%',
    height: '100%',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  currencyName: {
    fontSize: 12,
    color: '#666666',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  buyingButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  sellingButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  buyingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  sellingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: '#666666', // Default color for inactive icons
  },
  activeNavItem: {
    // Additional styles for active nav item if needed
  },
  activeNavBackground: {
    backgroundColor: '#ffe5db',
    borderRadius: 20,
    padding: 12,
  },
  activeNavIcon: {
    tintColor: '#ff6b35', // Orange color for active currency exchange icon
  },
});

export default CurrencyRates;