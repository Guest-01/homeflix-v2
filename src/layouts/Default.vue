<template>
  <v-app-bar>
    <v-app-bar-title>Homeflix v2</v-app-bar-title>

    <template #append>
      <v-btn v-if="authStore.isLogin" class="d-none d-sm-flex" variant="flat" color="primary" rounded
        :to="{ name: 'Login' }">로그인</v-btn>
      <v-btn v-else class="d-none d-sm-flex" variant="flat" color="primary" rounded @click="authStore.logout">로그아웃</v-btn>
      <!-- <v-divider vertical inset class="mx-2" /> -->
      <!-- <v-btn variant="flat" color="secondary" rounded>회원가입</v-btn> -->
      <v-app-bar-nav-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" disable-resize-watcher>
    <v-list>
      <v-list-item title="Drawer left"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth'

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    return { authStore }
  },
  data() {
    return {
      drawer: false,
    }
  }
})
</script>

<style scoped></style>