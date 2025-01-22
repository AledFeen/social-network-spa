import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios';
import store from '../store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/email/verify/:link(.*)',
      name: 'verify',
      props: true,
      component: () => import('../views/VerifyView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot',
      component: () => import('../views/ForgotView.vue'),
    },
    {
      path: '/reset-password-page/:token',
      name: 'reset-password',
      props: true,
      component: () => import('../views/ResetPassView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/profile/:id',
      name: 'profile',
      props: true,
      component: () => import('../views/ProfileVue.vue'),
    },
    {
      path: '/edit-account',
      name: 'edit-account',
      component: () => import('../views/EditAccountView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  let token = store.getters.token;

  if ( token === undefined) { //token undefined after app restart
    await axios.get(store.getters.serverPath + '/api/checkAuth').then(res => {
      token = res.data.token
    }).catch(err => {
      console.log(err.response.data.message)
    })
  }

  console.log(store.getters.token)

  if (token === false) {
    if (to.name === 'login' || to.name === 'register' || to.name === 'forgot' || to.name === 'reset-password') {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    switch (to.name) {
      case 'login':
      case 'register':
        next({name: 'home'});
        break;
      default:
        next();
        break;
    }
  }

})

export default router
