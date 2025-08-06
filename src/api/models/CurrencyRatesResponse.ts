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