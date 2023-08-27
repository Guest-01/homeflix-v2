// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { pb } from '@/lib/pb'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      },
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  if (to.name === 'Login' && pb.authStore.isValid) return { name: 'Home' };
  else if (to.name !== 'Login' && to.name !== 'Signup' && to.name !== 'Home' && !pb.authStore.isValid) return { name: 'Login', query: { redirect: to.fullPath } };
  else return true;
})

export default router
