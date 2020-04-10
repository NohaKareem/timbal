import Vue from "vue";
import Vuex from 'vuex';

// import App from './components/App'; // vuex
import App from "./App.vue";
import router from "./router";
// import store from "./store";//~before vuex

Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app");

// vuex 
Vue.use(Vuex);
 
const store = new Vuex.Store({
    state: {
        // todos: null
        variable: "hello"
    }, 
    mutations: {
        // user(state, payload) {
        //     state.user = payload;
        // }, 
        variable(state, payload) {
            state.variable = payload;
        }
    }
});
 
// new Vue ({
//     el: '#app',
//     router, 
//     store, 
//     components: { App }
// });


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
