<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="8">
        <v-alert closable border="start" type="warning" density="compact" variant="tonal">
          본 사이트는 개발 학습 의도로 제작되었으며 실제 저작권 영상을 담고 있지 않습니다.
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" md="8">
        <div class="d-flex align-center mb-1">
          <v-icon start size="small" icon="mdi-history" />
          최근 업로드
        </div>
        <v-slide-group show-arrows>
          <v-slide-group-item v-for="item in titleStore.titles" :key="item.id">
            <PosterCard :item="item" />
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-1">
          <v-icon start size="small" icon="mdi-bell" />
          공지사항
        </div>
        <NoticeTable :items="noticeStore.notices" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNoticeStore } from '@/store/notice';
import { useTitleStore } from '@/store/title';
import NoticeTable from '@/components/NoticeTable.vue';
import PosterCard from '@/components/PosterCard.vue';

export default defineComponent({
  setup() {
    const noticeStore = useNoticeStore();
    const titleStore = useTitleStore();
    return { noticeStore, titleStore }
  },
  components: {
    NoticeTable,
    PosterCard
  },
  async mounted() {
    await this.noticeStore.getNotices();
    await this.titleStore.getTitles();
  }
})
</script>

<style scoped></style>