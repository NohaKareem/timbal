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
        logInput: [] // array of ids of categories being logged
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
        logInput(state, payload) {
            state.logInput = payload;
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
