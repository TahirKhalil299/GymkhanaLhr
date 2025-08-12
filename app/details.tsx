import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNPrint from "react-native-print";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_CREDENTIALS } from '../src/api/constants';
import { Deal } from '../src/api/models/DealListResponse';

interface RouteParams {
  dealData?: string; // Make it optional to handle undefined case
}

const DealPrintScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const getLogoSource = () => {
    switch (API_CREDENTIALS.currencyExchangeName) {
      case API_CREDENTIALS.EXCHANGE_NAMES.BANK_OF_PUNJAB:
        return require('../assets/images/logo_bopex.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.ALLIED:
        return require('../assets/images/logo_allied_2.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.ASKARI:
        return require('../assets/images/logo_askari.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.AL_HABIB:
        return require('../assets/images/logo_al_habib.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.FAYSAL:
        return require('../assets/images/logo_faysal.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.HABIB_QATAR:
        return require('../assets/images/logo_habib_qatar.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.LINK:
        return require('../assets/images/logo_link.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.MCB:
        return require('../assets/images/logo_mcb.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.MEEZAN:
        return require('../assets/images/logo_meezan.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.SADIQ:
        return require('../assets/images/logo_sadiq.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.UNION:
        return require('../assets/images/logo_union.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.ZEEQUE:
        return require('../assets/images/logo_zeeque.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.RECL:
        return require('../assets/images/logo_recl.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.TECL:
        return require('../assets/images/logo_tecl.png');
      case API_CREDENTIALS.EXCHANGE_NAMES.DEMO:
        return require('../assets/images/logo_demo.png');
      default:
        return require('../assets/images/logo.png');
    }
  };

  // Parse the JSON string back to object
  const routeParams = route.params as RouteParams;
  let dealData: Deal = {} as Deal;

  try {
    if (routeParams?.dealData) {
      dealData = JSON.parse(routeParams.dealData);
      console.log("Parsed deal data:", dealData); // Debug log
    } else {
      console.error("No deal data received in route params");
      Alert.alert("Error", "No deal data received");
    }
  } catch (error) {
    console.error("Error parsing deal data:", error);
    Alert.alert("Error", "Invalid deal data received");
  }

  const [isGenerating, setIsGenerating] = useState(false);

  // Helper functions
  const formatDateString = (dateString: string | undefined): string => {
    if (!dateString || dateString.trim() === "") return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatNumber = (numString: string | undefined): string => {
    if (!numString || numString.trim() === "") return "0.00";
    try {
      const num = parseFloat(numString);
      if (isNaN(num)) return numString;
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return numString;
    }
  };

  const orNA = (value: string | undefined): string => {
    if (value === undefined || value === null || value.toString().trim() === "") {
      return "N/A";
    }
    return value.toString().trim();
  };

  // Get deal values based on type
  const getDealValues = () => {
    console.log("Getting deal values for ROTypeID:", dealData?.ROTypeID);

    if (dealData?.ROTypeID === "7") {
      const values = {
        currency: orNA(dealData?.PayIN_CurrID),
        amount: formatNumber(dealData?.PayIN_Amt),
        rate: formatNumber(dealData?.PayIN_Rate),
        pkrAmount: formatNumber(dealData?.PayIN_PKR),
      };
      console.log("PayIN values:", values);
      return values;
    } else {
      const values = {
        currency: orNA(dealData?.PayOut_CurrID),
        amount: formatNumber(dealData?.PayOut_Amt),
        rate: formatNumber(dealData?.PayOut_Rate),
        pkrAmount: formatNumber(dealData?.PayOut_PKR),
      };
      console.log("PayOut values:", values);
      return values;
    }
  };

  const dealValues = getDealValues();

  // Generate HTML for PDF
const generateHTML = (): string => {
  const currentDate = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Deal Report - ${orNA(dealData?.Deal_No)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          font-size: 12px;
          line-height: 1.4;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #ccc;
          padding-bottom: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        .company-info {
          flex: 1;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #661706;
          margin-bottom: 5px;
        }
        .company-details {
          color: #666;
          margin-bottom: 3px;
        }
        .form-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .form-table td {
          border: 1px solid #ccc;
          padding: 8px;
          vertical-align: top;
        }
        .form-table .label {
          background-color: #f9f9f9;
          font-weight: normal;
          width: 25%;
          font-size: 10px;
        }
        .form-table .value {
          font-weight: bold;
          width: 75%;
          font-size: 10px;
        }
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .transaction-table th,
        .transaction-table td {
          border: 1px solid #000;
          padding: 10px;
          text-align: center;
        }
        .transaction-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
          padding: 0 20px;
        }
        .signature-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 30%;
        }
        .signature-box {
          width: 100%;
          height: 80px;
          border: 1px solid #000;
          margin-bottom: 10px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 10px;
        }
        .signature-label {
          text-align: center;
          font-size: 12px;
          font-weight: bold;
        }
        .prepared-by {
          font-size: 12px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin: 20px 0 10px 0;
        }
      </style>
    </head>
    <body>
      <!-- Rest of the HTML remains the same until signatures section -->

      <div class="section-title">Signatures</div>
      <div class="signatures">
        <div class="signature-container">
          <div class="signature-box">
            <span class="prepared-by">${orNA(dealData?.U_S)}</span>
          </div>
          <div class="signature-label">Prepared By</div>
        </div>
        
        <div class="signature-container">
          <div class="signature-box"></div>
          <div class="signature-label">Authorized Signature</div>
        </div>
        
        <div class="signature-container">
          <div class="signature-box"></div>
          <div class="signature-label">Customer Signature</div>
          ${dealData?.Party_Name ? `<div class="signature-label">${orNA(dealData.Party_Name)}</div>` : ''}
        </div>
      </div>

      <div class="footer">
        Generated: ${currentDate}
      </div>
    </body>
    </html>
  `;
};

  // Request storage permissions
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to storage to save PDF files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Show success dialog
  const showSuccessDialog = (filePath: string, onOpen: () => void) => {
    Alert.alert(
      "Congratulations!",
      `Report PDF downloaded successfully!\n\nSaved to: ${filePath}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: onOpen },
      ],
      { cancelable: false }
    );
  };

  // Download PDF function
  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to save PDF files"
        );
        return;
      }

      const options = {
        html: generateHTML(),
        fileName: `Deal_Report_${dealData?.Deal_No || "Unknown"}_${Date.now()}`,
        directory: "Downloads",
        base64: false,
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      if (pdf.filePath) {
        showSuccessDialog(pdf.filePath, () => {
          // RNPrint.print({ filePath: pdf.filePath })
          //   .catch((error) => {
          //     console.log('Error opening PDF:', error);
          //     Alert.alert('Error', 'Unable to open PDF file');
          //   });
        });
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert("Error", `Failed to create PDF: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Print function
  const handlePrint = async () => {
    try {
      setIsGenerating(true);

      const options = {
        html: generateHTML(),
        fileName: `Deal_Report_${dealData?.Deal_No || "Unknown"}`,
        directory: "Cache",
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      if (pdf.filePath) {
        await RNPrint.print({ filePath: pdf.filePath });
      }
    } catch (error) {
      console.error("Print Error:", error);
      Alert.alert("Error", `Failed to print: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Debug: Show current data in console
  React.useEffect(() => {
    console.log("Current dealData:", dealData);
    console.log("Sample values:");
    console.log("Deal_No:", dealData?.Deal_No);
    console.log("Comp_FName:", dealData?.Comp_FName);
    console.log("PayIN_CurrID:", dealData?.PayIN_CurrID);
    console.log("PayOut_CurrID:", dealData?.PayOut_CurrID);
  }, [dealData]);

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-gray-100 shadow-md shadow-black/20">
        <TouchableOpacity onPress={handleBackPress} className="p-2">
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-800 text-center mr-8">
          Deal Details
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        {/* Company Header */}
        <View className="flex-row bg-white p-4 rounded-lg mb-4 shadow-md shadow-black/20">
          <Image 
            source={getLogoSource()} 
            className="w-16 h-16 mr-4" 
            resizeMode="contain" 
          />
          <View className="flex-1">
            <Text className="text-lg font-bold text-[#661706] mb-1">
              {orNA(dealData?.Comp_FName)}
            </Text>
            <Text className="text-xs text-gray-600 mb-0.5">
              {`${orNA(dealData?.Branch_Address1)} ${orNA(dealData?.Branch_City)} ${orNA(dealData?.Branch_Country)}`.trim()}
            </Text>
            <Text className="text-xs text-gray-600 mb-0.5">
              Tel: {orNA(dealData?.Branch_Tel1)}
            </Text>
            <Text className="text-xs text-gray-600 mb-0.5">
              Fax: {orNA(dealData?.Branch_Fax1)}
            </Text>
            <Text className="text-sm font-semibold text-gray-800 mt-1">
              {orNA(dealData?.Branch_SName)}
            </Text>
          </View>
        </View>

        {/* Deal Details Form */}
        <View className="bg-white rounded-lg mb-4 shadow-md shadow-black/20">
          {[
            {
              label: "Deal Date:",
              value: formatDateString(dealData?.Deal_Date),
            },
            { label: "Deal No:", value: orNA(dealData?.Deal_No) },
            { label: "Customer Type:", value: orNA(dealData?.CTypeD) },
            { label: "Name:", value: orNA(dealData?.EX_Company) },
            { label: "Email ID:", value: orNA(dealData?.Party_Email) },
            { label: "Address:", value: orNA(dealData?.Party_Address1) },
            { label: "City:", value: orNA(dealData?.Party_City) },
            { label: "Country:", value: orNA(dealData?.Party_Country) },
            {
              label: "Special Instructions:",
              value: orNA(dealData?.Party_Deal_Remarks),
            },
            { label: "Transaction Type:", value: orNA(dealData?.ROTypeDD) },
            { label: "Settlement:", value: orNA(dealData?.StlD) },
            {
              label: "Bank Account:",
              value: orNA(dealData?.DetailCodeDescription),
            },
            {
              label: "Delivery From:",
              value: `${orNA(dealData?.Delivery_Branch_SName)} , ${orNA(dealData?.Delivery_Branch_Code)}`,
            },
            { label: "Delivery At:", value: orNA(dealData?.Delivery_At) },
          ].map((item, index) => (
            <View
              key={index}
              className="flex-row border-b border-gray-200 py-3 px-4"
            >
              <Text className="flex-1 text-xs text-gray-600 font-medium">
                {item.label}
              </Text>
              <Text className="flex-2 text-xs text-gray-800 font-semibold">
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Transaction Table */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md shadow-black/20">
          <Text className="text-base font-bold text-gray-800 mb-3">
            Transaction Details
          </Text>
          <View className="border border-gray-300">
            <View className="flex-row bg-gray-100">
              <Text className="flex-1 text-xs font-bold text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                Foreign Currency
              </Text>
              <Text className="flex-1 text-xs font-bold text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                Currency Amount
              </Text>
              <Text className="flex-1 text-xs font-bold text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                Exchange Rate
              </Text>
              <Text className="flex-1 text-xs font-bold text-gray-800 text-center py-2 px-1">
                Value in PKR
              </Text>
            </View>
            <View className="flex-row bg-white">
              <Text className="flex-1 text-[10px] text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                {dealValues.currency}
              </Text>
              <Text className="flex-1 text-[10px] text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                {dealValues.amount}
              </Text>
              <Text className="flex-1 text-[10px] text-gray-800 text-center py-2 px-1 border-r border-gray-300">
                {dealValues.rate}
              </Text>
              <Text className="flex-1 text-[10px] text-gray-800 text-center py-2 px-1">
                {dealValues.pkrAmount}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row px-4 py-4 bg-gray-100 gap-3">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
            isGenerating ? "bg-button_background/80" : "bg-button_background"
          }`}
          onPress={handleDownload}
          disabled={isGenerating}
        >
          <Icon name="file-download" size={20} color="white" />
          <Text className="text-button_text text-base font-bold ml-2">
            {isGenerating ? "Generating..." : "Download"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-lg bg-button_background"
          onPress={handlePrint}
          disabled={isGenerating}
        >
          <Icon name="print" size={20} color="white" />
          <Text className="text-button_text text-base font-bold ml-2">
            Print
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DealPrintScreen;