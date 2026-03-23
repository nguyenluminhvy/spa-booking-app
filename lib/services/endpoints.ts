
export default () => {
  const baseUrl = "http://localhost:3000"
  return {
    baseUrl,

    //auth
    signIn: `${baseUrl}/auth/login`,

    // walletDeleteAddress: (id: string) =>
    //   `${apiUrl}/wallet/withdraw/save-address/${id}`,

  }
}
