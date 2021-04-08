import initialState, { PANELS } from "./initialState";

export const types = {
  SET_ACTIVE_PANEL_ID: "SET_ACTIVE_PANEL_ID"
};

export default {
 [types.SET_ACTIVE_PANEL_ID]: (state, panelId) => {
   state.activePanelId = panelId;
 }
};
