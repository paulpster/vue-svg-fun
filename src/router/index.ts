import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/circles",
    name: "Apollonius",
    component: () => import("../views/Circles.vue")
  },
  {
    path: "/drawing",
    name: "Drawing Machine",
    component: () => import("../views/Drawing.vue")
  },
  {
    path: "/grids",
    name: "Grids",
    component: () => import("../views/Grids.vue")
  },
  {
    path: "/guilloche",
    name: "Guilloche",
    component: () => import("../views/Guilloche.vue")
  },
  {
    path: "/penrose",
    name: "Penrose",
    component: () => import("../views/Penrose.vue")
  },
  {
    path: "/spiro",
    name: "Spirograph",
    component: () => import("../views/Spiro.vue")
  },
  {
    path: "/tessel",
    name: "Tesslations",
    component: () => import("../views/Tesselate.vue")
  },
  {
    path: "/tiling",
    name: "Tilings",
    component: () => import("../views/Tiling.vue")
  },
  {
    path: "/testbed",
    name: "TestBed",
    component: () => import("../views/TestBed.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
