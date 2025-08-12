import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../src/api/ApiService';
import { Deal } from '../src/api/models/DealListResponse';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';
import tailwindConfig from '../tailwind.config';
import { UserDataManager } from "../utils/userDataManager";

const DealDetailsScreen: React.FC = () => {
  console.log('[DealDetailsScreen] Component initialized');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[DealDetailsScreen] useEffect triggered - fetching deal list');
    fetchDealList();
  }, []);

  const fetchDealList = async () => {
    console.log('[fetchDealList] Starting to fetch deal list');
    setIsLoading(true);
    setError(null);
    
    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('[ApiListener] Request started - GET_DEAL_LIST');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('[ApiListener] Request success - GET_DEAL_LIST');
        console.log('[ApiListener] Raw response:', response);
        console.log('[ApiListener] Raw data:', data);
        
        try {
          const responseData = JSON.parse(data);
          console.log('[ApiListener] Parsed response data:', responseData);

          if (responseData.StatusCode === "00" && responseData.data?.Deals) {
            console.log(`[ApiListener] Received ${responseData.data.Deals.length} deals`);
            setDeals(responseData.data.Deals);
          } else {
            console.warn('[ApiListener] No deals found or error in response', {
              StatusCode: responseData.StatusCode,
              StatusDesc: responseData.StatusDesc
            });
            setError(responseData.StatusDesc || 'No deals found');
            setDeals([]);
          }
        } catch (error) {
          console.error('[ApiListener] Error processing deal list response:', error);
          setError('Failed to parse response');
          setDeals([]);
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.error('[ApiListener] Request failed:', {
          error,
          message,
          errors,
          tag
        });
        setError(message || 'Request failed');
        setDeals([]);
      },
      onRequestEnded: () => {
        console.log('[ApiListener] Request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.error('[ApiListener] Error occurred:', {
          response,
          message,
          tag
        });
        setError(message || 'An error occurred');
        setDeals([]);
        setIsLoading(false);
      }
    };

    try {
      console.log('[fetchDealList] Getting user data');
      const userData = await UserDataManager.getUserData();
      console.log('[fetchDealList] User data retrieved:', userData);
      
      if (!userData || !userData.C_ITypeRef) {
        const errorMsg = "User data or C_ITypeRef not available";
        console.error('[fetchDealList] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[fetchDealList] Preparing API call with C_ITypeRef:', userData.C_ITypeRef);
      const { serviceProvider } = require('../src/api/ServiceProvider');
      
      console.log('[fetchDealList] Sending API call...');
      serviceProvider.sendApiCall(
        ApiService.getDealList(userData.C_ITypeRef),
        RequestType.GET_DEAL_LIST,
        listener
      );
    } catch (error) {
      console.error('[fetchDealList] Error fetching deal list:', error);
      
      let errorMessage = 'Failed to fetch deals';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('[fetchDealList] Setting error state:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      setDeals([]);
    }
  };

const formatDateString = (dateString: string): string => {
  console.log('[formatDateString] Original date string:', dateString);
  if (!dateString) return 'N/A';
  
  try {
    // Handle dates in format "7/10/2025 7:07:25 PM"
    if (dateString.includes('/') && dateString.includes(':')) {
      const [datePart, timePart] = dateString.split(' ');
      const [month, day, year] = datePart.split('/').map(Number);
      const [time, period] = timePart.split(' ');
      const [hours, minutes, seconds] = time.split(':').map(Number);
      
      // Convert 12-hour format to 24-hour format
      let hours24 = hours;
      if (period === 'PM' && hours < 12) hours24 += 12;
      if (period === 'AM' && hours === 12) hours24 = 0;
      
      const date = new Date(year, month - 1, day, hours24, minutes, seconds);
      console.log('[formatDateString] Parsed date:', date);
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    // Fallback to default Date parsing if format doesn't match
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('[formatDateString] Error formatting date:', error);
    return dateString; // Return original string if formatting fails
  }
};
  const formatNumber = (numString: string): string => {
    console.log('[formatNumber] Formatting number:', numString);
    if (!numString) return '0.00';
    try {
      const num = parseFloat(numString);
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error('[formatNumber] Error formatting number:', error);
      return numString;
    }
  };

  const formatStringWithDashes = (str: string): string => {
    console.log('[formatStringWithDashes] Formatting string:', str);
    if (!str) return 'N/A';
    return str.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
  };

  const toProperCase = (str: string): string => {
    console.log('[toProperCase] Formatting string:', str);
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getStatusBackgroundColor = (status: string): string => {
    console.log('[getStatusBackgroundColor] Getting color for status:', status);
    switch (status) {
      case 'Cleared':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getDealStatus = (deal: Deal): string => {
    const status = deal.ROTypeID === "7" ? "Buy" : "Sell";
    console.log('[getDealStatus] Deal status:', status);
    return status;
  };

  const getDealValues = (deal: Deal) => {
    console.log('[getDealValues] Getting values for deal:', deal.ROTypeID);
    if (deal.ROTypeID === "7") {
      return {
        amount: `${formatNumber(deal.PayIN_PKR || '0')} PKR`,
        rate: formatNumber(deal.PayIN_Rate || '0'),
        fcy: `${formatNumber(deal.PayIN_Amt || '0')} ${deal.PayIN_CurrID || ''}`,
      };
    } else {
      return {
        amount: `${formatNumber(deal.PayOut_PKR || '0')} PKR`,
        rate: formatNumber(deal.PayOut_Rate || '0'),
        fcy: `${formatNumber(deal.PayOut_Amt || '0')} ${deal.PayOut_CurrID || ''}`,
      };
    }
  };

  const handleBackPress = () => {
    console.log('[handleBackPress] Navigating back');
    navigation.goBack();
  };

  const handleViewDetails = (deal: Deal) => {
    console.log('[handleViewDetails] Navigating to deal details:', deal.ROTypeID);
    router.push({
      pathname: '/details',
      params: { dealData: JSON.stringify(deal) },
    });
  };

  const renderDealCard = (deal: Deal, index: number) => {
    console.log(`[renderDealCard] Rendering deal card ${index}`);
    const dealValues = getDealValues(deal);
    const statusColor = getStatusBackgroundColor(deal.TrLevelD || '');

    return (
      <View key={index} className="bg-white rounded-xl p-4 mb-4 shadow-md shadow-black/25">
        {/* Header Row */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center flex-1 mr-4">
            <Text className="text-sm font-bold text-gray-800">Deal Type : </Text>
            <Text className="text-sm font-medium text-gray-800">{getDealStatus(deal)}</Text>
          </View>
          <View className={`${statusColor} px-3 py-1 rounded-full`}>
            <Text className="text-white text-xs font-bold">{deal.TrLevelD}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <Text className="text-sm font-medium text-gray-800 mb-1">
          {toProperCase(deal.Party_Title || '')} {toProperCase(deal.Party_Name || '')}
        </Text>
        <Text className="text-xs font-medium text-gray-800 mb-1">
          {formatStringWithDashes(deal.Party_ITypeRef || '')}
        </Text>
        <Text className="text-xs font-medium text-gray-800 mb-1">{deal.Party_Email}</Text>
        <Text className="text-xs font-medium text-gray-800 mb-2">{formatDateString(deal.PDate || '')}</Text>

        {/* Divider */}
        <View className="h-px bg-gray-300 my-3" />

        {/* Transaction Details */}
        <View className="flex-row justify-between mb-5">
          <View className="flex-1 items-center">
            <Text className="text-base font-bold text-gray-800 mb-2">FCY</Text>
            <Text className="text-xs font-medium text-gray-800 text-center">{dealValues.fcy}</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-base font-bold text-gray-800 mb-2">Rate</Text>
            <Text className="text-xs font-medium text-gray-800 text-center">{dealValues.rate}</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-base font-bold text-gray-800 mb-2">Amount</Text>
            <Text className="text-xs font-medium text-gray-800 text-center">{dealValues.amount}</Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          className="bg-button_background flex-row items-center justify-center py-2 rounded-xl"
          onPress={() => handleViewDetails(deal)}
        >
          <Icon name="description" size={25} color="white" className="mr-2" />
          <Text className="text-button_text text-[14px] font-bold">View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log('[DealDetailsScreen] Rendering component with state:', {
    isLoading,
    error,
    dealsCount: deals.length
  });

  if (isLoading) {
    console.log('[DealDetailsScreen] Rendering loading state');
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large"   color={tailwindConfig.theme.extend.colors.button_background}  />
      </View>
    );
  }

  if (error) {
    console.log('[DealDetailsScreen] Rendering error state:', error);
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-lg text-red-500 mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-button_background px-6 py-3 rounded-lg"
          onPress={fetchDealList}
        >
          <Text className="text-button_text font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (deals.length === 0) {
    console.log('[DealDetailsScreen] Rendering empty state');
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-600">No deals found</Text>
      </View>
    );
  }

  console.log('[DealDetailsScreen] Rendering deal list with', deals.length, 'deals');
  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-gray-100 shadow-md shadow-black/10">
        <TouchableOpacity onPress={handleBackPress} className="p-2">
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-800 text-center mr-8">Deal Details</Text>
        <View className="w-8" />
      </View>

      {/* Deal Cards */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        {deals.map((deal, index) => renderDealCard(deal, index))}
      </ScrollView>
    </View>
  );
};

export default DealDetailsScreen;