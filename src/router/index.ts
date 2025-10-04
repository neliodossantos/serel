import { createRouter, createWebHistory } from 'vue-router'
import user from "@/router/user";
import company from "@/router/company";
import dashboard from "@/router/dashboard";
import {useUserStore} from "@/stores/users";

// Importações com Lazy Loading usando importação dinâmica
const HomeView = () => import('@/pages/Home.vue');
const NotFound = () => import("@/pages/error/NotFound.vue");
const Unauthorized = () => import("@/pages/error/Unauthorized.vue");
const ExpiredToken = () => import("@/pages/error/ExpiredToken.vue");
const Contact = () => import("@/pages/Contact.vue");
const Faq = () => import("@/pages/FAQ.vue");
const FilterCompany = () => import("@/pages/companies/FilterCompany.vue");
const About = () => import("@/pages/About.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/faq',
      name: 'faq',
      component: Faq
    },
    {
      path: '/filter',
      name: 'filter',
      component: FilterCompany
    },
    {
      path: '/:patchMatch(.*)*',
      name: 'not-found',
      component : NotFound
    },
    {
      path: '/not-authorized',
      name: 'unauthorized',
      component : Unauthorized
    },
    {
      path: '/expired-token',
      name: 'expired-token',
      component : ExpiredToken
    },
      ...user,
      ...company,
      ...dashboard
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticate = userStore.isLogged();
  const publicAuthRoutes = ['login', 'signup', 'forgotPassword', 'confirmAccount', 'resetPassword'];

  if (isAuthenticate) {
    const isValid = userStore.isValidToken();
    if (!isValid) {
      if (to.name !== 'expired-token' && to.name !== 'home' && !publicAuthRoutes.includes(<string>to.name)) {
        localStorage.setItem('redirect', to.fullPath);
        localStorage.removeItem('token');
        return next({ path: '/expired-token' } );
      }else if(to.name === 'home'){
        localStorage.removeItem('token');
        window.location.href = "/";
      }
      next();
    }
    if (publicAuthRoutes.includes(<string>to.name)) {
      return next({ name: 'home' });
    }
  }
  if (to.meta.requiresAuth && !isAuthenticate) {
    return next('/not-authorized');
  }
  next();
});

export default router
