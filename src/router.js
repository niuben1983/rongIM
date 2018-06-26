'use strict';
import Vue from 'vue'
import Router from 'vue-router'

//import Dealers from './page/dealers/app'
//import Messages from './page/messages/app'
//import MessagesDetail from './page/messagesDetail/app'
//import Map from './page/map/app'
//import Author from './page/author/app'
const Dealers = () => import(/* webpackChunkName: "dealers" */ './page/dealers/app')
const Messages = () => import(/* webpackChunkName: "messages" */ './page/messages/app')
const MessagesDetail = () => import(/* webpackChunkName: "messagesDetail" */ './page/messagesDetail/app')
const Map = () => import(/* webpackChunkName: "map" */ './page/map/app')
const Author = () => import(/* webpackChunkName: "author" */ './page/author/app')

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dealers'
        },
        {
            name: 'dealers',
            path: '/dealers',
            component: Dealers,
            meta: {
                title: '奥迪'
            }
        },
        {
            name: 'messages',
            path: '/messages',
            component: Messages,
            meta: {
                title: '奥迪'
            }
        },
        {
            name: 'messagesDetail',
            path: '/messages/:dealerId',
            component: MessagesDetail,
            meta: {
                title: '奥迪'
            }
        },
        //{
        //    name: 'register',
        //    path: '/register/:targetId',
        //    component: Register,
        //    meta: {
        //        title: '客户信息登记'
        //    }
        //},
        {
            name: 'map',
            path: '/map',
            component: Map,
            meta: {
                title: '位置'
            }
        },
        {
            name: 'author',
            path: '/author',
            component: Author,
            meta: {
                title: '授权'
            }
        }
    ]
})