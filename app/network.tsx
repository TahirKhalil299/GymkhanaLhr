import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../src/api/ApiService';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';
import { DealBranches } from '../src/api/models/GetBranchesNameResponse';

const { width } = Dimensions.get('window');

interface BranchData {
  id: string;
  branchName: string;
  branchType: string;
  address: string;
  city: string;
}

interface NetworkScreenProps {
  onBack?: () => void;
  onCall?: (branchId: string) => void;
  onDirection?: (branchId: string) => void;
}

const NetworkScreen: React.FC<NetworkScreenProps> = ({
  onBack,
  onCall,
  onDirection,
}) => {
  const [branches, setBranches] = useState<DealBranches[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    console.log('NetworkScreen mounted, fetching branches...');
    fetchBranches(); // ✅ Uncommented this line
  }, []);

  const fetchBranches = () => {
    console.log('🚀 Starting fetchBranches function...');
    setIsLoading(true);
    
    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('📡 Branches API request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('✅ Branches API successful. Raw data:', data);
        console.log('📊 Response tag:', tag);
        
        try {
          const responseData = JSON.parse(data);
          console.log('📋 Parsed branches response:', JSON.stringify(responseData, null, 2));
          
          // ✅ Fixed: Access the correct data path
          if (responseData.data && responseData.data.DealBranches && Array.isArray(responseData.data.DealBranches)) {
            setBranches(responseData.data.DealBranches); // ✅ Fixed: Set correct data
            console.log('🏢 Branches data set successfully:', responseData.data.DealBranches);
            console.log('📈 Number of branches:', responseData.data.DealBranches.length);
          } else if (responseData.DealBranches && Array.isArray(responseData.DealBranches)) {
            setBranches(responseData.DealBranches);
            console.log('🏢 Branches data set (fallback):', responseData.DealBranches);
          } else {
            console.log('❌ No branches data found in response structure');
            console.log('🔍 Available keys in responseData:', Object.keys(responseData));
            if (responseData.data) {
              console.log('🔍 Available keys in responseData.data:', Object.keys(responseData.data));
            }
            setBranches([]);
          }
        } catch (error) {
          console.error('❌ Error processing branches response:', error);
          console.error('📄 Raw data that failed to parse:', data);
          setBranches([]);
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('❌ Branches API failed:', message);
        console.log('🔥 Error details:', error);
        console.log('📝 Error messages:', errors);
        console.log('🏷️ Tag:', tag);
        setBranches([]);
      },
      onRequestEnded: () => {
        console.log('🏁 Branches API request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('💥 Branches API error:', message);
        console.log('📋 Response:', response);
        console.log('🏷️ Tag:', tag);
        setBranches([]);
        setIsLoading(false);
      }
    };

    try {
      console.log('🔧 Attempting to get service provider...');
      const { serviceProvider } = require('../src/api/ServiceProvider');
      
      console.log('📞 Making API call with:');
      console.log('   - Service: ApiService.getBranchesList()'); // ✅ Fixed method name
      console.log('   - RequestType: GET_BRANCHES_NAME');
      
      // ✅ Fixed: Call the correct API method
      serviceProvider.sendApiCall(
        ApiService.getBranchesList(), // ✅ Changed from getCurrencyRates() to getBranchesList()
        RequestType.GET_BRANCHES_NAME,
        listener
      );
    } catch (error) {
      console.error('💥 Error setting up branches API call:', error);
  //    console.error('📄 Error stack:', error.stack);
      setBranches([]);
      setIsLoading(false);
    }
  };

  // Convert API data to display format
  const formatBranchData = (apiData: DealBranches[]): BranchData[] => {
    console.log('🔄 Converting API data to display format...');
    return apiData.map((branch, index) => ({
      id: branch.Branch_Code || index.toString(),
      branchName: branch.Branch_City || 'Unknown Branch',
      branchType: branch.Branch_City || 'Unknown Type',
      address: branch.Branch_Name || 'No address available',
      city: branch.Branch_Longitude || 'Unknown City',
    }));
  };

  // Fallback static data
  const staticBranchData: BranchData[] = [
    {
      id: '1',
      branchName: 'tum',
      branchType: 'Head Office',
      address: 'Main Office Location',
      city: 'Karachi',
    },
    {
      id: '2',
      branchName: 'Lahore',
      branchType: 'Main Branch (TRICON) - LHR',
      address: 'Main Branch Location',
      city: 'Lahore',
    },
    {
      id: '3',
      branchName: 'Lahore',
      branchType: '03 Branch',
      address: 'Branch Location',
      city: 'Lahore',
    },
  ];

  // Use API data if available, otherwise use static data
  const displayData = branches.length > 0 ? formatBranchData(branches) : staticBranchData;

  console.log('📊 Current state:');
  console.log('   - isLoading:', isLoading);
  console.log('   - branches count:', branches.length);
  console.log('   - displayData count:', displayData.length);

  const renderBranchItem = ({ item }: { item: BranchData }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <View style={styles.leftSection}>
          <View style={styles.branchNameContainer}>
            <View style={styles.branchNameCard}>
              <Text style={styles.branchNameText}>{item.branchName}</Text>
            </View>
          </View>
          <View style={styles.addressSection}>
            <Icon name="location-on" size={15} color="#666" style={styles.locationIcon} />
            <Text style={styles.addressText} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('📞 Call button pressed for branch:', item.id);
              onCall?.(item.id);
            }}
          >
            <Icon name="phone" size={15} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('🗺️ Direction button pressed for branch:', item.id);
              onDirection?.(item.id);
            }}
          >
            <Icon name="directions" size={15} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        {isLoading ? 'Loading branches...' : 'No branches found'}
      </Text>
      {!isLoading && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            console.log('🔄 Retry button pressed');
            fetchBranches();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('⬅️ Back button pressed');
            if (onBack) {
              onBack();
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Network</Text>
        {/* <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => {
            console.log('🔄 Refresh button pressed');
            fetchBranches();
          }}
        >
          <Icon name="refresh" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={displayData}
        renderItem={renderBranchItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={fetchBranches}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F7FD',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  branchNameContainer: {
    marginBottom: 12,
  },
  branchNameCard: {
    backgroundColor: '#7D2518',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  branchNameText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF1F7',
    marginHorizontal: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7D2518',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NetworkScreen;