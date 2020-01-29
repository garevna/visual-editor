import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import(/* webpackChunkName: "articles" */ '../views/Blog.vue'),
  },
  {
    path: '/blog/news',
    name: 'news',
    component: () => import(/* webpackChunkName: "news" */ '../views/BlogNews.vue'),
  },
  {
    path: '/addresses',
    name: 'addresses',
    component: () => import(/* webpackChunkName: "addresses" */ '../views/MapAddresses.vue'),
  },
  {
    path: '/polygons',
    name: 'polygons',
    component: () => import(/* webpackChunkName: "polygons" */ '../views/MapPolygons.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import(/* webpackChunkName: "faq" */ '../views/Faq.vue'),
  },
  {
    path: '/content',
    name: 'content',
    component: () => import(/* webpackChunkName: "content" */ '../views/SiteContent.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
