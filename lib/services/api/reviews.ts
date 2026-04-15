import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'


export const _createReview = async (payload: any) => {
  try {
    const response = await request(Endpoint().createReview, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
