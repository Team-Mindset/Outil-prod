<script setup lang="ts">
const username = ref('')
const password = ref('')
const tokenCookie = useCookie<string | null>('token')
const token = ref(tokenCookie.value ?? null)
const router = useRouter()

const login = async () => {
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    token.value = res.token
    tokenCookie.value = res.token
    // console.log('Token set:', token.value)

    await router.push('/')
  } catch (err) {
    console.error('Erreur de connexion :', err)
    alert('Échec de connexion')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-6 shadow rounded w-full max-w-md">
      <h1 class="text-2xl font-semibold mb-4">Connexion</h1>
      <input v-model="username" placeholder="Nom d'utilisateur" class="w-full p-2 border rounded mb-2" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="w-full p-2 border rounded mb-4" />
      <button @click="login" class="w-full bg-black text-white py-2 rounded">Connexion</button>
    </div>
  </div>
</template>