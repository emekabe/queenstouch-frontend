export interface CreateOrderRequest {
  serviceKeys: string[];
  relatedDocumentId?: string;
  relatedDocumentType?: string;
}

export interface UpdatePricingRequest {
  minPrice: number;
  maxPrice?: number;
}
