import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import modules from "./modules";
import { DB_VERSION } from "@/utils/db";
import { validateBackup } from "@/utils/validators"

Vue.use(Vuex);
// const debug = process.env.NODE_ENV !== "production";
const debug = false;

export default new Vuex.Store({
  modules: {
    ...modules,
  },
  state: {
    //global state
  },
  actions: {
    clearAll: async ({ commit, dispatch }) => {
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
    },
    generateBackupData: async ({ dispatch }) => {
      const filesBackup = await dispatch("Files/createExportPayload", null, {
        root: true,
      });
      const settingsBackup = await dispatch("UI/createExportPayload", null, {
        root: true,
      });
      const date = new Date();
      const backup = {
        DB_VERSION,
        created_at: date.toISOString(),
        ...filesBackup,
        ...settingsBackup,
      };
      return backup;
    },
    restoreBackup: async ({ dispatch }, { backup }) => {
      const isValidBackup = validateBackup(backup);
      if (isValidBackup && backup.files ) {
        console.log("Backup is valid");
        await dispatch("Files/restoreFiles", { files: backup.files }, { root: true })
      }
    }
  },
  mutations: {},
  strict: debug,
  plugins: debug ? [createLogger()] : [], // set logger only for development
});
