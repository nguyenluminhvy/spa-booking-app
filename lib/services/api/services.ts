import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const getServices = async (query?: any) => {
  try {
    const response = await request(Endpoint().getServices, Method.GET, query, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};

export const getServiceDetail = async (serviceId: any) => {
  try {
    const response = await request(Endpoint().getServiceDetails(serviceId), Method.GET, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _createService = async (formData: any) => {
  try {
    const response = await request(Endpoint().createService, Method.POST, formData, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _updateService = async (serviceId: any, formData: any) => {
  try {
    const response = await request(Endpoint().updateService(serviceId), Method.PATCH, formData, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
