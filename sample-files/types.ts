export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface Order {
  orderId: string;
  customerId: string;
  items: Product[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  preferredPayment: PaymentMethod;
} 