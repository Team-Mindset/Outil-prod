<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const { user } = useUser()

const open = ref(false)

const links = ref<NavigationMenuItem[][]>([
  [],
  []
])

watch(user, () => {
  links.value = [
    [
      {
        label: 'Dashboard',
        icon: 'i-lucide-house',
        to: '/',
        onSelect: () => {
          open.value = false
        }
      }
    ],
    [
      ...(user.value ? [{
        label: user.value.username || 'Mon profil',
        icon: 'i-lucide-user',
        to: '/me'
      }] : []),
      {
        label: 'Payfit',
        icon: 'i-lucide-message-circle',
        to: 'https://payfit.com/fr/',
        target: '_blank'
      },
      {
        label: 'NUXT',
        icon: 'i-lucide-info',
        to: 'https://github.com/nuxt-ui-pro/dashboard',
        target: '_blank'
      }
    ]
  ]
}, { immediate: true })
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      v-if="user"
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #default="{ collapsed }">
        <div class="p-4">
          <img src="/logo-long-blanc.png" alt="Logo" class="h-16 mx-auto mb-2" />
          <hr class="border-default" />
        </div>

        <UNavigationMenu
          v-if="links[0]?.length"
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          v-if="links[1]?.length"
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />
    <NotificationsSlideover />
  </UDashboardGroup>
</template>