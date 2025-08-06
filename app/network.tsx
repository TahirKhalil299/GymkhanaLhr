import { useNavigation } from '@react-navigation/native'; // ✅ navigation hook
import React from 'react';
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
  const insets = useSafeAreaInsets();
    const navigation = useNavigation(); // ✅ useNavigation hook

  const branchData: BranchData[] = [
    {
      id: '1',
      branchName: 'Karachi',
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
              {item.branchType}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onCall?.(item.id)}
          >
            <Icon name="phone" size={15} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDirection?.(item.id)}
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
      <Text style={styles.emptyStateText}>No data found</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
            if (onBack) {
              onBack(); // If custom back handler is provided, call it
            } else {
              navigation.goBack(); // Otherwise use navigation goBack
            }
          }}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Network</Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={branchData}
        renderItem={renderBranchItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginRight: 40,
  },
  spacer: {
    width: 40,
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
  },
});

export default NetworkScreen;
