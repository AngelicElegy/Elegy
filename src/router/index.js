import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Nav from '../pages/Nav.vue'
const routes = [
  {
    path: '',
    redirect: '/nav',
  },
  // 前台页面
  {
    path: '/nav',
    name: 'Nav',
    component: Nav,
  },
  // VR页面
  {
    path: '/vr',
    redirect: '/vr/home',
    //子路由
    children: [
      // 平价版(x)
      {
        path: 'afford',
        name: 'AffordRoom',
        component: () => import('../pages/AffordRoom'),
      },
      // 家庭版
      {
        path: 'home',
        name: 'HomeRoom',
        component: () => import('../pages/HomeRoom'),
      },
      // 豪华版
      {
        path: 'luxury',
        name: 'LuxuryRoom',
        component: () => import('../pages/LuxuryRoom'),
      },
      // 高级版
      {
        path: 'senior',
        name: 'SeniorRoom',
        component: () => import('../pages/SeniorRoom'),
      },
      // 简约版
      {
        path: 'simple',
        name: 'SimpleRoom',
        component: () => import('../pages/SimpleRoom'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router