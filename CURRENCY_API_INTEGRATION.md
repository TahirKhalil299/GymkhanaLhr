# Currency Rates API Integration

## Overview
Integrated the currency rates API to fetch real-time currency data and display it in the horizontal card view. The API is called when the home screen becomes visible and displays only the first 4 currency rates.

## API Implementation

### 1. API Models
```typescript
// src/api/models/CurrencyRatesResponse.ts
export interface Rates {
  Currency: string;
  Buy_Rate: string;
  Sell_Rate: string;
  ImagePath: string;
  Curr_Country: string;
}

export interface CurrencyRatesResponse {
  Rates: Rates[];
}
```

### 2. API Constants
```typescript
// src/api/constants.ts
export const API_CREDENTIALS = {
  userId: "BOPEXA1",
  userPassword: "BOPExA1@712025",
  authToken: "BOpExA1547",
  customerCode: "10002"
};

export const ENDPOINTS = {
  CURRENCY: {
    GET_RATES: 'getCurrencyRates',
  },
  // ... other endpoints
};
```

### 3. API Service
```typescript
// src/api/ApiService.ts
export default class ApiService {
  async getCurrencyRates(listener?: ApiListener): Promise<CurrencyRatesResponse> {
    const queryParams = new URLSearchParams({
      userId: API_CREDENTIALS.userId,
      userPassword: API_CREDENTIALS.userPassword,
      authToken: API_CREDENTIALS.authToken,
      customerCode: API_CREDENTIALS.customerCode,
    });

    const response = await this.request(
      'get',
      `${ENDPOINTS.CURRENCY.GET_RATES}?${queryParams.toString()}`,
      undefined,
      RequestType.GET_RATE_LIST,
      listener
    );
    
    return response.data;
  }
}
```

## Home Screen Integration

### 1. State Management
```typescript
const [currencies, setCurrencies] = useState<Rates[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

### 2. API Call on Screen Mount
```typescript
useEffect(() => {
  console.log('Home screen mounted');
  checkAuthStatus();
  fetchCurrencyRates(); // API call when screen becomes visible
}, []);
```

### 3. Currency Rates Fetch Function
```typescript
const fetchCurrencyRates = () => {
  setIsLoading(true);
  const apiService = new ApiService();
  
  const listener: ApiListener = {
    onRequestStarted: () => {
      console.log('Currency rates request started');
    },
    onRequestSuccess: async (response, data, tag) => {
      try {
        const responseData = JSON.parse(data);
        
        if (responseData.Rates && Array.isArray(responseData.Rates)) {
          // Take only first 4 items as requested
          const firstFourRates = responseData.Rates.slice(0, 4);
          setCurrencies(firstFourRates);
        } else {
          setCurrencies([]);
        }
      } catch (error) {
        console.error('Error processing currency rates response:', error);
        setCurrencies([]);
      }
    },
    onRequestFailure: (error, message, errors, tag) => {
      console.log('Currency rates failed:', message);
      setCurrencies([]);
    },
    onRequestEnded: () => {
      setIsLoading(false);
    },
    onError: (response, message, tag) => {
      setCurrencies([]);
      setIsLoading(false);
    }
  };

  try {
    apiService.getCurrencyRates(listener);
  } catch (error) {
    setCurrencies([]);
    setIsLoading(false);
  }
};
```

### 4. Dynamic Card Rendering
```typescript
const renderCurrencyCard = ({ item }: { item: Rates }) => (
  <View style={styles.currencyCard}>
    <View style={styles.currencyHeader}>
      <Image
        source={{ uri: item.ImagePath }}
        style={styles.flagIcon}
        resizeMode="contain"
        defaultSource={require('../assets/images/uk_flag.png')}
      />
      <View style={styles.currencyTextContainer}>
        <Text style={styles.currencyCode}>{item.Currency}</Text>
        <Text style={styles.currencyName}>{item.Curr_Country}</Text>
      </View>
    </View>
    <View style={styles.ratesContainer}>
      <View style={styles.rateContainer}>
        <View style={styles.buyingHeader}>
          <Text style={styles.rateHeaderText}>Buying</Text>
        </View>
        <View style={styles.rateValueContainer}>
          <Text style={styles.rateValueText}>{item.Buy_Rate}</Text>
        </View>
      </View>
      <View style={styles.rateContainer}>
        <View style={styles.sellingHeader}>
          <Text style={styles.rateHeaderText}>Selling</Text>
        </View>
        <View style={styles.rateValueContainer}>
          <Text style={styles.rateValueText}>{item.Sell_Rate}</Text>
        </View>
      </View>
    </View>
  </View>
);
```

### 5. Loading and Error States
```typescript
{isLoading ? (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading currency rates...</Text>
  </View>
) : currencies.length > 0 ? (
  <FlatList
    // ... FlatList configuration
  />
) : (
  <View style={styles.noDataContainer}>
    <Text style={styles.noDataText}>No currency rates available</Text>
  </View>
)}
```

## Key Features

### 1. Real-time Data
- **API Integration**: Fetches currency rates from server
- **Dynamic Updates**: Shows real-time buy/sell rates
- **Error Handling**: Graceful handling of API failures

### 2. Limited Display
- **First 4 Items**: Shows only first 4 currency rates as requested
- **Auto-swipe**: Maintains auto-swipe functionality with real data
- **Manual Control**: Users can still manually swipe

### 3. Loading States
- **Loading Indicator**: Shows loading message while fetching data
- **Error States**: Shows error message if API fails
- **Empty States**: Shows message when no data available

### 4. Image Handling
- **Dynamic Images**: Uses ImagePath from API for currency flags
- **Fallback Image**: Uses default flag if API image fails to load
- **Proper Sizing**: Maintains consistent image sizing

## API Response Structure

### Expected Response
```json
{
  "Rates": [
    {
      "Currency": "USD",
      "Buy_Rate": "278.50",
      "Sell_Rate": "280.25",
      "ImagePath": "https://example.com/us-flag.png",
      "Curr_Country": "United States Dollar"
    },
    {
      "Currency": "EUR",
      "Buy_Rate": "335.00",
      "Sell_Rate": "337.85",
      "ImagePath": "https://example.com/eu-flag.png",
      "Curr_Country": "European E. Community"
    }
    // ... more rates
  ]
}
```

## Benefits

✅ **Real-time currency data**
✅ **Automatic API call on screen visibility**
✅ **Limited to first 4 items**
✅ **Proper loading and error states**
✅ **Dynamic image loading**
✅ **Maintains auto-swipe functionality**
✅ **Professional error handling**

The currency cards now display real-time data from the API with proper loading states and error handling. 