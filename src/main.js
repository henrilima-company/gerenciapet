import * as Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueTheMask from "vue-the-mask";

import "./assets/style.css";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as IconsFa from "oh-vue-icons/icons/fa";
import * as IconsMd from "oh-vue-icons/icons/md";

const iconSets = [IconsFa, IconsMd];

const Icons = iconSets.flatMap(Object.values);
const Icon = Object.values({ ...Icons });
addIcons(...Icon);

import toastr from "toastr";
toastr.options = {
    maxOpened: 2,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: process.env.VUE_APP_TIMEOUT,
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};
import "toastr/build/toastr.min.css";

const app = Vue.createApp(App);

app.config.globalProperties.$formatDate = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    birthDate.setDate(birthDate.getDate() + 1);

    const formattedDate = birthDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return `${formattedDate}`;
};

app.config.globalProperties.$formatCurrency = (value) => {
    const realValue = Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRl",
    });

    return `${realValue}`;
};

app.use(VueTheMask);
app.use(router);
app.component("v-icon", OhVueIcon);
app.mount("#app");
