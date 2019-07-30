import Vue from "vue";
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import Util from "@/util";
import VueRouter from "vue-router";
import store from "@/store";
import {  constantRoutes } from "./router";

Vue.use(VueRouter);

const createRouter = () => new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

NProgress.configure({ showSpinner: false })


// 页面刷新时，重新赋值
if (Util.getStore("collapse")) {
    store.commit("common/changeCollapse", JSON.parse(Util.getStore("collapse")));
}
if (Util.getStore("currentMenu")) {
    store.commit("common/setCurrentMenu", Util.getStore("currentMenu"));
}
if (Util.getStore("tagsList")) {
    store.commit("common/setTagsList", JSON.parse(Util.getStore("tagsList")));
}
if (Util.getStore("currentTag")) {
    store.commit("common/setCurrentTag", Util.getStore("currentTag"));
}
if (Util.getStore("theme")) {
    store.commit("common/changeTheme", Util.getStore("theme"));
}

const whiteList = ['/login'] // no redirect whitelist

//使用钩子函数对路由进行权限跳转
router.beforeEach(async(to, from, next) => {
    NProgress.start()

    Util.title(to.meta.title);

    const hasToken = Util.getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
            NProgress.done()
        } else {
            next();
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router;
