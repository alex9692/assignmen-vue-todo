import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/Home.component.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    // beforeEnter: (to, from, next) => {
    //   store.watch(
    //     (state) => {
    //       return state.user.currentUser;
    //     },
    //     (currentUser) => {
    //       console.log("aa");
    //       if (!currentUser) {
    //         next("/login");
    //       } else {
    //         next('/');
    //       }
    //     }
    //   );
    // },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Auth.component"),

    // beforeEnter: (to, from, next) => {
    //   store.watch(
    //     (state) => {
    //       return state.user.currentUser;
    //     },
    //     (currentUser) => {
    //       if (currentUser) {
    //         next("/");
    //       } else {
    //         next();
    //       }
    //     }
    //   );
    // },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
