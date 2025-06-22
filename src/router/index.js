import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
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
    }
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
