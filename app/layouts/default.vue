
<style>
.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px; /* largeur par défaut du sidebar Nuxt UI */
  z-index: 50;
}
</style>
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
      },
       {
        label: 'Cahier des charges',
        icon: 'i-lucide-house',
        to: '/projet',
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
  <UDashboardGroup unit="rem" class="fixed inset-0 flex overflow-y-auto h-screen">
   <client-only>
  <UDashboardSidebar
  v-if="user"
  id="default"
  v-model:open="open"
  collapsible
  resizable
  class="sidebar-fixed bg-elevated/25 overflow-y-auto h-screen"
  :ui="{ footer: 'lg:border-t lg:border-default' }"
>
      <template #default="{ collapsed }">
        <div class="p-4">
          <img src="/images/logo-long-blanc.png" alt="Logo" class="h-16 mx-auto mb-2" />
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
   </client-only>

   <div class="flex-1 pl-[280px]">
     <slot />
     <NotificationsSlideover />
   </div>
  </UDashboardGroup>
</template>