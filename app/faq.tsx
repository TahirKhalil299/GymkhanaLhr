// FAQScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
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
    <View className="bg-white rounded-xl mb-3 shadow-sm shadow-black overflow-hidden">
      <TouchableOpacity
        className="p-4"
        onPress={() => onToggle(index)}
        activeOpacity={0.7}
      >
    <View className="flex-row items-start">
  <View className="w-6 h-6 rounded-full bg-gray-300 justify-center items-center mr-3 mt-0.5">
    <Text 
      className="text-base font-bold text-black"
      style={{ 
        lineHeight: 24, // Matches the circle height (h-6 = 24px)
        textAlignVertical: 'center' 
      }}
    >
      {isExpanded ? '−' : '+'}
    </Text>
  </View>
  <Text className="flex-1 text-sm font-semibold text-gray-800 leading-5" numberOfLines={2}>
    {item.question}
  </Text>
</View>
      </TouchableOpacity>
      
      <Animated.View 
        className="overflow-hidden"
        style={{
          opacity: animatedHeight,
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        }}
      >
        {isExpanded && (
          <View className="flex-row px-4 pb-4 pt-2">
            <View className="w-1 bg-button_background ml-2 mr-4 rounded-full min-h-5" />
            <Text className="flex-1 text-xs text-gray-500 leading-[18px] font-normal">
              {item.answer}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const FAQScreen: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
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
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleGoBack = (): void => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity 
          className="w-10 h-10 justify-center items-center rounded-lg"
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text className="text-lg font-bold text-gray-800 text-center">FAQs</Text>
        
        <View className="w-10" />
      </View>

      {/* FAQ List */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {faqData.map((item, index) => (
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

export default FAQScreen;