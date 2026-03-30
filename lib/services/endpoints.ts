
export default () => {
  const baseUrl = "http://localhost:3000"
  return {
    baseUrl,

    //auth
    signIn: `${baseUrl}/auth/login`,
    profile: `${baseUrl}/auth/profile`,

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
    // getServiceDetails: (id: string) =>
    //   `${baseUrl}/services/${id}`,
    // updateService: (id: string) =>
    //   `${baseUrl}/services/${id}`,

    // walletDeleteAddress: (id: string) =>
    //   `${apiUrl}/wallet/withdraw/save-address/${id}`,

  }
}
