import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

interface Branch {
  id: string;
  name: string;
  city: string;
}

const SelectBranch: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  const [showPurposeModal, setShowPurposeModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const branches: Branch[] = [
    { id: "1", name: "G-11", city: "Islamabad" },
    { id: "2", name: "Lucky One Mall Branch", city: "Karachi" },
    { id: "3", name: "Faisal Town Lahore", city: "Lahore" },
    { id: "4", name: "Head Office", city: "Lahore" },
    { id: "5", name: "Model Town Branch", city: "Lahore" },
  ];

  const purposes = [
    "Personal Use",
    "Business Transaction",
    "Investment",
    "Travel",
    "Education",
    "Medical",
  ];

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchText.toLowerCase())
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
        {item.name}, {item.city}
      </Text>
    </TouchableOpacity>
  );

  const renderPurposeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="py-4 border-b border-gray-100"
      onPress={() => {
        setSelectedPurpose(item);
        setShowPurposeModal(false);
      }}
    >
      <Text className="text-base text-gray-800">{item}</Text>
    </TouchableOpacity>
  );

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
        {/* Progress indicator with circles and full connecting lines */}
        <View className="flex-row items-center mb-4">
          {/* First circle (filled) */}
          <View className="w-4 h-4 rounded-full bg-button_background" />

          {/* Full connecting line */}
          <View className="flex-1 h-1 bg-button_background mx-1" />

          {/* Second circle (outline) */}
          <View className="w-4 h-4 rounded-full bg-white border-2 border-button_background" />

          {/* Full connecting line */}
          <View className="flex-1 h-1 bg-button_background mx-1" />

          {/* Third circle (outline) */}
          <View className="w-4 h-4 rounded-full bg-white border-2 border-button_background" />

     

          
        </View>

        {/* Text labels - unchanged */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">From</Text>
            <Text className="text-sm font-semibold text-gray-800">
              45.00 USD
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">To</Text>
            <Text className="text-sm font-semibold text-gray-800">
              12568.75 PKR
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-1">Rate</Text>
            <Text className="text-sm font-semibold text-gray-800">279.75</Text>
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
            {selectedPurpose || "Select Purpose"}
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
              ? `${selectedBranch.name}, ${selectedBranch.city}`
              : "Select Branch"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-button_background rounded-lg py-2.5 items-center mt-5"
          onPress={() => {
            // Add your next screen navigation here
            console.log("Navigate to next screen");
            router.push("/postdeal");
          }}
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
              data={purposes}
              renderItem={renderPurposeItem}
              keyExtractor={(item, index) => index.toString()}
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
              keyExtractor={(item) => item.id}
              className="px-5"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectBranch;
