import Login from './views/Login.vue'
import Manage from './views/Manage.vue'
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
            { path: '/imports', component: upload, name: '导入题库', hidden: false },
            { path: '/manage', component: Manage, name: '题目管理' },
            { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
];

export default routes;