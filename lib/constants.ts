export interface BankOffer {
  id: string;
  bank: string;
  type: "card" | "upi" | "netbanking";
  discount: number;
  description: string;
  minAmount?: number;
  code?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
  minAmount?: number;
}

export const coupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    description: "Get 10% off on your first order",
  },
];

export const bankOffers: BankOffer[] = [
  {
    id: "b1",
    bank: "HDFC Bank",
    type: "card",
    discount: 10,
    description: "10% instant discount on HDFC Credit Cards",
    minAmount: 1500,
    code: "HDFCCARD10",
  },
  {
    id: "b2",
    bank: "SBI",
    type: "card",
    discount: 5,
    description: "5% cashback on SBI Debit Cards",
    minAmount: 1000,
    code: "SBIDEBIT5",
  },
  {
    id: "b3",
    bank: "Paytm",
    type: "upi",
    discount: 50,
    description: "Flat ₹50 off on Paytm UPI",
    minAmount: 500,
    code: "PAYTMUPI50",
  },
  {
    id: "b4",
    bank: "PhonePe",
    type: "upi",
    discount: 100,
    description: "Get ₹100 cashback on PhonePe UPI",
    minAmount: 2000,
    code: "PHONEPE100",
  },
  {
    id: "b5",
    bank: "ICICI Bank",
    type: "netbanking",
    discount: 7.5,
    description: "7.5% off on ICICI Net Banking",
    minAmount: 3000,
    code: "ICICINET75",
  },
];
