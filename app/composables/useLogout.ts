// composables/useLogout.ts
export const useLogout = () => {
  const { token } = useAuth()
  const tokenCookie = useCookie<string | null>('token')
  const user = useState('user')
  const router = useRouter()

  const logout = async () => {
    try {
      await $fetch('/api/logout', { method: 'POST' })
    } catch (e) {
      console.error('Erreur logout', e)
    }

    token.value = null
    tokenCookie.value = null
    user.value = null

    await router.push('/login')
  }

  return { logout }
}