import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const _getCoupons = async (query?: any) => {
  try {
    const response = await request(Endpoint().getCoupons, Method.GET, query, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};

export const _getCouponDetail = async (voucherId: any) => {
  try {
    const response = await request(Endpoint().getCouponDetails(voucherId), Method.GET, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _validateCoupon = async (payload: any) => {
  try {
    const response = await request(Endpoint().validateCoupon, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _createCoupon = async (payload: any) => {
  try {
    const response = await request(Endpoint().createCoupon, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _updateCoupon = async (voucherId: any, payload: any) => {
  try {
    const response = await request(Endpoint().updateCoupon(voucherId), Method.PATCH, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _activateCoupon = async (id: any) => {
  try {
    const response = await request(Endpoint().activateCoupon(id), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _deactivateCoupon = async (id: any) => {
  try {
    const response = await request(Endpoint().deactivateCoupon(id), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
