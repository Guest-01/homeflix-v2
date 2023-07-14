<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          제목
        </th>
        <th class="text-right">
          날짜
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items">
        <td class="notice-title" @click="openNoticeDetail(item.id)">{{ item.title }}</td>
        <td class="text-right">{{ item.updated }}</td>
      </tr>
    </tbody>
  </v-table>
  
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card :title="noticeStore.currentNotice.title" :subtitle="noticeStore.currentNotice.updated">
      <template #text>
        <div v-html="noticeStore.currentNotice.content"></div>
      </template>
      <template #actions>
        <v-spacer></v-spacer>
        <v-btn @click="isOpen = false" prepend-icon="mdi-close">닫기</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNoticeStore } from '@/store/notice';

export default defineComponent({
  setup() {
    const noticeStore = useNoticeStore();
    return { noticeStore }
  },
  props: {
    items: Array as any,
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    async openNoticeDetail(id: string) {
      await this.noticeStore.getNotice(id);
      this.isOpen = true;
    }
  }
})
</script>

<style scoped>
.notice-title {
  cursor: pointer;
}

.notice-title:hover {
  text-decoration: underline;
}
</style>