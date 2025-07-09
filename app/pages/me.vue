<script setup lang="ts">
const { user } = useUser()
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Profil utilisateur" />
    </template>

    <template #body>
      <div v-if="user">
        <h2 class="text-xl font-bold mb-4">Informations de l'utilisateur</h2>
        <p><strong>Nom d'utilisateur :</strong> {{ user.username }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
      </div>
      <div v-else>
        <p>Non connecté.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>