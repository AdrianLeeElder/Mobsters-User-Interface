import Router from 'vue-router'
import Accounts from "@/components/Accounts.vue"
import Home from "@/components/Home.vue"
import Vue from 'vue'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
    issuer: 'https://dev-210965.okta.com/oauth2/default',
    client_id: '0oan3vml3k4TQUvJz356',
    redirect_uri: 'http://localhost:8080/implicit/callback',
    scope: 'openid profile email'
  })

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
            path: '/implicit/callback', 
            component: Auth.handleCallback()
        }
    ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router