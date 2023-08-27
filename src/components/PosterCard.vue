<template>
  <v-card class="mx-2" width="200" :to="{ name: 'Title', params: { titleId: item.id } }">
    <v-img height="280" cover :src="posterURL" />
    <div class="pa-3">
      <div class="text-body-2 text-grey">{{ item.genre }}</div>
      <div>{{ item.title }}</div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { pb } from '@/lib/pb';

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      posterURL: "no-image-placeholder.png"
    }
  },
  created() {
    this.posterURL = this.getPosterURL();
  },
  methods: {
    getPosterURL() {
      // @ts-ignore
      return pb.files.getUrl(this.item, this.item.poster);
    }
  }
})
</script>

<style scoped></style>