import Vue from 'vue';
import VueRouter from 'vue-router';
import Scores from '@/views/Scores.vue';
import NotFound from '@/views/NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Scores',
    component: Scores,
  },
  {
    path: '/create',
    name: 'Create',
    // route level code-splitting
    // this generates a separate chunk (create.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "create" */ '@/views/Create.vue'),
  },
  {
    path: '/admin/:uuid',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
  },
  {
    path: '/scoreboard/:scoresId',
    name: 'Scoreboard',
    component: () => import(/* webpackChunkName: "scoreboard" */ '@/views/Scoreboard.vue'),
  },
  {
    path: '*',
    name: 'not found',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
