import initialState, { EDITORS } from "./initialState";

export const types = {
  SET_OPEN_FILES: "SET_OPEN_FILES",
  SET_ACTIVE_FILES: "SET_ACTIVE_FILES",
  SET_ACTIVE_EDITOR: "SET_ACTIVE_EDITOR",
  RESET: "RESET",
  SET_DRAGGING_ID: "SET_DRAGGING_ID",
  SET_DRAGGING_FILE_ID: "SET_DRAGGING_FILE_ID"
};

export default {
  [types.SET_DRAGGING_ID]: (state, draggingId) => {
    state.draggingId = draggingId;
  },
  [types.SET_DRAGGING_FILE_ID]: (state, draggingFileId) => {
    state.draggingFileId = draggingFileId;
  },
  [types.SET_OPEN_FILES]: (state, openFiles) => {
    state.openFiles = openFiles;
  },
  [types.SET_ACTIVE_EDITOR]: (state, activeEditor) => {
    state.activeEditor = activeEditor || EDITORS.primary;
  },
  [types.SET_ACTIVE_FILES]: (state, activeFiles) => {
    state.activeFiles = activeFiles;
  },
  // Resets the current module
  [types.RESET]: (state) => {
    const freshState = initialState();
    Object.keys(freshState).forEach((key) => {
      state[key] = freshState[key];
    });
  },
};
