import { createRouter, createWebHistory } from 'vue-router'
// import QRDashboard from '../components/QRDashboard.vue';
import NewDashboard from '../components/NewDashboard.vue';
import QRScan from '../components/QRScan.vue';

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
    }
  ]
})

export default router
