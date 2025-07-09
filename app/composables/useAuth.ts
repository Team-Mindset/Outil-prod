//Accès réactif au token + statut connecté/déconnecté.

export const useAuth = () => {
  const token = useCookie<string | null>('client_token')
  const isAuthenticated = computed(() => !!token.value)

  return { token, isAuthenticated }
}