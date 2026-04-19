
export default () => {
  // const baseUrl = "http://localhost:3000"
  const baseUrl = "https://risk-fetch-ice.ngrok-free.dev"
  return {
    baseUrl,

    //auth
    signIn: `${baseUrl}/auth/login`,
    profile: `${baseUrl}/auth/profile`,
    signUp: `${baseUrl}/auth/register`,
    changePassword: `${baseUrl}/auth/change-password`,
    updateProfile: `${baseUrl}/auth/update-profile`,
    sentOTP: `${baseUrl}/auth/forgot-password`,
    confirmOTP: `${baseUrl}/auth/confirm-otp`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    saveDeviceToken: `${baseUrl}/auth/user/device-token`,

    //user
    users: `${baseUrl}/users`,
    staffs: `${baseUrl}/users/staffs`,
    createStaff: `${baseUrl}/users/staff/create`,
    activateUser: (id: string) =>
      `${baseUrl}/users/${id}/activate`,
    deactivateUser: (id: string) =>
      `${baseUrl}/users/${id}/deactivate`,
    getStaffInfo: (id: string) =>
      `${baseUrl}/users/staff/${id}`,
    updateStaff: (id: string) =>
      `${baseUrl}/users/staff/${id}`,
    resetPasswordStaff: (id: string) =>
      `${baseUrl}/users/staff/${id}/resetPassword`,

    //service
    getServices: `${baseUrl}/services`,
    createService: `${baseUrl}/services/create`,
    getServiceDetails: (id: string) =>
      `${baseUrl}/services/${id}`,
    updateService: (id: string) =>
      `${baseUrl}/services/${id}`,

    //appointment
    getAppointments: `${baseUrl}/appointments`,
    createAppointment: `${baseUrl}/appointments/create`,
    confirmAppointment: (id: string) =>
      `${baseUrl}/appointments/${id}/confirm`,
    cancelAppointment: (id: string) =>
      `${baseUrl}/appointments/${id}/cancel`,
    completeAppointment: (id: string) =>
      `${baseUrl}/appointments/${id}/complete`,
    assignStaff: (id: string) =>
      `${baseUrl}/appointments/${id}/assign`,
    getUpcomingAppointment: `${baseUrl}/appointments/upcoming`,
    getPastAppointment: `${baseUrl}/appointments/past`,

    //dashboard
    getOverview: `${baseUrl}/dashboard/overview`,
    getRevenue: `${baseUrl}/dashboard/revenue`,
    getBookings: `${baseUrl}/dashboard/bookings`,
    getStatus: `${baseUrl}/dashboard/status`,

    //reviews
    createReview: `${baseUrl}/reviews`,

    //notifications
    getNotifications: `${baseUrl}/notifications`,
    getUnreadNotificationsCount: `${baseUrl}/notifications/unread`,
    markAllNotificationsAsRead: `${baseUrl}/notifications/markAllAsRead`,
    markNotificationsAsRead: (id: string) =>
      `${baseUrl}/notifications/markAsRead/${id}`,
  }
}
