import { createRouter, createWebHistory } from 'vue-router'
// import QRDashboard from '../components/QRDashboard.vue';
import NewDashboard from '../components/NewDashboard.vue';
import QRScan from '../components/QRScan.vue';
import TheUserVue from '../components/TheUser.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewDashboard
    },
    {
      path: '/scan',
      name: 'scan',
      component: QRScan
    },
    {
      path: '/user',
      name: 'UserManagement',
      component: TheUserVue
    }
  ]
})

export default router
