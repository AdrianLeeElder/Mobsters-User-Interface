import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import locale from 'element-ui/lib/locale/lang/en'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars, faSpinner, faPaperPlane, faLightbulb, faCheckCircle);

Vue.component('font-awesome-icon', FontAwesomeIcon)

// Load the Sign-In Widget module
var OktaSignIn = require('@okta/okta-signin-widget');

// Use OktaSignIn
var signIn = new OktaSignIn({ baseUrl: 'https://dev-210965.okta.com' });

signIn.renderEl(
  // Assumes there is an empty element on the page with an id of 'osw-container'
  { el: '#osw-container' },

  function success(res) {
    // The properties in the response object depend on two factors:
    // 1. The type of authentication flow that has just completed, determined by res.status
    // 2. What type of token the widget is returning

    // The user has started the password recovery flow, and is on the confirmation
    // screen letting them know that an email is on the way.
    if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
      // Any followup action you want to take
      return;
    }

    // The user has started the unlock account flow, and is on the confirmation
    // screen letting them know that an email is on the way.
    if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
      // Any followup action you want to take
      return;
    }

    // The user has successfully completed the authentication flow
    if (res.status === 'SUCCESS') {

      // Handle success when the widget is not configured for OIDC

      if (res.type === 'SESSION_STEP_UP') {
        // Session step up response
        // If the widget is not configured for OIDC and the authentication type is SESSION_STEP_UP,
        // the response will contain user metadata and a stepUp object with the url of the resource
        // and a 'finish' function to navigate to that url
        console.log(res.user);
        console.log('Target resource url: ' + res.stepUp.url);
        res.stepUp.finish();
        return;
      } else {
        // If the widget is not configured for OIDC, the response will contain
        // user metadata and a sessionToken that can be converted to an Okta
        // session cookie:
        console.log(res.user);
        res.session.setCookieAndRedirect('https://acme.com/app');
        return;
      }


      // OIDC response

      // If the widget is configured for OIDC with a single responseType, the
      // response will be the token.
      // i.e. authParams.responseType = 'id_token':
      console.log(res.claims);
      signIn.tokenManager.add('my_id_token', res);

      // If the widget is configured for OIDC with multiple responseTypes, the
      // response will be an array of tokens:
      // i.e. authParams.responseType = ['id_token', 'token']
      signIn.tokenManager.add('my_id_token', res[0]);
      signIn.tokenManager.add('my_access_token', res[1]);

      return;
    }

  },

  function error(err) {
    // This function is invoked with errors the widget cannot recover from:
    // Known errors: CONFIG_ERROR, UNSUPPORTED_BROWSER_ERROR, OAUTH_ERROR, REGISTRATION_FAILED
  }
);

// signIn.showSignInToGetTokens({
//   clientId: '0oan3vml3k4TQUvJz356',
//   redirectUri: 'http://localhost:8080/implicit/callback',
//   scope: 'openid profile email',
//   // Return an access token from the authorization server
//   getAccessToken: true,
//   // Return an ID token from the authorization server
//   getIdToken: true,
//   scope: 'openid profile'
// });

Vue.use(router)
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
