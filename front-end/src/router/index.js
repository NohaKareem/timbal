import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Days from "../views/Days.vue";
import Categories from "../views/Categories.vue";
import Systems from "../views/Systems.vue";
import Variables from "../views/Variables.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/days",
    name: "Days",
    component: Days
  },
  {
    path: "/systems",
    name: "Systems",
    component: Systems
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories
  },
  {
    path: "/variables",
    name: "Variables",
    component: Variables
  },
  {
    path: "/signUp",
    name: "SignUp", 
    component: SignUp 
  },
  {
    path: "/signIn",
    name: "SignIn", 
    component: SignIn 
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
