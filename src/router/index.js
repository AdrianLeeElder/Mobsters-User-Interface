import Router from 'vue-router'
import Accounts from "@/components/Accounts.vue"
import Home from "@/components/Home.vue"
import Templates from "@/components/Templates.vue"
import Vue from 'vue'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
    issuer: 'https://dev-210965.okta.com/oauth2/default',
    client_id: process.env.VUE_APP_CLIENT_ID,
    redirect_uri: process.env.VUE_APP_REDIRECT_URI,
    scope: 'openid profile email'
  })

  console.log(process.env.VUE_APP_CLIENT_ID)
  console.log(process.env.VUE_APP_REDIRECT_URI)
  
Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/accounts',
            name: 'Accounts',
            component: Accounts,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/templates',
            name: 'Templates',
            component: Templates,
            meta: {
                requiresAuth: true
            }
        },
        { 
            path: '/implicit/callback', 
            component: Auth.handleCallback()
        }
    ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router