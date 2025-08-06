
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onBack?: () => void;
}

interface Announcement {
  id: string;
  date: string;
  title: string;
  description: string;
}

const mockData: Announcement[] = [
  {
    id: '1',
    date: '15 Apr 2025',
    title: 'New Branch is now open in Lahore',
    description: 'Visit our new branch at Liberty Market, Lahore for all your banking needs. Special offers available for n...',
  },
  {
    id: '2',
    date: '10 Apr 2025',
    title: 'Mobile Banking App Update Available',
    description: 'Download the latest version of our app for enhanced security features and improved user experience.',
  },
  {
    id: '3',
    date: '05 Apr 2025',
    title: 'Special Ramadan Banking Hours',
    description: 'During the holy month of Ramadan, our branches will operate from 9:00 AM to 3:00 PM on weekdays.',
  },
  {
    id: '4',
    date: '28 Mar 2025',
    title: 'QR Code Payment System Launched',
    description: 'Scan your QR Code and visit nearby Demo International Exchange location for hassle-free currency ex...',
  },
  {
    id: '5',
    date: '20 Mar 2025',
    title: 'Annual Interest Rates Updated',
    description: 'We have revised our interest rates for savings accounts and fixed deposits. Check our website for details.',
  },
];

const AnnouncementItem: React.FC<{ item: Announcement }> = ({ item }) => (
  <TouchableOpacity style={styles.announcementContainer} activeOpacity={0.7}>
    <View style={styles.announcementContent}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const NewsAnnouncementsScreen: React.FC<Props> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  const renderItem = ({ item }: { item: Announcement }) => (
    <AnnouncementItem item={item} />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FD" />
      
      {/* Header */}
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
          {  <Icon name="arrow-back" size={24} color="#000" />  /* <Ionicons name="chevron-back" size={24} color="#333" /> */}

                
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>News & Announcements</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {mockData.map((item, index) => (
          <View key={item.id}>
            <AnnouncementItem item={item} />
            {index < mockData.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F7FD',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  announcementContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  announcementContent: {
    flexDirection: 'row',
  },
  dateContainer: {
    justifyContent: 'flex-start',
    paddingTop: 2,
    minWidth: 85,
  },
  dateText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    fontWeight: '500',
  },
  divider: {
    width: 2,
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  separator: {
    height: 8,
  },
});

export default NewsAnnouncementsScreen;