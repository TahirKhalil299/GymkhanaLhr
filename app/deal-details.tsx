import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
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
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      default:
        return '#F44336';
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
    // Add your navigation logic here
       router.push({
    pathname: '/details',
    params: { dealData: JSON.stringify(deal) }, // Pass only strings
  });

  };

  const renderDealCard = (deal: Deal, index: number) => {
    const dealValues = getDealValues(deal);
    const statusColor = getStatusBackgroundColor(deal.TrLevelD || '');

    return (
      <View key={index} style={styles.dealCard}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.dealTypeContainer}>
            <Text style={styles.dealTypeLabel}>Deal Type : </Text>
            <Text style={styles.dealTypeValue}>{getDealStatus(deal)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{deal.TrLevelD}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <Text style={styles.customerName}>
          {toProperCase(deal.PartyTitle || '')} {toProperCase(deal.PartyName || '')}
        </Text>
        <Text style={styles.idNumber}>
          {formatStringWithDashes(deal.PartyITypeRef || '')}
        </Text>
        <Text style={styles.email}>{deal.PartyEmail}</Text>
        <Text style={styles.date}>{formatDateString(deal.PDate || '')}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Transaction Details */}
        <View style={styles.transactionRow}>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionLabel}>FCY</Text>
            <Text style={styles.transactionValue}>{dealValues.fcy}</Text>
          </View>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionLabel}>Rate</Text>
            <Text style={styles.transactionValue}>{dealValues.rate}</Text>
          </View>
          <View style={styles.transactionColumn}>
            <Text style={styles.transactionLabel}>Amount</Text>
            <Text style={styles.transactionValue}>{dealValues.amount}</Text>
          </View>
        </View>

        {/* View Details Button */}
        {/* View Details Button */}
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails && handleViewDetails(deal)}
        >
          <Icon name="description" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>

        
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deal Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Deal Cards */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sampleDeals.map((deal, index) => renderDealCard(deal, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginRight: 32, // Compensate for back button
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dealCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  dealTypeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  dealTypeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transactionColumn: {
    flex: 1,
    alignItems: 'center',
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  transactionValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  viewDetailsButton: {
    backgroundColor: '#3f51b5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DealDetailsScreen;