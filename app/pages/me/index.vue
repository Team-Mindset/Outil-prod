<template>
  <UPageCard title="Profil utilisateur" icon="mdi-account-circle">
     <client-only>
    <div v-if="user" class="user-profile">
      <div class="avatar">
        <img :src="user.avatarProd || '/uploads/default-avatar.png'" alt="Avatar" class="avatar-image" />
      </div>
      <div class="user-info">
        <p><strong>Nom :</strong> {{ user.nom }}</p>
        <p><strong>Prénom :</strong> {{ user.prenom }}</p>
        <p><strong>Nom d'utilisateur :</strong> {{ user.username }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Rang :</strong> {{ user.rang }}</p>
             <p><strong>Profil :</strong> {{ user.avatarProd }}</p>

      </div>
    </div>
    <div v-else>
      <p>Chargement...</p>
    </div>
    </client-only>
  </UPageCard>
</template>

<script setup>
const { user } = useUser()
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info p {
  margin: 0.25rem 0;
  font-size: 1rem;
}
</style>
