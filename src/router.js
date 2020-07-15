import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import Dashboard from "./views/Dashboard.vue";
import UserManagement from './views/UserManagement.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "dashBoard",
    component: Dashboard,
  },
  {
    path: "/admin",
    name: "UserManagement",
    component: UserManagement
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
