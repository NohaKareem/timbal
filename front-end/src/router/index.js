import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Days from "../views/Days.vue";
import Categories from "../views/Categories.vue";
import Systems from "../views/Systems.vue";
import SystemCategory from "../views/components/NewSystemCategoryWindow.vue";
import Variables from "../views/Variables.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Timeline from "../views/vis/Timeline.vue";
import Error from "../views/Error.vue";
import TimePortrait from "../views/TimePortrait.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/days"
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
    //~
    path: "/systemCategory",
    name: "SystemCategory",
    component: SystemCategory
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
    path: "/timeline",
    name: "Timeline",
    component: Timeline
  },
  {
    path: "/timePortraits",
    name: "TimePortrait",
    component: TimePortrait
  },
  {
    path: "*",
    name: "Error",
    component: Error
  },
];

const router = new VueRouter({
  routes
});

export default router;
