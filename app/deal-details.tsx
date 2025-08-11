import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Interface matching your Android Deals model
interface Deal {
  DealNo?: string;
  DealDate?: string;
  CompFName?: string;
  BranchID?: string;
  BranchSName?: string;
  BranchCode?: string;
  BranchAddress1?: string;
  BranchAddress2?: string;
  BranchCity?: string;
  BranchCountry?: string;
  BranchTel1?: string;
  BranchFax1?: string;
  BranchEmail1?: string;
  DeliveryBranchID?: string;
  DeliveryBranchCode?: string;
  DeliveryBranchSName?: string;
  EXCompany?: string;
  StlD?: string;
  PartyDealRemarks?: string;
  SNName?: string;
  SNAddress1?: string;
  SNCity?: string;
  SNCountry?: string;
  SNTelMobile?: string;
  SNRelationship?: string;
  SNPurpose?: string;
  CTypeD?: string;
  CCType?: string;
  DetailCode?: string;
  DetailCodeDescription?: string;
  TrLevel?: string;
  TrLevelD?: string;
  ROTypeID?: string;
  ROTypeDD?: string;
  DealTrlevel?: string;
  DealTrlevelD?: string;
  DeliveryAt?: string;
  PayINCurrID?: string;
  PayINAmt?: string;
  PayINPKR?: string;
  PayINRate?: string;
  PayOutCurrID?: string;
  PayOutRate?: string;
  PayOutAmt?: string;
  PayOutPKR?: string;
  PartyProfile?: string;
  PartyCode?: string;
  PartyTitle?: string;
  PartyName?: string;
  PartyCStatusID?: string;
  PartyCStatusD?: string;
  PartyITypeID?: string;
  PartyIType?: string;
  PartyITypeRef?: string;
  PartyITypeExpiry?: string;
  PartyTelMobile?: string;
  PartyEmail?: string;
  PartyAddress1?: string;
  PartyCity?: string;
  PartyCountry?: string;
  AccActivity1ID?: string;
  AccActivity1D?: string;
  AccActivity1DD?: string;
  US?: string;
  PDate?: string;
}

const DealDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  // Sample data matching your Android logic
  const sampleDeals: Deal[] = [
    {
      ROTypeID: "7", // Buy deal
      TrLevelD: "Cleared",
      PartyTitle: "Mr",
      PartyName: "Tahir",
      PartyITypeRef: "31205-9698968-5",
      PartyEmail: "tahir.khalil@softconsults.com",
      PDate: "2025-07-19T11:07:00",
      PayINCurrID: "USD",
      PayINAmt: "12.00",
      PayINRate: "285.85",
      PayINPKR: "3430.20",
    },
    {
      ROTypeID: "7", // Buy deal
      TrLevelD: "Cleared",
      PartyTitle: "Mr",
      PartyName: "Tahir",
      PartyITypeRef: "31205-9698968-5",
      PartyEmail: "tahir.khalil@softconsults.com",
      PDate: "2025-07-18T18:49:00",
      PayINCurrID: "USD",
      PayINAmt: "25.00",
      PayINRate: "285.85",
      PayINPKR: "7146.25",
    },
    {
      ROTypeID: "7", // Buy deal
      TrLevelD: "Cleared",
      PartyTitle: "Mr",
      PartyName: "Tahir",
      PartyITypeRef: "31205-9698968-5",
      PartyEmail: "tahir.khalil@softconsults.com",
      PDate: "2025-07-17T11:59:00",
      PayINCurrID: "USD",
      PayINAmt: "30.00",
      PayINRate: "285.85",
      PayINPKR: "8575.50",
    },
  ];

  // Helper functions matching your Android Utils
  const formatDateString = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const formatNumber = (numString: string): string => {
    try {
      const num = parseFloat(numString);
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return numString;
    }
  };

  const formatStringWithDashes = (str: string): string => {
    return str.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
  };

  const toProperCase = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Status background color logic matching your Android getStatus method
  const getStatusBackgroundColor = (status: string): string => {
    switch (status) {
      case 'Cleared':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  // Deal status logic matching your Android getDealStatus method
  const getDealStatus = (deal: Deal): string => {
    return deal.ROTypeID === "7" ? "Buy" : "Sell";
  };

  // Get amount, rate, and FCY values based on deal type
  const getDealValues = (deal: Deal) => {
    if (deal.ROTypeID === "7") {
      return {
        amount: `${formatNumber(deal.PayINPKR || '0')} PKR`,
        rate: formatNumber(deal.PayINRate || '0'),
        fcy: `${formatNumber(deal.PayINAmt || '0')} ${deal.PayINCurrID}`,
      };
    } else {
      return {
        amount: `${formatNumber(deal.PayOutPKR || '0')} PKR`,
        rate: formatNumber(deal.PayOutRate || '0'),
        fcy: `${formatNumber(deal.PayOutAmt || '0')} ${deal.PayOutCurrID}`,
      };
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleViewDetails = (deal: Deal) => {
    console.log('View details for deal:', deal);
    router.push({
      pathname: '/details',
      params: { dealData: JSON.stringify(deal) }, // Pass only strings
    });
  };

  const renderDealCard = (deal: Deal, index: number) => {
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
          {toProperCase(deal.PartyTitle || '')} {toProperCase(deal.PartyName || '')}
        </Text>
        <Text className="text-xs font-medium text-gray-800 mb-1">
          {formatStringWithDashes(deal.PartyITypeRef || '')}
        </Text>
        <Text className="text-xs font-medium text-gray-800 mb-1">{deal.PartyEmail}</Text>
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
  className="bg-button_background flex-row items-center justify-center py-2.5 rounded-xl"
  onPress={() => handleViewDetails && handleViewDetails(deal)}
>
  <Icon name="description" size={25} color="white" className="mr-2" />
 <Text className="text-button_text text-[14px] font-bold">View Details</Text>
</TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top , paddingBottom: insets.bottom }}>
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
        {sampleDeals.map((deal, index) => renderDealCard(deal, index))}
      </ScrollView>
    </View>
  );
};

export default DealDetailsScreen;