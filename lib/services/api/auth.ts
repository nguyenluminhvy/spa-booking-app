import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const signInFn = async (data: any) => {
  try {
    const response = await request(Endpoint().signIn, Method.POST, data, null, null)

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
