import { types } from "./mutations";

export default {
  /**
   * Opens a file in active editor or primary editor
   * @param {String} file_id id of the file
   */
  openFile: async ({ state, commit }, { file_id }) => {
    // check if the file is already opened in the active editor
    if (!state.openFiles[state.activeEditor].includes(file_id)) {
      commit(types.SET_OPEN_FILES, {
        ...state.openFiles,
        [state.activeEditor]: [...state.openFiles[state.activeEditor], file_id],
      });
    }
    // set as the active file in the editor
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [state.activeEditor]: file_id,
    });
  },

  /**
   * Close a file from an editor
   * @param {String} editor Id/name of the editor
   * @param {String} file_id id of the file to be closed
   */
  closeFile: async ({ state, commit }, { editor, file_id }) => {
    // remove the file from the open editors
    commit(types.SET_OPEN_FILES, {
      ...state.openFiles,
      [editor]:
        // check if there are any open files in the editor
        state.openFiles[editor] && state.openFiles[editor].length > 0
          ? state.openFiles[editor].filter((id) => id !== file_id)
          : null,
    });

    // check if the file is currently opened
    if (state.activeFiles[editor] === file_id) {
      console.log({ editor, file_id, isActive: true });
      //set the first file in the editor's open files as the active file
      commit(types.SET_ACTIVE_FILES, {
        ...state.activeFiles,
        [editor]:
          state.openFiles[editor] && state.openFiles[editor].length > 0
            ? state.openFiles[editor][0]
            : null,
      });
    }
  },

  /**
   * Close a file from all the available editor
   * used when a file is being deleted
   * @param {String} file_id id of the file to be closed
   */
  closeFileFromAllEditor: async ({ state, commit }, { file_id }) => {
    // remove the file from the open files list of all editors
    console.log(state.openFiles);
    commit(
      types.SET_OPEN_FILES,
      Object.keys(state.openFiles).reduce((result, editor) => {
        return Object.assign(result, {
          [editor]: state.openFiles[editor].filter(
            (_file_id) => _file_id !== file_id
          ),
        });
      }, {})
    );
    console.log(state.openFiles);
    // if the file is active in any editor, the active file to another file or none
    commit(
      types.SET_ACTIVE_FILES,
      Object.keys(state.activeFiles).reduce((result, editor) => {
        return Object.assign(result, {
          [editor]:
            state.activeFiles[editor] === file_id
              ? state.openFiles[editor] && state.openFiles[editor].length > 0
                ? state.openFiles[editor][0]
                : null
              : state.activeFiles[editor],
        });
      }, {})
    );
  },

  /**
   * Set a file as an active file in an editor
   * @param {String} editor name of the editor
   * @param {String} file_id id of the file to set active
   */
  setActiveFile: async ({ state, commit }, { editor, file_id }) => {
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [editor]: file_id,
    });
  },
};
