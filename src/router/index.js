import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "blog" */ '../views/BlogCards.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/BlogCards.vue'),
  },
  {
    path: '/blog/:article',
    name: 'article',
    component: () => import(/* webpackChunkName: "article" */ '../views/BlogArticle.vue'),
  },
  {
    path: '/blog/news',
    name: 'news',
    component: () => import(/* webpackChunkName: "media" */ '../views/BlogNews.vue'),
  },
  {
    path: '/blog/news/:article',
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
