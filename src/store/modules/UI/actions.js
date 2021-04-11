import { types } from "./mutations";
import { PANELS } from "./initialState";

export default {
  /**
   * Sets the current panel to explorer panel
   */
  showExplorerPanel: async ({ commit }) => {
    commit(types.SET_ACTIVE_PANEL_ID, PANELS.explorer.id);
  },
  /**
   * Sets the current panel to search panel
   */
  showSearchPanel: async ({ commit }) => {
    commit(types.SET_ACTIVE_PANEL_ID, PANELS.search.id);
  },
  /**
   * Sets the current panelId 
   */
  setActivePanelId: async ({ commit }, { id }) => {
    commit(types.SET_ACTIVE_PANEL_ID, id);
  },
  /**
   * Sets the visibility of the command center
   */
  setShowCommandCenter: async ({ commit }, flag) => {
    commit(types.SET_SHOW_COMMAND_CENTER, flag);
  },
  /**
   * Creates the options to export
   */
  createExportPayload: async ({ state }) => {
    return {
      settings: {}
    }
  }
};
