
export default () => {
  const baseUrl = "http://localhost:3000"
  return {
    baseUrl,

    //auth
    signIn: `${baseUrl}/auth/login`,
    profile: `${baseUrl}/auth/profile`,

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

    // getServiceDetails: (id: string) =>
    //   `${baseUrl}/services/${id}`,
    // updateService: (id: string) =>
    //   `${baseUrl}/services/${id}`,

    // walletDeleteAddress: (id: string) =>
    //   `${apiUrl}/wallet/withdraw/save-address/${id}`,

  }
}
