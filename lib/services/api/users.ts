import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'


export const _getUsers = async (params: any) => {
  try {
    const response = await request(Endpoint().users, Method.GET, params, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _getStaffs = async () => {
  try {
    const response = await request(Endpoint().staffs, Method.GET, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _deactivateUser = async (id: any) => {
  try {
    const response = await request(Endpoint().deactivateUser(id), Method.PATCH, null, null)

    return response
  } catch (e) {
    return e
  }
}

export const _activateUser = async (id: any) => {
  try {
    const response = await request(Endpoint().activateUser(id), Method.PATCH, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _createStaff = async (payload: any) => {
  try {
    const response = await request(Endpoint().createStaff, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _getStaffInfo = async (id: any) => {
  try {
    const response = await request(Endpoint().getStaffInfo(id), Method.GET, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _updateStaff = async (staffId: any, payload: any) => {
  try {
    const response = await request(Endpoint().updateStaff(staffId), Method.PATCH, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _resetPasswordStaff = async (staffId: any) => {
  try {
    const response = await request(Endpoint().resetPasswordStaff(staffId), Method.POST, null, null)

    return response
  } catch (e) {
    return e
  }
}
