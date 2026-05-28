export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  serviceKey: string;
  label: string;
  amountNgn: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmountNgn: number;
  status: OrderStatus;
  paymentRef?: string;
  relatedDocumentId?: string;
  relatedDocumentType?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreateOrderResponse {
  order: Order;
  paymentUrl: string;
  accessCode: string;
}
