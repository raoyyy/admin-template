import Login from './views/Login.vue'
import Categories from './views/Categories.vue'
import Cases from './views/Cases.vue'
// import NotFound from './views/404.vue'
 import Home from './views/Home.vue'
 import upload from './components/upload.vue'
 import Form from './components/Form.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    // {
    //     // path: '/404',
    //     // component: NotFound,
    //     // name: '',
    //     // hidden: true
    // },
    // //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/categories', component: Categories, name: '分类管理', hidden: false },
            { path: '/cases', component: Cases, name: '案件管理' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
];

export default routes;