<template>
  <div class="flex items-center gap-2 px-4">
    <UButton
      icon="i-lucide-log-out"
      size="sm"
      color="primary"
      @click="handleLogout"
      label="Déconnexion"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { token } = useAuth()
const tokenCookie = useCookie<string | null>('token')

const handleLogout = async () => {
  try {
    await $fetch('/api/logout', { method: 'POST' })
    token.value = null
    tokenCookie.value = null
    await router.push('/login')
  } catch (err) {
    console.error('Logout failed', err)
  }
}
</script>
