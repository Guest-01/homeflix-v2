<template>
  <v-container fluid>
    <v-row dense justify="center">
      <v-col cols="auto">
        <NoticeTable :items="noticeStore.notices" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNoticeStore } from '@/store/notice';
import NoticeTable from '@/components/NoticeTable.vue';

export default defineComponent({
  setup() {
    const noticeStore = useNoticeStore();
    return { noticeStore }
  },
  components: {
    NoticeTable,
  },
  async mounted() {
    await this.noticeStore.getNotices();
  }
})
</script>

<style scoped></style>