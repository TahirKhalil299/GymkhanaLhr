import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RatesBottomSheet from './components/RatesBottomSheet';
import { Rate } from './type';

const BookDealScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<Rate | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string>('0.00');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const bottomSheetRef = useRef<any>(null);

  // Mock data for rates
  const mockRates: Rate[] = [
    {
      id: '1',
      currency: 'USD',
      countryName: 'United States',
      buyRate: 285.85,
      sellRate: 288.00,
      imagePath: 'https://flagcdn.com/w320/us.png',
    },
    {
      id: '2',
      currency: 'GBP',
      countryName: 'United Kingdom',
      buyRate: 0.73,
      sellRate: 0.75,
      imagePath: 'https://flagcdn.com/w320/gb.png',
    },
    {
      id: '3',
      currency: 'EUR',
      countryName: 'Europe',
      buyRate: 0.85,
      sellRate: 0.87,
      imagePath: 'https://flagcdn.com/w320/eu.png',
    },
  ];

  React.useEffect(() => {
    if (showAlert) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showAlert]);

  const handleTabPress = (tab: 'buy' | 'sell') => {
    setActiveTab(tab);
    setSelectedCurrency(null);
    setConvertedAmount('0.00');
    setAmount('');
  };

  const handleFromPress = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.open();
  };

  const handleRateSelect = (rate: Rate) => {
    setSelectedCurrency(rate);
    calculateConversion();
  };

  const calculateConversion = () => {
    if (selectedCurrency && amount && amount !== '') {
      const numAmount = parseFloat(amount);
      const rate = activeTab === 'buy' ? selectedCurrency.buyRate : selectedCurrency.sellRate;
      const converted = numAmount * rate;
      setConvertedAmount(converted.toFixed(2));
    } else {
      setConvertedAmount('0.00');
    }
  };

  const handleConvert = () => {
    if (!selectedCurrency || !amount || amount === '') {
      Alert.alert('Error', 'Please enter an amount to convert');
      return;
    }

    Keyboard.dismiss();
    setShowAlert(true);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    Alert.alert('Success', 'Deal confirmed successfully!');
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleAmountChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const decimalCount = cleanedText.split('.').length - 1;
    if (decimalCount <= 1) {
      setAmount(cleanedText);
    }
  };

  React.useEffect(() => {
    calculateConversion();
  }, [amount, selectedCurrency, activeTab]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Deal</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'buy' && styles.activeTab,
            ]}
            onPress={() => handleTabPress('buy')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'buy' && styles.activeTabText,
              ]}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'sell' && styles.activeTab,
            ]}
            onPress={() => handleTabPress('sell')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'sell' && styles.activeTabText,
              ]}>
              Sell
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.currencySection}>
            <Text style={styles.sectionTitle}>
              {selectedCurrency?.currency || 'Select Currency'}
            </Text>
            <TouchableOpacity 
              style={styles.currencySelector}
              onPress={handleFromPress}
            >
              {selectedCurrency ? (
                <View style={styles.currencyInfo}>
                  <Image
                    source={{ uri: selectedCurrency.imagePath }}
                    style={styles.flagImage}
                  />
                  <Text style={styles.currencyName}>{selectedCurrency.currency}</Text>
                </View>
              ) : (
                <Text style={styles.selectText}>Select {activeTab === 'buy' ? 'Buy' : 'Sell'}</Text>
              )}
              <Icon name="keyboard-arrow-down" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.amountLabel}>Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.currencySection}>
            <Text style={styles.sectionTitle}>PKR</Text>
            <View style={styles.currencyInfo}>
              <Image
                source={{ uri: 'https://flagcdn.com/w320/pk.png' }}
                style={styles.flagImage}
              />
              <Text style={styles.currencyName}>PKR</Text>
            </View>
            <Text style={styles.rateText}>
              {selectedCurrency ? 
                (activeTab === 'buy' ? selectedCurrency.buyRate : selectedCurrency.sellRate).toFixed(2) 
                : '0.00'}
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.convertButton,
              (!selectedCurrency || !amount) && styles.disabledButton
            ]} 
            onPress={handleConvert}
            disabled={!selectedCurrency || !amount}
          >
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showAlert && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Icon
                name="handshake"
                size={40}
                color="#FF6B35"
                style={styles.handshakeIcon}
              />
              <Text style={styles.alertTitle}>Alert!</Text>
            </View>

            <View style={styles.alertContent}>
              <View style={styles.alertRow}>
                <View style={styles.alertColumn}>
                  <Text style={styles.alertLabel}>From</Text>
                  <Text style={styles.alertValue}>
                    {amount} {selectedCurrency?.currency}
                  </Text>
                </View>
                <View style={styles.alertColumn}>
                  <Text style={styles.alertLabel}>To</Text>
                  <Text style={styles.alertValue}>
                    {convertedAmount} PKR
                  </Text>
                </View>
                <View style={styles.alertColumn}>
                  <Text style={styles.alertLabel}>Rate</Text>
                  <Text style={styles.alertValue}>
                    {selectedCurrency ? 
                      (activeTab === 'buy' ? selectedCurrency.buyRate : selectedCurrency.sellRate).toFixed(2) 
                      : '0.00'}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      <RatesBottomSheet
        ref={bottomSheetRef}
        rates={mockRates}
        isForBuying={activeTab === 'buy'}
        onRateSelect={handleRateSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FD',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  currencySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectText: {
    fontSize: 16,
    color: '#999',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginTop: 8,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  convertButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  handshakeIcon: {
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alertContent: {
    marginTop: 8,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  alertColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  alertLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default BookDealScreen;