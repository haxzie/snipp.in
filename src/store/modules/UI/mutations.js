import initialState, { PANELS } from "./initialState";

export const types = {
  SET_ACTIVE_PANEL_ID: "SET_ACTIVE_PANEL_ID",
  SET_SHOW_COMMAND_CENTER: "SET_SHOW_COMMAND_CENTER",
  SET_ACTIVE_THEME: "SET_ACTIVE_THEME",
  SET_SHOW_CREATE_FILE_MODAL: "SET_SHOW_CREATE_FILE_MODAL",
  SET_BOOTSTRAPPED_FILE_NAME: "SET_BOOTSTRAPPED_FILE_NAME",
};

export default {
  [types.SET_ACTIVE_PANEL_ID]: (state, panelId) => {
    state.activePanelId = panelId;
  },
  [types.SET_SHOW_COMMAND_CENTER]: (state, flag) => {
    state.showCommandCenter = !!flag;
  },
  [types.SET_ACTIVE_THEME]: (state, theme) => {
    state.activeTheme = theme;
  },
  [types.SET_SHOW_CREATE_FILE_MODAL]: (state, flag) => {
    state.showCreateFileModal = flag;
    if (!flag) {
      state.bootstrappedFileName = null;
    }
  },
  [types.SET_BOOTSTRAPPED_FILE_NAME]: (state, filename) => {
    state.bootstrappedFileName = filename;
  },
};
