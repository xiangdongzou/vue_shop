import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "user_right_role" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "user_right_role" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "user_right_role" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// import Goods from '../components/goods/Goods.vue'
const Goods = () => import(/* webpackChunkName: "goods_add" */ '../components/goods/Goods.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "goods_add" */ '../components/goods/Add.vue')

// import Orders from '../components/orders/Orders.vue'
const Orders = () => import(/* webpackChunkName: "order_report" */ '../components/orders/Orders.vue')
// import Reports from '../components/reports/Reports.vue'
const Reports = () => import(/* webpackChunkName: "order_report" */ '../components/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
