import { types } from "./mutations";

export default {
  /**
   * Opens a file in active editor or primary editor
   * @param {String} id id of the file
   */
  openFile: async ({ state, commit }, { id }) => {
    // check if the file is already opened in the active editor
    if (!state.openFiles[state.activeEditor].includes(id)) {
      commit(types.SET_OPEN_FILES, {
        ...state.openFiles,
        [state.activeEditor]: [...state.openFiles[state.activeEditor], id],
      });
    }
    // set as the active file in the editor
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [state.activeEditor]: id,
    });
  },

  /**
   * Close a file from an editor
   * @param {String} editor Id/name of the editor
   * @param {String} id id of the file to be closed
   */
  closeFile: async ({ state, commit, dispatch }, { editor, id }) => {
    // check if the file is currently opened
    if (state.activeFiles[editor] === id) {
      console.log({ editor, id, isActive: true });
      //set the first file in the editor's open files as the active file

      await dispatch("setActiveFile", {
        editor,
        id:
          state.openFiles[editor].filter((_id) => _id !== id)[0] || null,
      });
    }

    // remove the file from the open editors
    commit(types.SET_OPEN_FILES, {
      ...state.openFiles,
      // check if there are any open files in the editor
      [editor]: state.openFiles[editor].filter((_id) => _id !== id),
    });
    // debugger
  },

  /**
   * Close a file from all the available editor
   * used when a file is being deleted
   * @param {String} id id of the file to be closed
   */
  closeFileFromAllEditor: async ({ state, dispatch }, { id }) => {
    // remove the file from the open files list of all editors
    const editors = Object.keys(state.openFiles);
    for (let i = 0; i < editors.length; i++) {
      if (state.openFiles[editors[i]].includes(id)) {
        await dispatch("closeFile", { editor: editors[i], id });
      }
    }
  },

  /**
   * Set a file as an active file in an editor
   * @param {String} editor name of the editor
   * @param {String} id id of the file to set active
   */
  setActiveFile: async ({ state, commit }, { editor, id }) => {
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [editor]: id,
    });
  },
};
