import {api, Method, request} from "@/lib/services/axios";
import Endpoint from '@/lib/services/endpoints'

export const _getNotifications = async (query?: any) => {
  try {
    const response = await request(Endpoint().getNotifications, Method.GET, query, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};
export const _getUnreadCount = async (query?: any) => {
  try {
    const response = await request(Endpoint().getUnreadNotificationsCount, Method.GET, query, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
};

export const _markAllNotificationAsRead = async () => {
  try {
    const response = await request(Endpoint().markAllNotificationsAsRead, Method.POST, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}

export const _markNotificationAsRead = async (id: any) => {
  try {
    const response = await request(Endpoint().markNotificationsAsRead(id), Method.POST, null, null)

    return response?.code === 0 ? response?.data : response
  } catch (e) {
    return e
  }
}
