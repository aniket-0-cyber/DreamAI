// src/sample-files/payment-utils.ts

interface PaymentDetails {
  amount: number;
  currency: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Mocks a payment processing request.
 * In a real application, this would interact with a payment gateway's API.
 * @param details The payment details.
 * @returns A promise that resolves with the payment response.
 */
export async function processPayment(details: PaymentDetails): Promise<PaymentResponse> {
  console.log('Processing payment for:', details.amount, details.currency);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock success or failure
  if (details.cardNumber.startsWith('4') && details.cvv.length === 3) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: 'Invalid card details or payment declined.',
    };
  }
} 