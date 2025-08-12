import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Rate } from '../type';

interface RatesBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface RatesBottomSheetProps {
  rates: Rate[];
  isForBuying: boolean;
  onRateSelect: (rate: Rate) => void;
  isLoading: boolean;
}

const RatesBottomSheet = forwardRef<RatesBottomSheetRef, RatesBottomSheetProps>(
  ({ rates, isForBuying, onRateSelect, isLoading }, ref) => {
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRates, setFilteredRates] = useState<Rate[]>(rates);

    useEffect(() => {
      if (rates && rates.length > 0) {
        setFilteredRates(rates);
      }
    }, [rates]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setVisible(true);
        setFilteredRates(rates || []);
        setSearchQuery('');
      },
      close: () => setVisible(false),
    }));

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      
      if (!rates || rates.length === 0) {
        setFilteredRates([]);
        return;
      }

      if (query.trim() === '') {
        setFilteredRates(rates);
        return;
      }

      const filtered = rates.filter((rate) => {
        const currency = rate.currency?.toLowerCase() || '';
        const countryName = rate.countryName?.toLowerCase() || '';
        const searchTerm = query.toLowerCase().trim();
        
        return currency.includes(searchTerm) || countryName.includes(searchTerm);
      });
      
      setFilteredRates(filtered);
    };

    const handleRatePress = (rate: Rate) => {
      onRateSelect(rate);
      setVisible(false);
    };

    const formatNumber = (num: number) => {
      return num?.toFixed(2) || '0.00';
    };

    const renderRateItem = ({ item }: { item: Rate }) => {
      return (
        <TouchableOpacity
          style={styles.rateItem}
          onPress={() => handleRatePress(item)}
          activeOpacity={0.7}>
          <View style={styles.rateItemContent}>
            <Image 
              source={{ uri: item.imagePath }} 
              style={styles.flagImage}
              defaultSource={{ uri: 'https://via.placeholder.com/32x32/cccccc/000000?text=?' }}
            />
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{item.currency || 'N/A'}</Text>
              <Text style={styles.countryName}>{item.countryName || 'Unknown'}</Text>
            </View>
            <View style={styles.rateInfo}>
              {isForBuying ? (
                <View style={styles.rateContainer}>
                  <View style={[styles.rateBadge, styles.buyingBadge]}>
                    <Text style={styles.rateBadgeText}>Buying</Text>
                  </View>
                  <Text style={styles.rateValue}>
                    {formatNumber(item.buyRate)}
                  </Text>
                </View>
              ) : (
                <View style={styles.rateContainer}>
                  <View style={[styles.rateBadge, styles.sellingBadge]}>
                    <Text style={styles.rateBadgeText}>Selling</Text>
                  </View>
                  <Text style={styles.rateValue}>
                    {formatNumber(item.sellRate)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Currency Rates</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
              activeOpacity={0.7}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search currency..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#333" />
              <Text style={styles.loadingText}>Loading currencies...</Text>
            </View>
          ) : filteredRates.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? 'No results found' : 'No currencies available'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRates}
              renderItem={renderRateItem}
              keyExtractor={(item) => item.id}
              style={styles.ratesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#F5F7FD',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  ratesList: {
    flex: 1,
  },
  rateItem: {
    backgroundColor: '#ffffff',
    marginBottom: 1,
  },
  rateItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  flagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#F5F7FD',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  countryName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rateInfo: {
    alignItems: 'flex-end',
  },
  rateContainer: {
    alignItems: 'center',
  },
  rateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  buyingBadge: {
    backgroundColor: '#4CAF50',
  },
  sellingBadge: {
    backgroundColor: '#2196F3',
  },
  rateBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  rateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
});

RatesBottomSheet.displayName = 'RatesBottomSheet';

export default RatesBottomSheet;