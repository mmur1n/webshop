import type { ICheckoutOrderPayload, ICheckoutOrderResponse } from '@webshop/shared'
import { http } from './http'

export const ordersApi = {
  async submitOrder(payload: ICheckoutOrderPayload) {
    const { data } = await http.post<ICheckoutOrderResponse>('/orders', payload)

    return data
  },
}
