<template>
  <v-container fluid>
    <v-row justify="center" class="mt-1">
      <v-card width="400" max-width="95%">
        <v-card-title class="text-center">로그인</v-card-title>
        <v-card-subtitle class="text-center">
          아이디 또는 이메일로 로그인
        </v-card-subtitle>
        <v-card-text>
          <v-form v-model="isValid" @submit.prevent="handleLogin">
            <v-container fluid>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="username" autocomplete="username" label="아이디" hide-details="auto"
                    variant="outlined" autofocus density="compact" prepend-inner-icon="mdi-email"
                    :rules="[rules.isRequired]" @input="clearErrMsg" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="pw" :type="showPw ? 'text' : 'password'" autocomplete="current-password"
                    label="비밀번호" hide-details="auto" variant="outlined" density="compact" prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPw = !showPw"
                    :rules="[rules.isRequired]" @input="clearErrMsg" />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-btn type="submit" block color="primary" :loading="loading">로그인</v-btn>
                </v-col>
              </v-row>
              <v-row v-if="errMsg">
                <v-col class="text-error">{{ errMsg }}</v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import rules from '@/utils/validations';
import { ClientResponseError } from "pocketbase"
import { pb } from '@/lib/pb'

export default defineComponent({
  setup() {
    return { rules, pb }
  },
  data() {
    return {
      isValid: null,
      username: "",
      pw: "",

      showPw: false,
      loading: false,

      errMsg: "" as string,
    }
  },
  methods: {
    async handleLogin() {
      if (!this.isValid) return;
      this.loading = true;
      try {
        await pb.collection('users').authWithPassword(this.username, this.pw);
        // 왔던 곳으로 되돌려 보내기
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect as string);
        } else {
          this.$router.replace({ name: 'Home' });
        }
      } catch (error) {
        if (error instanceof ClientResponseError) {
          this.errMsg = error.message;
        } else {
          this.errMsg = '알 수 없는 오류입니다';
          throw error
        }
      } finally {
        this.loading = false;
      }
    },
    clearErrMsg() {
      this.errMsg = '';
    }
  }
})
</script>

<style scoped></style>