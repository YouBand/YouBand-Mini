import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/mainWindow/home/Index.vue'),
      redirect: '/home/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/mainWindow/home/Dashboard.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
