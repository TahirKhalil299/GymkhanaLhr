// app/types/index.ts
export interface Rate {
  id: string;
  currency: string;
  countryName: string;
  buyRate: number;
  sellRate: number;
  imagePath: string;
}

export interface DealAlert {
  from: string;
  to: string;
  rate: string;
  fromValue: string;
  toValue: string;
}