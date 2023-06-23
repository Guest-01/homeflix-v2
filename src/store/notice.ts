// Utilities
import { defineStore } from 'pinia'
import { pb } from '@/lib/pb'
import { Record } from 'pocketbase';

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    notices: [] as Record[],
    currentNotice: {} as Record,
  }),
  getters: {
  },
  actions: {
    /**
     * 최근 5개의 공지사항을 가져옵니다.
     */
    async getNotices() {
      const { items } = await pb.collection('notices').getList(1, 5, {
        sort: '-created',
      });
      this.notices = items;
    },
    async getNotice(id: string) {
      this.currentNotice = await pb.collection('notices').getOne(id);
    }
  }
})
