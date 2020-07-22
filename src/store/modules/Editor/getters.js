import { EDITORS } from "./initialState";

export default {
  getActiveEditor: (state) => {
    return state.activeEditor;
  },
  getOpenFiles: (state, getters, rootState, rootGetters) => {
    return Object.keys(state.openFiles).reduce((result, editor) => {
      return Object.assign(result, {
        [editor]: state.openFiles[editor].reduce((file_results, file_id) => {
          const file = rootGetters["Files/getFile"](file_id);
          if (file) file_results.push(file);
          return file_results;
        }, []),
      });
    }, {});
  },
  getActiveFiles: (state, getters, rootState, rootGetters) => {
    const primary_file_id = state.activeFiles[EDITORS.primary];
    const secondary_file_id = state.activeFiles[EDITORS.secondary];
    return {
      [EDITORS.primary]: primary_file_id
        ? rootGetters["Files/getFile"](primary_file_id)
        : null,
      [EDITORS.secondary]: secondary_file_id
        ? rootGetters["Files/getFile"](secondary_file_id)
        : null,
    };
  },
};
