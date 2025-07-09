<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

const username = ref('')
const password = ref('')
const user = ref(null) 
const tokenCookie = useCookie<string | null>('token') 
const token = ref(tokenCookie.value ?? null)

const login = async () => {
  const res = await $fetch('/api/login', {
    method: 'POST',
    body: { username: username.value, password: password.value }
  })
  token.value = res.token
  tokenCookie.value = res.token /
  await getMe()
}

const logout = async () => {
  await $fetch('/api/logout', { method: 'POST' })
  token.value = null
  if (tokenCookie) tokenCookie.value = null
  user.value = null
}

const getMe = async () => {
  try {
    user.value = await $fetch('/api/me', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
  } catch (e) {
    console.error(e)
    token.value = null
  }
}
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>

<div v-if="!token">
    <input v-model="username" placeholder="Nom d'utilisateur" />
  <input v-model="password" type="password" placeholder="Mot de passe" />
  <button @click="login">Connexion</button>
</div>

<div v-else>
  <button @click="getMe">Voir /me</button>
  <button @click="logout">Déconnexion</button>
  <pre>{{ user }}</pre>
</div>

      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
