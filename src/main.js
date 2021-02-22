import Vue from 'vue'
import App from './App.vue'
import './app.css'
// import axios from 'axios'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)


Vue.config.productionTip = false
// Vue.use(axios)

//key000141akje73182749

new Vue({
  render: h => h(App),
}).$mount('#app')
