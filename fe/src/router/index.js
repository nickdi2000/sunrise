import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue'
import Contact from '../pages/Contact.vue'
import NotFound from '../pages/NotFound.vue'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'
import Messages from '../pages/Messages.vue'
import { isAuthenticated } from '../utils/auth'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/contact', name: 'Contact', component: Contact },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true },
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/admin')
      } else {
        next()
      }
    }
  },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: Admin,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/login')
      } else {
        next()
      }
    }
  },
  { 
    path: '/admin/messages', 
    name: 'Messages', 
    component: Messages,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/login')
      } else {
        next()
      }
    }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router