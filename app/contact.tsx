import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Contact = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePhoneCall = () => {
    Linking.openURL('tel:111-222-222');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:test@gmail.com');
  };

  const handleGetInTouch = () => {
    Alert.alert('Get in Touch', 'Contact form or action goes here!');
  };

  const handleSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact US</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <Text style={styles.subtitle}>We&apos;re just a call, email or a visit away!</Text>

          {/* Phone */}
          <TouchableOpacity style={styles.contactItem} onPress={handlePhoneCall}>
            <Icon name="phone" size={20} color="#666" style={styles.contactIcon} />
            <Text style={styles.contactText}>111-222-222</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Icon name="email" size={20} color="#666" style={styles.contactIcon} />
            <Text style={styles.contactText}>test@gmail.com</Text>
          </TouchableOpacity>

          {/* Address */}
          <View style={styles.contactItem}>
            <Icon name="location-on" size={20} color="#666" style={styles.contactIcon} />
            <Text style={styles.contactText}>Dha phase 2,Lahore</Text>
          </View>

          {/* Get in Touch Button */}
          <TouchableOpacity style={styles.getInTouchButton} onPress={handleGetInTouch}>
            <Text style={styles.getInTouchText}>Get in Touch</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Social Media</Text>

          {/* Facebook */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://www.facebook.com/p/Soft-Consulta...')}
          >
            <Icon name="facebook" size={20} color="#666" style={styles.socialIcon} />
            <Text style={styles.socialText}>https://www.facebook.com/p/Soft-Consulta...</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://www.instagram.com/soft.consultants/')}
          >
            <Icon name="camera-alt" size={20} color="#666" style={styles.socialIcon} />
            <Text style={styles.socialText}>https://www.instagram.com/soft.consultants/</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://www.linkedin.com/company/soft-con...')}
          >
            <Icon name="business" size={20} color="#666" style={styles.socialIcon} />
            <Text style={styles.socialText}>https://www.linkedin.com/company/soft-con...</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  getInTouchButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  getInTouchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default Contact;