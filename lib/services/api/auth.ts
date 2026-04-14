import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const signInFn = async (data: any) => {
  try {
    const response = await request(Endpoint().signIn, Method.POST, data, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _getProfile = async () => {
  try {
    const response = await request(Endpoint().profile, Method.GET, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _signUp = async (data: any) => {
  try {
    const response = await request(Endpoint().signUp, Method.POST, data, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _updatePassword = async (data: any) => {
  try {
    const response = await request(Endpoint().changePassword, Method.PATCH, data, null)

    return response
  } catch (e) {
    return e
  }
}

export const _updateProfile = async (data: any) => {
  try {
    const response = await request(Endpoint().updateProfile, Method.PATCH, data, null)

    return response
  } catch (e) {
    return e
  }
}

export const _sendOTPResetPassword = async (data: any) => {
  try {
    const response = await request(Endpoint().sentOTP, Method.POST, data, null)

    return response
  } catch (e) {
    return e
  }
}

export const _confirmOTPResetPassword = async (data: any) => {
  try {
    const response = await request(Endpoint().confirmOTP, Method.POST, data, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _resetPassword = async (data: any) => {
  try {
    const response = await request(Endpoint().resetPassword, Method.POST, data, null)

    return response
  } catch (e) {
    return e
  }
}
