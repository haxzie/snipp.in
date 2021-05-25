import { EDITORS } from "./initialState";

export default {
  getActiveEditor: (state) => {
    return state.activeEditor;
  },
  getOpenFiles: (state, getters, rootState, rootGetters) => {
    return Object.keys(state.openFiles).reduce((result, editor) => {
      return Object.assign(result, {
        [editor]: state.openFiles[editor].reduce((file_results, id) => {
          const file = rootGetters["Files/getFile"](id);
          if (file) file_results.push(file);
          return file_results;
        }, []),
      });
    }, {});
  },
  getActiveFiles: (state, getters, rootState, rootGetters) => {
    const primary_id = state.activeFiles[EDITORS.primary];
    const secondary_id = state.activeFiles[EDITORS.secondary];
    return {
      [EDITORS.primary]: primary_id
        ? rootGetters["Files/getFile"](primary_id)
        : null,
      [EDITORS.secondary]: secondary_id
        ? rootGetters["Files/getFile"](secondary_id)
        : null,
    };
  },
  getActiveFileList: (state, getters, rootState, rootGetters) => {
    const activeFiles = getters["getActiveFiles"];
    return Object.keys(activeFiles).reduce((result, editor) => {
      if (activeFiles[editor]) {
        return Object.assign(result, {
          [activeFiles[editor].id]: true,
        });
      } else {
        return result;
      }
    }, {});
  },
  getChildren: (state, getters, rootState, rootGetters) => (parent_id) => {
    const files = rootGetters["Files/getFiles"];
    const children = files.filter((item) => item.parent === parent_id);
    return children;
  },
  getDraggingId: (state) => {
    return state.draggingId;
  },
  getDraggingFileId: (state) => {
    return state.draggingFileId;
  }
};
