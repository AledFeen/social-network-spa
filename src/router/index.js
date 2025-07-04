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
      path: '/unverified',
      name: 'unverified',
      component: () => import('../views/UnverifiedView.vue'),
    },
    {
      path: '/banned',
      name: 'banned',
      component: () => import('../views/BannedView.vue'),
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
      path: '/profile/:username',
      name: 'profile',
      props: true,
      component: () => import('../views/ProfileVue.vue'),
    },
    {
      path: '/edit-account',
      name: 'edit-account',
      component: () => import('../views/EditAccountView.vue'),
    },
    {
      path: '/subscriptions/:id',
      name: 'subscriptions',
      props: true,
      component: () => import('../views/Subscriptions.vue'),
    },
    {
      path: '/subscribers/:id',
      name: 'subscribers',
      props: true,
      component: () => import('../views/Subscribers.vue'),
    },
    {
      path: '/sub-requests',
      name: 'sub-requests',
      component: () => import('../views/SubRequests.vue'),
    },
    {
      path: '/blocked-list',
      name: 'blocked-list',
      component: () => import('../views/BlockedList.vue'),
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/Notifications.vue'),
    },
    {
      path: '/post-likes/:id',
      name: 'post-likes',
      props: true,
      component: () => import('../views/PostLikes.vue'),
    },
    {
      path: '/reposts/:id',
      name: 'reposts',
      props: true,
      component: () => import('../views/Reposts.vue'),
    },
    {
      path: '/posts-by-tag/:id',
      name: 'posts-by-tag',
      props: true,
      component: () => import('../views/PostsByTag.vue'),
    },
    {
      path: '/post/:id',
      name: 'post',
      props: true,
      component: () => import('../views/Post.vue'),
    },
    {
      path: '/edit-post/:id',
      name: 'edit-post',
      props: true,
      component: () => import('../views/EditPostView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/messenger',
      name: 'messenger',
      component: () => import('../views/Messenger.vue'),
    },
    {
      path: '/chat/:id',
      name: 'chat',
      props: true,
      component: () => import('../views/Chat.vue'),
    },
    {
      path: '/admin-panel',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/complaint/:id',
      name: 'complaint',
      props: true,
      component: () => import('../views/Complaint.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  let token = store.getters.token;
  let isVerified = false
  let isBanned = false

  if (token === undefined) { //token undefined after app restart
    await axios.get(store.getters.serverPath + '/api/checkAuth').then(res => {
      token = res.data.token
    }).catch(err => {
      console.log(err.response.data.message)
    })
  }

  if (token === false) {
    if (to.name === 'login' || to.name === 'register' || to.name === 'forgot' || to.name === 'reset-password') {
      next();
    } else {
      next({name: 'login'});
    }
  } else {
    await axios.get(store.getters.serverPath + '/api/checkVerify').then(res => {
      isVerified = res.data
    }).catch(err => {
      console.log(err.response.data.message)
    })

    if (!isVerified) {
      if(to.name === 'verify') {
        return next()
      } else if (to.name !== 'unverified') {
        return next({name: 'unverified'});
      } else {
        return next()
      }
    }

    await axios.get(store.getters.serverPath + '/api/checkBanned').then(res => {
      isBanned = res.data
      console.log(res.data)
    }).catch(err => {
      console.log(err.response.data.message)
    })

    if (isBanned) {
      if (to.name !== 'banned') {
        return next({name: 'banned'});
      } else {
        return next()
      }
    }

    switch (to.name) {
      case 'login':
      case 'register':
        next({name: 'home'})
        break
      default:
        next()
        break
    }

  }
})

export default router
