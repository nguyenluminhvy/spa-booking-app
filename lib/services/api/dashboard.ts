import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'


export const _getOverview = async (params: any) => {
  try {
    const response = await request(Endpoint().getOverview, Method.GET, params, null)

    return response
  } catch (e) {
    return e
  }
}

export const _getRevenue = async (params: any) => {
  try {
    const response = await request(Endpoint().getRevenue, Method.GET, params, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _getBookings = async (params: any) => {
  try {
    const response = await request(Endpoint().getBookings, Method.GET, params, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _getStatus = async (params: any) => {
  try {
    const response = await request(Endpoint().getStatus, Method.GET, params, null)

    return response
  } catch (e) {
    return e
  }
}
