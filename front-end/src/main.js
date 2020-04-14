import Vue from "vue";
import Vuex from 'vuex';
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

// vuex 
Vue.use(Vuex);
 
const store = new Vuex.Store({
    state: {
        variable: "", // current selected variable id
        day: "", // current day id
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
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
