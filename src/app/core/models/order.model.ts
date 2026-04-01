export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  userId: string;
  serviceKey: string;
  documentId?: string; // e.g. CV ID or Cover Letter ID
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentReference?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
