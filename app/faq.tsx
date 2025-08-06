// FAQScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface FAQModel {
  id: number;
  question: string;
  answer: string;
}

interface FAQItemProps {
  item: FAQModel;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ item, index, isExpanded, onToggle }) => {
  const animatedHeight = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => onToggle(index)}
        activeOpacity={0.7}
      >
        <View style={styles.questionRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.expandIcon}>
              {isExpanded ? '−' : '+'}
            </Text>
          </View>
          <Text style={styles.questionText} numberOfLines={2}>
            {item.question}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.answerContainer,
          {
            opacity: animatedHeight,
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust based on your content
            }),
          }
        ]}
      >
        {isExpanded && (
          <View style={styles.answerContent}>
            <View style={styles.divider} />
            <Text style={styles.answerText}>
              {item.answer}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const FAQScreen: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0); // First item expanded by default
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const faqData: FAQModel[] = [
    {
      id: 1,
      question: "Can I send money to my loved ones through Exchange?",
      answer: "Yes, Demo Exchange offers remittance services to send money to your loved ones both domestically and internationally. You can use our mobile app, visit a branch, or use our website for these transactions."
    },
    {
      id: 2,
      question: "What are the requirements for inward remittances?",
      answer: "For inward remittances, you need a valid ID, the transaction reference number provided by the sender, and you may need to complete a purpose of remittance form for amounts above certain thresholds per SBP regulations."
    },
    {
      id: 3,
      question: "Can my family members conduct transactions on my behalf?",
      answer: "Yes, family members can conduct transactions on your behalf with proper authorization. They will need to provide their ID, your ID copy, and an authorization letter. For regular arrangements, you can set up standing instructions at your branch."
    },
    {
      id: 4,
      question: "How can I find the best exchange rate at Demo Exchange?",
      answer: "You can check current exchange rates on our mobile app, website, or by calling our customer service. We update our rates daily based on market conditions and offer competitive rates for all major currencies."
    },
    {
      id: 5,
      question: "What steps should I take to avoid illegal exchange agents?",
      answer: "Always use authorized exchange services like Demo Exchange, verify the agent's credentials, ask for proper receipts, check if rates are reasonable compared to market rates, and report suspicious activities to the relevant authorities."
    },
    {
      id: 6,
      question: "Can I make deposits or withdraw foreign currency from my account?",
      answer: "Yes, Demo Exchange allows customers to deposit foreign currency into their accounts and withdraw it as needed, subject to SBP regulations."
    },
    {
      id: 7,
      question: "Is biometric verification mandatory for outward remittance?",
      answer: "Yes, as per State Bank of Pakistan regulations, biometric verification is mandatory for outward remittances to ensure security and prevent fraud. This verification can be completed at any Demo Exchange branch."
    },
    {
      id: 8,
      question: "How can I locate the nearest Demo Exchange branch?",
      answer: "You can locate the nearest branch through our mobile app's branch locator feature, on our website under the 'Network' section, or by calling our customer service helpline for assistance."
    }
  ];

  const handleToggleExpand = (index: number): void => {
    if (expandedIndex === index) {
      setExpandedIndex(-1); // Collapse if already expanded
    } else {
      setExpandedIndex(index);
    }
  };

  const handleGoBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
        <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.title}>FAQs</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* FAQ List */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {faqData.map((item: FAQModel, index: number) => (
          <FAQItem
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={handleToggleExpand}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#374151',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  questionContainer: {
    padding: 16,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
  answerContainer: {
    overflow: 'hidden',
  },
  answerContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  divider: {
    width: 3,
    backgroundColor: '#2563EB',
    marginLeft: 10,
    marginRight: 16,
    borderRadius: 2,
    minHeight: 20,
  },
  answerText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontWeight: '400',
  },
});

export default FAQScreen;