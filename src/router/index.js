import Router from 'vue-router'
import Accounts from "@/components/Accounts.vue"
import Home from "@/components/Home.vue"
import Templates from "@/components/Templates.vue"
import Vue from 'vue'
import Auth from '@okta/okta-vue'

var clientId = process.env.CLIENT_ID ? process.env.CLIENT_ID : '0oan3vml3k4TQUvJz356';

Vue.use(Auth, {
    issuer: 'https://dev-210965.okta.com/oauth2/default',
    client_id: clientId,
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