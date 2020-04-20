import Vue from "vue";
import Vuex from 'vuex';
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

// vuex 
Vue.use(Vuex);
 
const store = new Vuex.Store({
    state: {
        variable: "5e3316671c71657e18823380", // current selected variable id, intiially tasks
        day: "", // current day id
        colors: [], // array of color-coding options
        logInput: [], // array of ids of categories being logged
        logStr: "", // string of category codes being logged
        currColor: "", // string value of color of current top level category being logged
        isLoggedIn: false // boolean determining if user is logged in
    }, 
    mutations: {
        // user(state, payload) {
        //     state.user = payload;
        // }, 
        variable(state, payload) {
            state.variable = payload;
        }, 
        day(state, payload) {
            state.day = payload;
        }, 
        colors(state, payload) {
            state.colors = payload;
        },
        logInput(state, payload) {
            state.logInput = payload;
        }, 
        logStr(state, payload) {
            state.logStr = payload;
        }, 
        currColor(state, payload) {
            state.currColor = payload;
        },
        isLoggedIn(state, payload) {
            state.isLoggedIn = payload;
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
