import Layout from '@/layout'

export const redirctRouter = {
    path: "/",
    hidden: true,
    redirect: '/knowledge/list',
}

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: "/login",
    name: "login",
    hidden: true,
    meta: {
        title: "登录",
        noAuth: true
    },
    component: () => import("@/views/common/Login.vue")
};

export const page404 = {
    path: "/404",
    name: "404",
    hidden: true,
    meta: {
        title: "404-页面不存在",
        noAuth: true
    },
    component: () => import("@/views/common/404.vue")
};

export const page403 = {
  path: "/403",
  name: "403",
  hidden: true,
  meta: {
      title: "403-没有权限",
      noAuth: true
  },
  component: () => import("@/views/common/403.vue")
};

export const constantRoutes = [
    redirctRouter,
    loginRouter,
    page403,
    page404,
]

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: "/knowledge",
        meta: { title: "知识库", icon: "el-icon-s-management", },
        redirect: '/knowledge/list',
        component: Layout,
        children: [
            {
                path: "list",
                meta: { title: "知识库列表", permission: "knowledge_list" },
                name: "knowledgeList",
                component: () => import("@/views/knowledge/list.vue")
            },
            {
                path: "search",
                meta: { title: "知识库搜索", permission: "knowledge_search" },
                name: "search",
                component: () => import("@/views/knowledge/search.vue")
            },
        ]
    },
    { path: '*', redirect: '/404', hidden: true, meta: { title: "404",notInMenu: true } }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [...appRouter, ...constantRoutes];
