import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const _getOrCreateChatConversation = async () => {
  try {
    const response = await request(Endpoint().getOrCreateChatConversation, Method.POST, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};

export const _updateLastMessage = async (payload: any) => {
  try {
    const response = await request(Endpoint().updateLastMessage, Method.POST, payload, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};


export const _claimConversation = async (payload: any) => {
  try {
    const response = await request(Endpoint().claimConversation, Method.POST, payload, null)

    return response
  } catch (e) {
    return e
  }
};
