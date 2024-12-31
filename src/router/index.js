import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/home",
        name: "homepage",
        component: HomeView,
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/DashboardView.vue"),
    },
    {
        path: "/addpet",
        name: "addpet",
        component: () => import("../views/AddPet.vue"),
    },
    {
        path: "/addadmin",
        name: "addadmin",
        component: () => import("../views/AddAdmin.vue"),
    },
    {
        path: "/loading/:page/:page2?/:page3?/:page4?",
        name: "loading",
        component: () => import("../views/LoadingView.vue"),
    },
    {
        path: "/userinfo/:userid",
        name: "userinfo",
        component: () => import("../views/UserInfo.vue"),
    },
    {
        path: "/petinfo/:petid",
        name: "petinfo",
        component: () => import("../views/PetInfo.vue"),
    },
    {
        path: "/registers/:petid",
        name: "registers",
        component: () => import("../views/AddAndListRegisters.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    // console.log(`Navegando de: ${from.fullPath} para: ${to.fullPath}`);
    next();
});

export default router;
