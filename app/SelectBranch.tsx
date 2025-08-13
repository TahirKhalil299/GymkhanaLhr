import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../constants/theme";
import ApiService from '../src/api/ApiService';
import RequestType from '../src/api/RequestTypes';
import { ApiListener } from '../src/api/ServiceProvider';

interface Branch {
  Branch_Code: string;
  Branch_Name: string;
  Branch_City: string;
}

interface Purpose {
  ROID: string;
  ROD: string;
}

const SelectBranch = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [branchesList, setBranchesList] = useState<Branch[]>([]);
  const [purposeList, setPurposeList] = useState<Purpose[]>([]);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();

  // Convert string back to boolean
  const isBuyMode = params.isBuy === "true";

  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  const [showPurposeModal, setShowPurposeModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchBranches();
    fetchPurposeList();
  }, []);

  const fetchBranches = () => {
    setIsLoading(true);
    
    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('Branches request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('Branches request successful:', data);
        try {
          const responseData = JSON.parse(data);
          console.log('Parsed branches data:', responseData);
          
          if (responseData.data && responseData.data.DealBranches && Array.isArray(responseData.data.DealBranches)) {
            setBranchesList(responseData.data.DealBranches);
            console.log('Branches set:', responseData.data.DealBranches);
          } else {
            console.log('No branches data found in response');
            setBranchesList([]);
          }
        } catch (error) {
          console.error('Error processing branches response:', error);
          setBranchesList([]);
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('Branches request failed:', message);
        setBranchesList([]);
      },
      onRequestEnded: () => {
        console.log('Branches request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('Branches request error:', message);
        setBranchesList([]);
        setIsLoading(false);
      }
    };

    try {
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getBranchesName(),
        RequestType.GET_BRANCHES_NAME_LIST,
        listener
      );
    } catch (error) {
      console.error('Branches request error:', error);
      setBranchesList([]);
      setIsLoading(false);
    }
  };

  const fetchPurposeList = () => {
    setIsLoading(true);
    const roType = isBuyMode ? "7" : "8";
    
    const listener: ApiListener = {
      onRequestStarted: () => {
        console.log('Purpose request started');
      },
      onRequestSuccess: async (response, data, tag) => {
        console.log('Purpose request successful:', data);
        try {
          const responseData = JSON.parse(data);
          console.log('Parsed purpose data:', responseData);
          
          if (responseData.data && responseData.data.Province && Array.isArray(responseData.data.Province)) {
            setPurposeList(responseData.data.Province);
            console.log('Purpose set:', responseData.data.Province);
          } else {
            console.log('No purpose data found in response');
            setPurposeList([]);
          }
        } catch (error) {
          console.error('Error processing purpose response:', error);
          setPurposeList([]);
        }
      },
      onRequestFailure: (error, message, errors, tag) => {
        console.log('Purpose request failed:', message);
        setPurposeList([]);
      },
      onRequestEnded: () => {
        console.log('Purpose request ended');
        setIsLoading(false);
      },
      onError: (response, message, tag) => {
        console.log('Purpose request error:', message);
        setPurposeList([]);
        setIsLoading(false);
      }
    };

    try {
      const { serviceProvider } = require('../src/api/ServiceProvider');
      serviceProvider.sendApiCall(
        ApiService.getPurposeList("1",roType,"4"),
        RequestType.GET_PURPOSE_LIST,
        listener
      );
    } catch (error) {
      console.error('Purpose request error:', error);
      setPurposeList([]);
      setIsLoading(false);
    }
  };

  const filteredBranches = branchesList.filter(
    (branch) =>
      branch.Branch_Name.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.Branch_City.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBranchItem = ({ item }: { item: Branch }) => (
    <TouchableOpacity
      className="py-4 border-b border-gray-100"
      onPress={() => {
        setSelectedBranch(item);
        setShowBranchModal(false);
        setSearchText("");
      }}
    >
      <Text className="text-base text-gray-800">
        {item.Branch_Name}, {item.Branch_City}
      </Text>
    </TouchableOpacity>
  );

  const renderPurposeItem = ({ item }: { item: Purpose }) => (
    <TouchableOpacity
      className="py-4 border-b border-gray-100"
      onPress={() => {
        setSelectedPurpose(item);
        setShowPurposeModal(false);
      }}
    >
      <Text className="text-base text-gray-800">{item.ROD}</Text>
    </TouchableOpacity>
  );

  // const handleNextPress = async () => {
  //   if (!selectedBranch || !selectedPurpose) {
  //     Alert.alert("Error", "Please select both branch and purpose");
  //     return;
  //   }

  //   // Check if profile is complete (similar to Android implementation)
  //   const isProfileComplete = await AsyncStorage.getItem('profile_complete');
    
  //   if (isProfileComplete === 'false') {
  //     // Save data to AsyncStorage similar to Android's PreferenceManager
  //     await AsyncStorage.multiSet([
  //       ['branch_code', selectedBranch.Branch_Code],
  //       ['branch_name', selectedBranch.Branch_Name],
  //       ['branch_location', selectedBranch.Branch_City],
  //       ['purpose_id', selectedPurpose.ROID],
  //       ['purpose_name', selectedPurpose.ROD]
  //     ]);

  //     router.push({
  //       pathname: "/postdeal",
  //       params: {
  //         ...params,
  //         purpose_id: selectedPurpose.ROID,
  //         purpose_name: selectedPurpose.ROD,
  //         branch_code: selectedBranch.Branch_Code,
  //         branch_name: selectedBranch.Branch_Name,
  //         branch_city: selectedBranch.Branch_City,
  //         isBuy: params.isBuy
  //       }
  //     });
  //   } else {

  // await AsyncStorage.multiSet([
  //       ['branch_code', selectedBranch.Branch_Code],
  //       ['branch_name', selectedBranch.Branch_Name],
  //       ['branch_location', selectedBranch.Branch_City],
  //       ['purpose_id', selectedPurpose.ROID],
  //       ['purpose_name', selectedPurpose.ROD]
  //     ]);

  //     router.push({
  //       pathname: "/postdeal",
  //       params: {
  //         ...params,
  //         purpose_id: selectedPurpose.ROID,
  //         purpose_name: selectedPurpose.ROD,
  //         branch_code: selectedBranch.Branch_Code,
  //         branch_name: selectedBranch.Branch_Name,
  //         branch_city: selectedBranch.Branch_City,
  //         isBuy: params.isBuy
  //       }
  //     });
  //     // Alert.alert(
  //     //   "Alert!",
  //     //   "Please complete your profile first.",
  //     //   [
  //     //     {
  //     //       text: "OK",
  //     //       onPress: () => router.push("/profile")
  //     //     }
  //     //   ]
  //     // );
  //   }
  // };


const handleNextPress = async () => {
  if (!selectedBranch || !selectedPurpose) {
    Alert.alert("Error", "Please select both branch and purpose");
    return;
  }

  // Save data to AsyncStorage
  await AsyncStorage.multiSet([
    ['branch_code', selectedBranch.Branch_Code],
    ['branch_name', selectedBranch.Branch_Name],
    ['branch_location', selectedBranch.Branch_City],
    ['purpose_id', selectedPurpose.ROID],
    ['purpose_name', selectedPurpose.ROD]
  ]);

  // Prepare all params to pass to next screen
  const allParams = {
    ...params, // Spread existing params
    from_value: params.fromValue || "0.00",
    to_value: params.toValue || "0.00 PKR",
    rate_value: params.rateValue || "0.00",
    is_buy: params.isBuy,
    purpose_id: selectedPurpose.ROID,
    purpose_name: selectedPurpose.ROD,
    branch_code: selectedBranch.Branch_Code,
    branch_name: selectedBranch.Branch_Name,
    branch_city: selectedBranch.Branch_City
  };

  // Check if profile is complete
  const isProfileComplete = await AsyncStorage.getItem('profile_complete');
  
  if (isProfileComplete === 'false') {
    router.push({
      pathname: "/postdeal",
      params: allParams
    });
  } else {
    router.push({
      pathname: "/postdeal",
      params: allParams
    });
  }
};

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-gray-100">
        <TouchableOpacity
          className="w-6 h-6 justify-center items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Book a Deal</Text>
        <View className="w-6" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 py-5">
        <View className="flex-row items-center mb-4">
          <View className="w-4 h-4 rounded-full bg-button_background" />
          <View className="flex-1 h-1 bg-button_background mx-1" />
          <View className="w-4 h-4 rounded-full bg-white border-2 border-button_background" />
          <View className="flex-1 h-1 bg-button_background mx-1" />
          <View className="w-4 h-4 rounded-full bg-white border-2 border-button_background" />
        </View>

        {/* Dynamic values from params */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">From</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {params.fromValue || "0.00"}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">To</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {params.toValue || "0.00 PKR"}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">Rate</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {params.rateValue || "0.00"}
            </Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <View className="px-5 pt-5">
        {/* Select Purpose */}
        <TouchableOpacity
          className="flex-row items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-4 mb-4"
          onPress={() => setShowPurposeModal(true)}
        >
          <Text
            className={`text-base flex-1 ${
              selectedPurpose ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {selectedPurpose ? selectedPurpose.ROD : "Select Purpose"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Select Branch */}
        <TouchableOpacity
          className="flex-row items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-4 mb-4"
          onPress={() => setShowBranchModal(true)}
        >
          <Text
            className={`text-base flex-1 ${
              selectedBranch ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {selectedBranch
              ? `${selectedBranch.Branch_Name}, ${selectedBranch.Branch_City}`
              : "Select Branch"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-button_background rounded-lg py-2.5 items-center mt-5"
          onPress={handleNextPress}
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>

      {/* Purpose Modal */}
      <Modal
        visible={showPurposeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPurposeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl pt-5 max-h-4/5">
            <View className="flex-row items-center justify-between px-5 pb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Select Purpose
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                onPress={() => setShowPurposeModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={purposeList}
              renderItem={renderPurposeItem}
              keyExtractor={(item) => item.ROID}
              className="px-5"
            />
          </View>
        </View>
      </Modal>

      {/* Branch Modal */}
      <Modal
        visible={showBranchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowBranchModal(false);
          setSearchText("");
        }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl pt-5 max-h-4/5">
            <View className="flex-row items-center justify-between px-5 pb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Select Branch
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                onPress={() => {
                  setShowBranchModal(false);
                  setSearchText("");
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-lg mx-5 mb-4 px-3">
              <Ionicons name="search" size={20} color="#666" className="mr-2" />
              <TextInput
                className="flex-1 py-3 text-base text-gray-800"
                placeholder="Search branches..."
                selectionColor={AppColors.cursor_color}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={filteredBranches}
              renderItem={renderBranchItem}
              keyExtractor={(item) => item.Branch_Code}
              className="px-5"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectBranch;