<template>
  <v-app-bar density="comfortable">
    <v-app-bar-title><a class="my-a" href="/">Homeflix v2</a></v-app-bar-title>

    <template #append>
      <v-btn v-if="!isLogin" class="d-none d-sm-flex" variant="flat" color="primary" rounded
        :to="{ name: 'Login' }">로그인</v-btn>
      <v-btn v-else class="d-none d-sm-flex" variant="flat" color="primary" rounded @click="handleLogout">로그아웃</v-btn>
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
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { pb } from "@/lib/pb"

export default defineComponent({
  setup() {
    const isLogin = ref(false);

    const unsub = pb.authStore.onChange((token, model) => {
      isLogin.value = model ? true : false;
    }, true);

    onBeforeUnmount(() => {
      unsub();
    })

    return { pb, isLogin }
  },
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
    async handleLogout() {
      await this.pb.authStore.clear();
      this.$router.push({ name: 'Login' });
    }
  }
})
</script>

<style scoped>
.my-a,
.my-a:visited {
  text-decoration: none;
  color: initial;
}
</style>