export interface IOrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IOrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface IOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderSummary {
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface ICheckoutOrderPayload {
  customer: IOrderCustomer;
  shippingAddress: IOrderShippingAddress;
  items: IOrderItem[];
  summary: IOrderSummary;
}

export interface ICheckoutOrderResponse {
  orderId: string;
  status: "success";
}
