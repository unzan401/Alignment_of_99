import { createRouter, createWebHistory } from 'vue-router'
import index from '/views/Home.vue'
import admin from '/views/Admin.vue'
import api from '/views/Api.vue'

const routes = [
  {
    path: '/game/:time/',
    name: 'game',
    component: index
  },
  {
    path: '/game/:time/:user',
    name: 'gameUser',
    component: index
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin
  },
  {
    path: '/',
    name: 'index',
    component: admin
  },
  {
    path: '/api/',
    name: 'api',
    component: api
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
