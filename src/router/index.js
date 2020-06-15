/**
 * 用户信息实体类
 * Created at 2020/5/21 10:07
 *
 * @author DaiHai
 * @version 1.0
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const warehouse = () => import('../views/Warehouse')
const goods = () => import('../views/Goods')
const userInfo = () => import('../views/UserInfo')
const authority = () => import('../views/Authority')
const login = () => import('../views/Login')
const retrievePassword = () => import('../views/RetrievePassword')
const home = () => import('../components/Home')
const homeUpdatePass = () => import('../views/HomeUpdatePass')
const supplier = () => import('../views/Supplier')
const logger = () => import('../views/Logger')
const personalInfo = () => import('../views/PersonalInfo')
const stock = () => import('../views/Stock')
const order = () => import('../views/Order')


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/retrievePassword',
        component: retrievePassword
    },
    {
        path: '/home',
        redirect: '/userInfo',
        component: home,
        children: [
            { //人员管理
                path: '/userInfo',
                meta: {
                    name: '人员信息',
                    comp: 'userInfo'
                },
                component: userInfo
            },
            { //权限管理
                path: '/authority',
                meta: {
                    name: '权限信息',
                    comp: 'authority'
                },
                component: authority
            },
            { //仓库管理
                path: '/warehouse',
                meta: {
                    name: '仓库信息',
                    comp: 'warehouse'
                },
                component: warehouse
            },
            { //物品管理
                path: '/goods',
                meta: {
                    name: '物品信息',
                    comp: 'goods'
                },
                component: goods
            },
            { //修改密码
                path: '/homeUpdatePass',
                meta: {
                    name: '修改密码',
                    comp: 'homeUpdatePass'
                },
                component: homeUpdatePass
            },
            { //供货商管理
                path: '/supplier',
                meta: {
                    name: '供货商信息',
                    comp: 'supplier'
                },
                component: supplier
            },
            { //日志管理
                path: '/logger',
                meta: {
                    name: '日志查询',
                    comp: 'logger'
                },
                component: logger
            }
            ,
            { //个人信息
                path: '/personalInfo',
                meta: {
                    name: '个人信息',
                    comp: 'personalInfo'
                },
                component: personalInfo
            }
            ,
            { //个人信息
                path: '/stock',
                meta: {
                    name: '库存管理',
                    comp: 'stock'
                },
                component: stock
            },
            { //下单管理
                path: '/order',
                meta: {
                    name: '下单管理',
                    comp: 'order'
                },
                component: order
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

/*
* 全局前置路由
* */
router.beforeEach((to, from, next) => {
    //校验是否找回密码
    if(to.path == '/retrievePassword'){
        next()
        //校验是否登录，防止不登录，直接进入其他页面
    }else if((to.path == '/login' && from.path === '/') || (to.path == '/userInfo' && from.path === '/login')) {
        next()
    } else {
        if(sessionStorage.getItem('profile') === null) {
            next('/login')
        } else {
            next()
        }
    }
})


//重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

export default router
