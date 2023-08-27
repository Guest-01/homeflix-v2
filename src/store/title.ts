// Utilities
import { defineStore } from 'pinia'
import { pb } from '@/lib/pb'
import { Record } from 'pocketbase';

export const useTitleStore = defineStore('title', {
  state: () => ({
    titles: [] as Record[],
  }),
  getters: {
  },
  actions: {
    /**
     * 모든 타이틀을 가져옵니다.
     */
    async getTitles() {
      const records = await pb.collection('titles').getFullList({
        sort: '-created',
      });
      this.titles = records;
    },
  }
})
