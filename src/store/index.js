import Vue from "vue";
import Vuex from "vuex";
// import createLogger from "vuex/dist/logger";
import modules from "./modules";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    ...modules,
  },
  state: {
    //global state
  },
  actions: {
    clearAll({ commit, dispatch }) {
      // resetting state of the modules
      Object.keys(modules).forEach((moduleName) => {
        try {
          commit(`${moduleName}/reset`);
        } catch (error) {
          if (process.env.VUE_APP_ENV === "dev") {
            console.error(
              "NO RESET MUTATION FOUND",
              `Reset mutation missing in Store/${moduleName}`
            );
          }
        }
      });
      dispatch("clearCore");
    }
  },
  mutations: {},
  strict: debug,
  // plugins: debug ? [createLogger()] : [] // set logger only for development
});