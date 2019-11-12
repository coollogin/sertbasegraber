import Vue from 'vue'
import App from './App'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min'
import saveAs from 'file-saver'
//import 'file-saverjs'
//import TableExport from 'tableexport'
//import Nightmare from 'nightmare'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
