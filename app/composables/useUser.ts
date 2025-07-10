// composables/useUser.ts
export const useUser = () => {
  const user = useState('user', () => null) // persisté dans le state Nuxt
  const { token } = useAuth()
  const tokenCookie = useCookie<string | null>('token')

  const getMe = async () => {
    if (!token.value) return
    try {
      user.value = await $fetch('/api/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } catch (e) {
      console.error('Erreur /me', e)
      token.value = null
      tokenCookie.value = null
      user.value = null
    }
  }

  watch(() => token.value, () => getMe(), { immediate: true })

return { user, getMe, refreshUser: getMe }}