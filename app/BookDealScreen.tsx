import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import ApiService from '../src/api/ApiService';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';
import RatesBottomSheet from "./components/RatesBottomSheet";
import { Rate } from "./type";

const BookDealScreen: React.FC = () => {
  const [currencies, setCurrencies] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const fetchCurrencyRates = () => {
    setIsLoading(true);
    
    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('Currency rates request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        try {
          const responseData = JSON.parse(data);
          console.log('Parsed currency rates data:', responseData);
          
          if (responseData.data?.Rates) {
            const formattedRates = responseData.data.Rates.map((rate: any, index: number) => ({
              id: index.toString(),
              currency: rate.Currency,
              countryName: rate.Curr_Country || rate.Currency,
              buyRate: parseFloat(rate.Buy_Rate),
              sellRate: parseFloat(rate.Sell_Rate),
              imagePath: rate.ImagePath || 'https://via.placeholder.com/32x32/cccccc/000000?text=?'
            }));
            setCurrencies(formattedRates);
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

  const bottomSheetRef = useRef<any>(null);
  const [buyCurrency, setBuyCurrency] = useState<Rate | null>(null);
  const [sellCurrency, setSellCurrency] = useState<Rate | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Rate | null>(null);

  useEffect(() => {
    setSelectedCurrency(activeTab === "buy" ? buyCurrency : sellCurrency);
  }, [activeTab, buyCurrency, sellCurrency]);

  useEffect(() => {
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

  const handleTabPress = (tab: "buy" | "sell") => {
    setActiveTab(tab);
    setAmount("");
    setConvertedAmount("0.00");
  };

  const handleFromPress = () => {
    if (isLoading) return;
    Keyboard.dismiss();
    bottomSheetRef.current?.open();
  };

  const handleRateSelect = (rate: Rate) => {
    if (activeTab === "buy") {
      setBuyCurrency(rate);
    } else {
      setSellCurrency(rate);
    }
    calculateConversion();
  };

  const calculateConversion = () => {
    if (selectedCurrency && amount && amount !== "") {
      const numAmount = parseFloat(amount);
      const rate =
        activeTab === "buy"
          ? selectedCurrency.buyRate
          : selectedCurrency.sellRate;
      const converted = numAmount * rate;
      setConvertedAmount(converted.toFixed(2));
    } else {
      setConvertedAmount("0.00");
    }
  };

  const handleConvert = () => {
    if (!selectedCurrency || !amount || amount === "") {
      Alert.alert("Error", "Please enter an amount to convert");
      return;
    }

    Keyboard.dismiss();
    setShowAlert(true);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    console.log("Deal confirmed successfully!");
    router.push("/SelectBranch");
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleAmountChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");
    const decimalCount = cleanedText.split(".").length - 1;
    if (decimalCount <= 1) {
      setAmount(cleanedText);
    }
  };

  useEffect(() => {
    calculateConversion();
  }, [amount, selectedCurrency, activeTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setBuyCurrency(null);
      setSellCurrency(null);
      setSelectedCurrency(null);
      setAmount("");
      setConvertedAmount("0.00");
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-gray-200">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            Book a Deal
          </Text>
          <View className="w-10 h-10" />
        </View>

        {/* Tab Container */}
        <View className="flex-row mx-4 mt-5 bg-gray-200 rounded-xl p-0.5">
          <TouchableOpacity
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === "buy" ? "bg-button_background" : ""
            }`}
            onPress={() => handleTabPress("buy")}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === "buy" ? "text-white" : "text-gray-600"
              }`}
            >
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === "sell" ? "bg-button_background" : ""
            }`}
            onPress={() => handleTabPress("sell")}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === "sell" ? "text-white" : "text-gray-600"
              }`}
            >
              Sell
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-6">
          {/* Currency Row */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-sm font-semibold text-gray-600 mb-2">
                {selectedCurrency?.currency || "Select Currency"}
              </Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white rounded-lg p-4 h-14"
                onPress={handleFromPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#666" />
                    <Text className="text-base text-gray-400 ml-3">
                      Loading currencies...
                    </Text>
                  </View>
                ) : selectedCurrency ? (
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: selectedCurrency.imagePath }}
                      className="w-10 h-10 rounded-full mr-3"
                      defaultSource={{ uri: 'https://via.placeholder.com/32x32/cccccc/000000?text=?' }}
                    />
                    <Text className="text-base font-semibold text-gray-800">
                      {selectedCurrency.currency}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-base text-gray-400">
                    Select {activeTab === "buy" ? "Buy" : "Sell"}
                  </Text>
                )}
                {!isLoading && (
                  <Icon name="keyboard-arrow-down" size={24} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-600 mb-2">
                Amount
              </Text>
              <TextInput
                className="bg-white rounded-lg p-4 text-base text-gray-800 h-14 text-right"
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                returnKeyType="done"
                editable={!!selectedCurrency}
              />
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 my-4" />

          {/* PKR Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center ml-5">
              <Image
                source={{ uri: "https://flagcdn.com/w320/pk.png" }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="text-base font-medium text-gray-800">PKR</Text>
            </View>
            <Text style={{ fontSize: 18 }} className="font-medium text-gray-800 mr-8">
              {selectedCurrency
                ? (activeTab === "buy"
                    ? selectedCurrency.buyRate
                    : selectedCurrency.sellRate
                  ).toFixed(2)
                : "0.00"}
            </Text>
          </View>

          {/* Convert Button */}
          <TouchableOpacity
            className={`bg-button_background rounded-xl py-3 items-center mt-5 ${
              !selectedCurrency || !amount ? "opacity-50" : ""
            }`}
            onPress={handleConvert}
            disabled={!selectedCurrency || !amount}
          >
            <Text className="text-base font-semibold text-white">Convert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alert Modal */}
      {showAlert && (
        <Animated.View
          className="absolute inset-0 bg-black/50 justify-center items-center px-4"
          style={{ opacity: fadeAnim }}
        >
          <View className="bg-white rounded-2xl p-5 w-full shadow-2xl">
            {/* Alert Header */}
            <View className="flex-row items-center mb-4">
              <Icon
                name="handshake"
                size={40}
                color="#FF6B35"
                style={{ marginRight: 12 }}
              />
              <Text className="text-lg font-bold text-gray-800">Alert!</Text>
            </View>

            {/* Alert Content */}
            <View className="mt-2">
              <View className="flex-row justify-between mb-5">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800 mb-1">
                    From
                  </Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {amount} {selectedCurrency?.currency}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800 mb-1">
                    To
                  </Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {convertedAmount} PKR
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800 mb-1">
                    Rate
                  </Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {selectedCurrency
                      ? (activeTab === "buy"
                          ? selectedCurrency.buyRate
                          : selectedCurrency.sellRate
                        ).toFixed(2)
                      : "0.00"}
                  </Text>
                </View>
              </View>

              {/* Button Row */}
              <View className="flex-row justify-between gap-3">
                <TouchableOpacity
                  className="flex-1 py-3 border border-button_background rounded-lg items-center bg-white"
                  onPress={handleCancel}
                >
                  <Text className="text-sm font-medium text-button_background">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 bg-button_background rounded-lg items-center"
                  onPress={handleConfirm}
                >
                  <Text className="text-sm font-medium text-white">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      <RatesBottomSheet
        ref={bottomSheetRef}
        rates={currencies}
        isForBuying={activeTab === "buy"}
        onRateSelect={handleRateSelect}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

export default BookDealScreen;