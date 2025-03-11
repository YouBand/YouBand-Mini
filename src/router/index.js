import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/tray',
      name: 'tray',
      component: () => import('@/views/trayWindow/Tray.vue')
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
        },
        {
          path: 'robot',
          name: 'robot',
          component: () => import('@/views/mainWindow/home/Robot.vue')
        },
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@/views/mainWindow/home/Dashboard.vue')
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/mainWindow/home/Role.vue')
        },
        {
          path: 'model',
          name: 'model',
          component: () => import('@/views/mainWindow/home/Model.vue')
        },
        {
          path: 'set',
          name: 'set',
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
