<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [
  [
    { label: 'Informations', icon: 'i-lucide-user', to: '/me' },
    { label: 'Avatar', icon: 'i-lucide-image', to: '/me/avatar' },
    { label: 'Statistiques', icon: 'i-lucide-bar-chart-2', to: '/me/stats' }
  ]
] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="flex-1" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <client-only>
        <NuxtPage />
      </client-only>
    </template>
  </UDashboardPanel>
</template>