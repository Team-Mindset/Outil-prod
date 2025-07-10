<template>
  <UPageCard title="Projets" description="Gestion de vos projets" variant="naked" class="max-w-5xl mx-auto">
    <div class="flex space-x-2 mb-4">
      <NuxtLink to="/projet/en-attente" class="btn btn-primary">En attente</NuxtLink>
    </div>
    <NuxtPage />
  </UPageCard>
</template>