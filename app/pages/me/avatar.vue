<script setup lang="ts">
import { ref } from 'vue'

const { user, refreshUser } = useUser() 

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const avatarCacheBuster = ref(Date.now())

const currentAvatarUrl = computed(() =>
  (previewUrl.value ||
    (user.value?.avatarProd
      ? user.value.avatarProd.startsWith('/')
        ? user.value.avatarProd
        : '/' + user.value.avatarProd
      : '/default-avatar.png'
    )
  ) + '?v=' + avatarCacheBuster.value
)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    previewUrl.value = URL.createObjectURL(file.value)
  }
}

async function uploadAvatar() {
  if (!file.value) return
  const formData = new FormData()
  formData.append('avatar', file.value)
  try {
    await $fetch('/api/me/avatar', {
      method: 'POST',
      body: formData,
    })
    await refreshUser()
    avatarCacheBuster.value = Date.now()
    previewUrl.value = null
    file.value = null
    alert('Avatar mis à jour !')
  } catch (err) {
    alert('Erreur lors de l\'upload de l\'avatar.')
  }
}

function removePreview() {
  previewUrl.value = null
  file.value = null
}

await refreshUser()
user.value.avatarProd += '?v=' + Date.now()
</script>

<template>
  <UPageCard
    title="Changer l’avatar"
    description="Sélectionne une nouvelle image pour ton profil."
    variant="naked"
    class="max-w-md mx-auto"
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
        <img :src="currentAvatarUrl" alt="Avatar actuel" class="object-cover w-full h-full" />
      </div>
      <input
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
      />
      <button
        v-if="previewUrl"
        type="button"
        @click="removePreview"
        class="text-sm text-red-600 hover:underline"
      >Retirer l’image sélectionnée</button>
      <UButton
        label="Upload"
        color="primary"
        :disabled="!file"
        class="w-full"
        @click="uploadAvatar"
      />
    </div>
  </UPageCard>
</template>