// Utilities
import { defineStore } from 'pinia'
import { pb } from '@/lib/pb'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
  }),
  getters: {
    isLogin(): boolean {
      return Object.keys(this.user).length === 0; // user가 비었는지 확인
    }
  },
  actions: {
    async login(usernameOrEmail: string, password: string) {
      this.user = await pb.collection('users').authWithPassword(usernameOrEmail, password);
    },
    async logout() {
      await pb.authStore.clear();
      this.user = {};
    }
  }
})
