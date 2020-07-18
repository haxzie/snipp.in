import { types } from "./mutations";
import VFile from "@/models/vFile.model";
import db from "@/utils/db";

export default {
  openFile: async ({ state, commit }, file_id) => {
    // check if the file is already opened in the active editor
    if (!state.openFiles[state.activeEditor].includes(file_id)) {
      commit(types.SET_OPEN_FILES, {
        ...state.openFiles,
        [state.activeEditor]: [...state.openFiles[state.activeEditor], file_id],
      });
    }
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [state.activeEditor]: file_id,
    });
  },

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

  setActiveFile: async ({ state, commit }, { editor, file_id }) => {
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [editor]: file_id,
    });
  },
};
