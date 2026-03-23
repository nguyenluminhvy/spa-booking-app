import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const getServices = () => {
  return api.get("/services");
};

export const signInFn = async (data: any) => {
  try {
    const response = await request(Endpoint().signIn, Method.POST, data, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
