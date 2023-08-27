# Homeflix v2

> Self-hosted Netflix

이 문서는 Vue2를 이용해 만들었던 homeflix-v1을 Vue3를 이용해 다시 개발하면서 생긴 일들을 기록하기 위해 존재합니다.

## 개발 환경

Homeflix v2는 Vue3를 중심으로 아래 스택으로 구성할 예정입니다.

- Build Tool: Vite
- State Management: Pinia (Vuex 대체)
- Router: Vue Router v4 (v3 대체)
- UI Library: Vuetify v3 (v2 대체)

따라서 프로젝트 셋업은 Vuetify 3 도큐먼트에 나와있는 `yarn create` 명령어를 이용할 것입니다.


> 💡 [https://vuetifyjs.com/en/getting-started/installation/#installation](https://vuetifyjs.com/en/getting-started/installation/#installation)

또한 백엔드는 셀프 호스팅이 가능한 [pocketbase](https://pocketbase.io/)를 이용할 것입니다. 그리고 CSR 방식으로 포켓베이스의 public 디렉토리에 배포할 계획입니다.

## 개발 내역

1. [Auth](https://www.notion.so/Homeflix-v2-ede904c4c16c45a1acc678a8f72480c2?pvs=21)
2. [Notice](https://www.notion.so/Homeflix-v2-ede904c4c16c45a1acc678a8f72480c2?pvs=21)
3. [Titles & Videos](https://www.notion.so/Homeflix-v2-ede904c4c16c45a1acc678a8f72480c2?pvs=21)

### 1. Auth

- pocketbase 기본 User 테이블의 필드 중, `username`은 사실 아이디를 의미하고, `name`은 닉네임을 의미한다. 따라서 `name` 필드를 헷갈리지 않게 `nickname`으로 변경한다.
- Node 17 버전 미만은 pocketbase SDK를 사용할 때 fetch polyfill이 필요하다고 한다. ([링크](https://github.com/pocketbase/js-sdk#nodejs-via-npm))
- Typescript에서 try/catch를 할 때, error는 `unknown` 타입이기 때문에 string 변수에 할당할 수 없다. 다행히 pocketbase에서는 미리 정의된 Error 클래스를 제공하기 때문에 타입가드를 통해 해결할 수 있었다. 참고로, Interface는 컴파일되면 없어지기 때문에 (Javascript 문법이 아님) 이런 상황에 사용할 수 없다. ([링크](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BB%A4%EC%8A%A4%ED%85%80-Error-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0))
    
    ```tsx
    import { ClientResponseError } from "pocketbase"
    
    try {
      await this.authStore.login(this.username, this.pw);
    } catch (error) {
      if (error instanceof ClientResponseError) { // type guard
        this.errMsg = error.message;
      } else {
        throw error
      }
    }
    ```
    
- Login Form의 username과 password 칸에는 `autocomplete` 속성을 넣어주는 것을 권장한다고 함. (넣지 않은 경우 chrome에서 개발자 도구를 열면 warning이 나온다) 이 속성을 이용해서 비밀번호 자동 저장을 하는 것으로 추정.
- 아래 다른 기능들은 pinia에 스토어를 만들어서 관리하나, Auth 기능만큼은 `pb.authStore`가 이미 제공되기 때문에 이것을 사용한다.

### 2. Notice

- `Notice` 모델 클래스나 인터페이스를 만들어도 되지만, 일단 pocketbase에서 제공하는 `Record` 클래스를 이용해도 된다.
    
    ```tsx
    import { Record } from 'pocketbase';
    
    export const useNoticeStore = defineStore('notice', {
      state: () => ({
        notices: [] as Record[],
        currentNotice: {} as Record,
      }),
    // ... 후략
    ```
    
- Vuetify 3에서 `v-data-table`이 Labs 소속으로 아직 alpha 단계이기 때문에 대신 `v-table`을 사용하였다. `v-table`은 일반적인 html 테이블처럼 `th`, `tr`, `td` 등을 이용해야 한다. 데이터 테이블처럼 최대한 범용적으로 쓸 수 있게 해보려고 했는데, 그냥 `NoticeTable.vue` 라고 이름 짓고 공지사항 테이블의 요구사항에만 맞추었다.
- Prop은 Typescript를 쓰지 않아도 원래 타입을 지정할 수 있었다. 여기에 Typescript까지 더하려는 경우 아래와 같이 `as` 키워드를 사용하면 더 구체적인 타입을 지정할 수 있다.
    
    ```tsx
    props: {
      items: Array as any,
    },
    ```
    

### 3. Titles & Videos

- 영화를 제외하면 보통 여러 에피소드(회차)로 되어있는 시리즈이므로 2개의 테이블이 필요하다. 제목과 포스터 등이 있는 `Titles` 테이블과 실제 비디오파일이 있는 `Videos` 테이블을 만들었다.
- `Titles` 테이블에는 나중에 필요할진 모르겠지만, 영화와 같은 단일 비디오 타이틀인지 시리즈물인지를 구분하는 boolean 필드, `is_series`를 만들어두었다.
- `Videos` 테이블에는 해당 에피소드의 방영일자를 의미하는 Datetime 필드가 하나 있는데, Pocketbase 어드민에서는 무조건 UTC 시간을 기준으로 입력할 수 있어서 조금 번거롭다. 또한 날짜만 입력하는게 아니라 시간까지 입력해야한다. 이때 아침 9시 정도로 입력하면 시차를 고려했을 때 날짜가 동일하기 때문에 기억할 것.
- 바뀌지 않을 이미지 등은 `public/` 쪽에 넣으면 문자열로 바로 참조시킬 수 있다. `asset/`에 넣으면 한번 import를 해와야함. 다만 asset쪽은 이름이 같더라도 내용이 바뀌면 빌드할 때 캐시를 자동으로 무마시켜주는 장점이 있다. 포스터가 없는 경우에 표시할 `no-image-placeholder.png` 를 public쪽에 넣어주었다.
- 현재 보고 있는 영상이 있는 페이지의 URL을 고유하게 만들기 위해 (즉, 다른 곳에서 URL만 눌러서 특정 영상 페이지로 진입할 수 있도록) router 설정에 아래와 같이 param을 넣어주었다. 두 개의 route는 모두 같은 `Play.vue` 페이지를 렌더하는데, `videoId`가 없는 경우에는 가장 최신 에피소드를 play하도록 한다.
    
    ```tsx
    // ...생략
    {
      path: 'play/:titleId',
      name: 'Title',
      component: () => import(/* webpackChunkName: "play" */ '@/views/Play.vue'),
    },
    {
      path: 'play/:titleId/:videoId',
      name: 'Episode',
      component: () => import(/* webpackChunkName: "play" */ '@/views/Play.vue'),
    },
    ```
    
- 영상 아래에는 설명 카드가 있는데, 제목이나 조회수, 방영일자 외에도 영상에 대한 간략한 프롤로그가 적혀있다. 그런데 프롤로그가 보통 길기 때문에 카드를 눌렀을 때 펼쳐 보이게했으며, 유튜브 등에서 보면 보통 설명란을 `...(더보기)` 등으로 축약해놓은 걸 따라해보았다.
- 이 설명이 DB에 html로 저장되어 있기 때문에(줄바꿈 등 서식째로 저장하기 위함) 먼저 html 태그에 넣고, `textContent` 혹은 `innerText`를 가져와서 특정 길이만큼만 잘라낸 뒤 `...(더보기)`를 붙여넣었다.
    
    ```tsx
    toShortPlainText(html: string) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      const text = tmp.textContent || tmp.innerText || ""; // 문자열만 추출
      return text.substring(0, 50) + "...(더보기)";
    },
    ```
    
- 로그인하지 않고 페이지에 진입할 경우에는 비디오를 보여주지 않아야하므로 vue-router의 Navigation Guard 기능을 통해 로그인 페이지로 리다이렉트 시킨다. 그리고 로그인을 하면 원래 보려던 페이지로 돌아오게 하기 위해, `query`를 이용하였다.
    
    ```tsx
    /* router/index.ts */
    router.beforeEach(async (to, from) => {
      if (to.name === 'Login' && pb.authStore.isValid) return { name: 'Home' };
      else if (to.name !== 'Login' && to.name !== 'Signup' && to.name !== 'Home' && !pb.authStore.isValid) return { name: 'Login', query: { redirect: to.fullPath } };
      else return true;
    })
    ```
    
    ```tsx
    /* Login.vue */
    if (this.$route.query.redirect) {
      this.$router.push(this.$route.query.redirect as string);
    } else {
      this.$router.replace({ name: 'Home' });
    }
    ```
    
- 다른 회차를 눌렀을 때 동일한 route에서 param만 바뀌므로, 페이지 이동 또는 컴포넌트 싸이클이 다시 돌지 않음. 그래서 내용이 업데이트 되지 않기 때문에, 아래와 같이 `watch`를 활용해야 함.
    
    ```tsx
    watch: {
      $route: "initData"  // url이 바뀌면 initData()를 다시 호출하라는 뜻
    },
    ```

(TODO: Search, Comments, SignUp...)
