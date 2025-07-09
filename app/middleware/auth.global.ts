//Redirige vers /login si on n’est pas connecté.

export default defineNuxtRouteMiddleware((to) => {
const token = useCookie('client_token')
  // console.log('[Middleware] token.value =', token.value)

  if (to.path === '/login') return

  if (!token.value) {
    return navigateTo('/login')
  }
})