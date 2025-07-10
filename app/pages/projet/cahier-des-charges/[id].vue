<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash-es'

// --- Récupération route ---
const route = useRoute()

// --- Variables ---
const projet = ref(null)
const cahierDesChargesRaw = ref(null)
const dataJson = ref<Record<string, any> | null>(null)
const saveMessage = ref('')  // <-- ajout pour message de sauvegarde

const { user } = useUser()
const userId = computed(() => user.value?.id || null)


// --- Fonction fetch ---
async function fetchData() {
  projet.value = await $fetch(`/api/projet/${route.params.id}`)
  cahierDesChargesRaw.value = await $fetch(`/api/cahier-des-charges/${route.params.id}`)
  if (cahierDesChargesRaw.value?.data_json) {
    try {
      dataJson.value = JSON.parse(cahierDesChargesRaw.value.data_json)
    } catch {
      dataJson.value = {}
    }
  } else {
    dataJson.value = {}
  }
}
await fetchData()

function toLocalISOString(date: Date) {
  const tzoffset = date.getTimezoneOffset() * 60000 // décalage en ms
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, -1)
}

// --- Autosave avec debounce ---
const autosave = debounce(async () => {
  if (!dataJson.value || !userId.value) return

  try {
    await $fetch(`/api/cahier-des-charges/${route.params.id}`, {
      method: 'PATCH',
      body: {
        data_json: JSON.stringify(dataJson.value),
        last_saved_at: toLocalISOString(new Date()),
        userId_save: userId.value
      }
    })
    saveMessage.value = 'Sauvegardé ✓'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  } catch (e) {
    saveMessage.value = 'Erreur lors de la sauvegarde'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  }
}, 1000)

// --- Watch profond sur dataJson ---
watch(dataJson, () => {
  autosave()
}, { deep: true })
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto" v-if="projet && dataJson">
    <h2 class="text-xl font-bold mb-6">Projet : {{ projet.nom_projet || '—' }}</h2>

    <form class="space-y-4">
      <div v-for="(value, key) in dataJson" :key="key" class="flex flex-col">
        <label :for="key" class="font-semibold mb-1">{{ key }}</label>
        <input
          :id="key"
          type="text"
          v-model="dataJson[key]"
          class="border border-gray-300 rounded p-2"
          autocomplete="off"
        />
      </div>
    </form>
  </div>

  <div v-else class="p-4 max-w-3xl mx-auto">Chargement...</div>

<div
  v-if="saveMessage"
  class="fixed right-4 top-1/2 pointer-events-none"
  style="z-index: 9999; transform: translateY(-50%);"
>
  <div
    class="bg-green-600 text-white px-6 py-3 rounded shadow-lg font-semibold select-none pointer-events-auto"
  >
    {{ saveMessage }}
  </div>
</div>
</template>