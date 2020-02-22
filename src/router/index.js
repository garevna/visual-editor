import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "blog" */ '../views/BlogCards.vue'),
  },
  {
    path: '/posts',
    name: 'blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/BlogCards.vue'),
  },
  {
    path: '/posts/:article',
    name: 'article',
    component: () => import(/* webpackChunkName: "article" */ '../views/BlogArticle.vue'),
  },
  {
    path: '/dgtek-in-media',
    name: 'news',
    component: () => import(/* webpackChunkName: "media" */ '../views/BlogNews.vue'),
  },
  {
    path: '/dgtek-in-media/:article',
    name: 'newsArticle',
    component: () => import(/* webpackChunkName: "mediaArticle" */ '../views/NewsEditor.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
