<script setup lang="ts">
import { computed } from 'vue'
const { data: projets } = await useFetch('/api/projet')

const projetsArray = computed(() => {
  const data = projets.value
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.rows)) return data.rows
  return []
})

const projetsEnAttente = computed(() =>
  projetsArray.value.filter(p => (p.status || '').toLowerCase() === 'en attente')
)

function goToCahierDesCharges(id: number) {
  navigateTo(`/projet/cahier-des-charges/${id}`)
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-semibold mb-4">Projets en attente</h1>
    <table class="min-w-full border border-gray-300 rounded-md overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border-b border-gray-300 text-left">ID</th>
          <th class="p-2 border-b border-gray-300 text-left">Nom du projet</th>
          <th class="p-2 border-b border-gray-300 text-left">Domaine</th>
          <th class="p-2 border-b border-gray-300 text-left">Status</th>
          <th class="p-2 border-b border-gray-300 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projet in projetsEnAttente" :key="projet.id_projet" class="hover:bg-gray-50">
          <td class="p-2 border-b border-gray-300">{{ projet.id_projet }}</td>
          <td class="p-2 border-b border-gray-300">{{ projet.nom_projet }}</td>
          <td class="p-2 border-b border-gray-300">{{ projet.nom_domaine }}</td>
          <td class="p-2 border-b border-gray-300 capitalize">{{ projet.status }}</td>
          <td class="p-2 border-b border-gray-300">
            <button
              @click="goToCahierDesCharges(projet.id_projet)"
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Compléter
            </button>
          </td>
        </tr>
        <tr v-if="projetsEnAttente.length === 0">
          <td colspan="5" class="p-4 text-center text-gray-500">Aucun projet en attente</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>