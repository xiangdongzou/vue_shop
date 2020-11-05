import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 注册树形表格组件
Vue.component('tree-table', TreeTable)
// 注册富文本编辑器组件
Vue.use(VueQuillEditor)
// 注册全局过滤器-时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const min = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')
  /* eslint-disable */
  return `${y}-${m}-${d} ${h}:${min}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
