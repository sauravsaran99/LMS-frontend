export interface Customer {
  id: number;
  name: string;
  phone: string;
}

export interface Test {
  id: number;
  name: string;
  price: number;
}

export interface DiscountPreview {
  original_amount: number;
  discount_amount: number;
  final_amount: number;
}
