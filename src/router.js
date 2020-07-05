import Vue from "vue";
import Router from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import AboutPage from "./views/AboutPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage,
    },
  ],
});
