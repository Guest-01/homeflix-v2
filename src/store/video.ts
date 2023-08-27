// Utilities
import { defineStore } from 'pinia'
import { pb } from '@/lib/pb'
import { Record } from 'pocketbase';

export const useVideoStore = defineStore('video', {
  state: () => ({
    videos: [] as Record[],
  }),
  getters: {
  },
  actions: {
    /**
     * 해당 타이틀의 비디오를 최신순으로 가져옵니다.
     * @param titleId 
     */
    async getVideos(titleId: string) {
      const result = await pb.collection("videos").getFullList({
        filter: `title="${titleId}"`,
        sort: "-on_air",
        expand: "title",
      });
      this.videos = result;
    },
    async getVideoSrc(currentVid: Record) {
      const token = await pb.files.getToken();
      return await pb.files.getUrl(currentVid, currentVid.video, { 'token': token });
    },
    async incrementViewCount(currentVid: Record) {
      await pb.collection("videos").update(currentVid.id, {
        view_count: currentVid.view_count + 1,
      })
    }
  }
})
