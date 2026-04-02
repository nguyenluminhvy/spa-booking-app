import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const getAppointments = async (query?: any) => {
  try {
    const response = await request(Endpoint().getAppointments, Method.GET, query, null)

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

export const createAppointment = async (payload: any) => {
  try {
    const response = await request(Endpoint().createAppointment, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _confirmAppointment = async (appointmentId: any) => {
  try {
    const response = await request(Endpoint().confirmAppointment(appointmentId), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _cancelAppointment = async (appointmentId: any) => {
  try {
    const response = await request(Endpoint().cancelAppointment(appointmentId), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _completeAppointment = async (appointmentId: any) => {
  try {
    const response = await request(Endpoint().completeAppointment(appointmentId), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _assignStaff = async (appointmentId: any, body: any) => {
  try {
    const response = await request(Endpoint().assignStaff(appointmentId), Method.PATCH, body, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const updateService = async (serviceId: any, formData: any) => {
  try {
    const response = await request(Endpoint().updateService(serviceId), Method.PATCH, formData, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
