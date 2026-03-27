
export default () => {
  const baseUrl = "http://localhost:3000"
  return {
    baseUrl,

    //auth
    signIn: `${baseUrl}/auth/login`,

    //service
    getServices: `${baseUrl}/services`,
    createService: `${baseUrl}/services/create`,
    getServiceDetails: (id: string) =>
      `${baseUrl}/services/${id}`,
    updateService: (id: string) =>
      `${baseUrl}/services/${id}`,

    // walletDeleteAddress: (id: string) =>
    //   `${apiUrl}/wallet/withdraw/save-address/${id}`,

  }
}
