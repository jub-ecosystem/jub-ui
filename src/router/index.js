import { createRouter, createWebHistory } from 'vue-router'
import MuyalView from "../views/Muyal.vue";
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'muyal',
      component: MuyalView
    },
    {
      path: '/services/nez',
      name: 'nez',
      component: () => import('../views/Nez.vue')
    },
    {
      path: '/services/chimalli',
      name: 'chimalli',
      component: () => import('../views/Chimalli.vue')
    },
    {
      path: '/services/painal',
      name: 'painal',
      component: () => import('../views/Painal.vue')
    },
    {
      path: '/services/xelhua',
      name: 'xelhua',
      component: () => import('../views/Xelhua.vue')
    },
    {
      path: '/services/alwa',
      name: 'alwa',
      component: () => import('../views/Alwa.vue')
    },
    {
      path: '/resources/publications',
      name: 'resources-publications',
      component: () => import('../views/Publications.vue')
    },
    {
      path: '/resources/workshops',
      name: 'resources-workshops',
      component: () => import('../views/Workshops.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/use-case/cancer',
      name: 'use-case-1',
      component: () => import('../views/UseCase1.vue')
    },
    {
      path: '/use-case/diabetes',
      name: 'use-case-2',
      component: () => import('../views/UseCase2.vue')
    },
    {
      path: '/use-case/mortality',
      name: 'use-case-3',
      component: () => import('../views/UseCase3.vue')
    },
    {
      path: '/oca',
      name: 'oca',
      component: () => import('../views/ocas/OCA.vue')
    },
    {
      path: '/oca-rnc',
      name: 'oca-rnc',
      component: () => import('../views/ocas/OCA_RNC.vue')
    },
    {
      path:'/observatories/',
      name:"observatory-index",
      component: ()=>import("../views/observatories/Index.vue")
    },
    {
      path:'/observatories/language',
      name:"observatory_lang",
      component: ()=>import("../views/observatories/Searcher.vue")
    },
    {
      path:'/observatories/:observatory_id/products/:product_id',
      name:"product_detail",
      component: ()=>import("../views/observatories/ProductDetail.vue")
    },
    {
      path:'/observatories/:observatory_id',
      name:"observatory",
      component: ()=>import("../views/observatories/ObservatoryDetail.vue")
    },
    {
      path:'/mictlanx',
      name:"mictlanx-index",
      component: ()=>import("../views/mictlanx/Index.vue")
    }, 
    {
      path:"/oca/v2",
      name:"ocav2",
      component: ()=>import("../views/observatories/v2/Index.vue")
    },
    {
      path:"/oca/panels/:observatory_id",
      name:"oca_panels",
      component: ()=>import("../views/observatories/v2/Panels.vue")
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0,  behavior: 'smooth',}
  },
})


router.beforeEach((to,from)=>{
    document.body.classList.remove('prevent-scroll')
    
});

export default router
