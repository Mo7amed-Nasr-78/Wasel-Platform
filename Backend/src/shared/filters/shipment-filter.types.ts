export interface ShipmentQueryParams {
  search?: string;
  type?: string;
  status?: string | string[];
  goodsType?: string;
  packaging?: string;
  budgetType?: string;
  paymentType?: string;
  minWeight?: number;
  maxWeight?: number;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  pickupAt?: string;
  deliveryAt?: string;
  urgent?: boolean;
  stacking?: boolean;
  additionalInsurance?: boolean;
  twoDrivers?: boolean;
  noFriday?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ShipmentFilterResult {
  where: Record<string, any>;
  orderBy: Record<string, any>;
  skip: number | undefined;
  take: number | undefined;
}
