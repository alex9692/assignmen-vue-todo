import Vue from "vue";
import Vuex, { createLogger } from "vuex";
// import VuePersistance from "vuex-persist";

import user from "@/store/modules/user";
import todo from "@/store/modules/todo";

Vue.use(Vuex);

// const vuexPersist = new VuePersistance({
//   storage: window.localStorage,
//   modules: ["todo"],
// });

const store = new Vuex.Store({
  modules: {
    user,
    todo,
  },
  plugins: [createLogger()],
});

export default store;
