import { createRouter, createWebHistory } from 'vue-router'
import ExamList from '../views/ExamList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ExamList
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/Editor.vue')
    },
    {
      path: '/results/:id',
      name: 'results',
      component: () => import('../views/Results.vue')
    },
    {
      path: '/take/:id',
      name: 'take',
      component: () => import('../views/TakeExam.vue')
    }
  ]
})

export default router
