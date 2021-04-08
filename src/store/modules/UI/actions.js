import { types } from "./mutations";
import { PANELS } from "./initialState";

export default {
  /**
   * Sets the current panel to explorer panel
   */
  showExplorerPanel: ({ commit }) => {
    commit(types.SET_ACTIVE_PANEL_ID, PANELS.explorer.id);
  },
  /**
   * Sets the current panel to search panel
   */
  showSearchPanel: ({ commit }) => {
    commit(types.SET_ACTIVE_PANEL_ID, PANELS.search.id);
  },
  /**
   * Sets the current panelId 
   */
  setActivePanelId: ({ commit }, { id }) => {
    commit(types.SET_ACTIVE_PANEL_ID, id);
  }
};
