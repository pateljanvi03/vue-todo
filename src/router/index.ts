import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ListView from "../views/ListView.vue";
import LoginView from "../views/LoginView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/todos",
    name: "list",
    component: ListView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
