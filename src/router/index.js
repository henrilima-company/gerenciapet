import { createRouter, createWebHashHistory  } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddPet from "../views/AddPet.vue";
import AddAdmin from "../views/AddAdmin.vue";
import LoadingView from "../views/LoadingView.vue";
import UserInfo from "../views/UserInfo.vue";
import PetInfo from "../views/PetInfo.vue";
import AddAndListRegisters from "../views/AddAndListRegisters.vue";

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
        component: DashboardView,
    },
    {
        path: "/addpet",
        name: "addpet",
        component: AddPet,
    },
    {
        path: "/addadmin",
        name: "addadmin",
        component: AddAdmin,
    },
    {
        path: "/loading/:page/:page2?/:page3?/:page4?",
        name: "loading",
        component: LoadingView,
    },
    {
        path: "/userinfo/:userid",
        name: "userinfo",
        component: UserInfo,
    },
    {
        path: "/petinfo/:petid",
        name: "petinfo",
        component: PetInfo,
    },
    {
        path: "/registers/:petid",
        name: "registers",
        component: AddAndListRegisters,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
