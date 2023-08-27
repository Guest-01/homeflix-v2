<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <video class="vid" :src="src" controls controlslist="nodownload" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card @click="showDesc = !showDesc" :ripple="false">
          <v-card-title>
            {{ currentVid?.expand.title.title }}
            <span v-if="currentVid?.episode !== 0" class="ml-2">
              {{ currentVid?.episode }}화
            </span>
          </v-card-title>
          <v-card-subtitle>
            조회수: {{ currentVid?.view_count }}회 | 방영일자:
            {{ currentVid?.on_air }}
          </v-card-subtitle>
          <v-card-text v-if="!showDesc">
            {{ toShortPlainText(currentVid?.expand.title.description) }}
          </v-card-text>
          <v-card-text v-else v-html="currentVid?.expand.title.description">
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-card-subtitle class="mt-4">전체 회차</v-card-subtitle>
          <v-card-text class="pt-0">
            <v-chip-group>
              <v-chip v-for="v in videoStore.videos" :key="v.id"
                :to="{ name: 'Episode', params: { titleId: currentVid?.expand.title.id, videoId: v.id } }">
                {{ v.episode }}화 {{ v.on_air }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVideoStore } from "@/store/video"

export default defineComponent({
  setup() {
    const videoStore = useVideoStore();
    return { videoStore }
  },
  data() {
    return {
      currentVid: null as any,
      showDesc: false,
      src: "",
    }
  },
  async created() {
    await this.initData();
  },
  // 다른 회차를 눌렀을 때, 동일한 route에 param만 달라지는거라 새로고침이 일어나지 않음
  // 따라서 watch에 route의 param이 바뀌면 다시 실행할 함수를 넣어줘야함
  watch: {
    $route: "initData"
  },
  methods: {
    async initData() {
      // 타이틀의 모든 비디오(에피소드)를 가져온다 (최대 200건이 기본값)
      await this.videoStore.getVideos(this.$route.params.titleId as string);

      // Title route -> 가장 최신 비디오, Episode route -> 해당 에피소드 비디오
      if (this.$route.name === 'Title') {
        this.currentVid = this.videoStore.videos[0];
      } else {
        this.currentVid = this.videoStore.videos.filter(el => el.id === this.$route.params.videoId)[0];
      }

      // 파일 URL 가져오기
      this.src = await this.videoStore.getVideoSrc(this.currentVid);

      // 조회수 1 증가시키기
      await this.videoStore.incrementViewCount(this.currentVid);
    },
    toShortPlainText(html: string) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      const text = tmp.textContent || tmp.innerText || "";
      return text.substring(0, 50) + "...(더보기)";
    }
  }
})
</script>

<style scoped>
.vid {
  height: 100%;
  width: 100%;
}
</style>